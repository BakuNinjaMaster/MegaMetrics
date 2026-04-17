const Tesseract = require('tesseract.js')
const sharp = require('sharp')

let scheduler = null
let initPromise = null 
let REGIONS = null

const DEFAULT_REGIONS = {
  yourPokemon1:  { left: 30,   top: 820, width: 280, height: 40 },
  yourPokemon2:  { left: 30,   top: 870, width: 280, height: 40 },
  enemyPokemon1: { left: 760,  top: 80,  width: 280, height: 40 },
  enemyPokemon2: { left: 760,  top: 130, width: 280, height: 40 },
  yourHP1:       { left: 310,  top: 822, width: 100, height: 36 },
  yourHP2:       { left: 310,  top: 872, width: 100, height: 36 },
  enemyHP1:      { left: 1040, top: 82,  width: 100, height: 36 },
  enemyHP2:      { left: 1040, top: 132, width: 100, height: 36 },
  move1:         { left: 640,  top: 830, width: 200, height: 40 },
  move2:         { left: 640,  top: 875, width: 200, height: 40 },
  move3:         { left: 850,  top: 830, width: 200, height: 40 },
  move4:         { left: 850,  top: 875, width: 200, height: 40 },
  fieldText:     { left: 440,  top: 20,  width: 400, height: 60 },
}

function setRegions(regions) { REGIONS = regions }
function getRegions() { return REGIONS || DEFAULT_REGIONS }

async function initScheduler() {
  if (scheduler) return scheduler
  if (initPromise) return initPromise

  initPromise = (async () => {
    scheduler = Tesseract.createScheduler()
    const WORKER_COUNT = 4 
    for (let i = 0; i < WORKER_COUNT; i++) {
      const worker = await Tesseract.createWorker('eng', 1, { logger: () => {} })
      await worker.setParameters({
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%-/ '.",
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      })
      scheduler.addWorker(worker)
    }
    return scheduler
  })()

  return initPromise
}

async function preprocessCrop(imageClone, region, sourceWidth, sourceHeight) {
  const scaleX = sourceWidth / 1920
  const scaleY = sourceHeight / 1080
  const scaledRegion = {
    left:   Math.max(0, Math.round(region.left   * scaleX)),
    top:    Math.max(0, Math.round(region.top    * scaleY)),
    width:  Math.max(1, Math.round(region.width  * scaleX)),
    height: Math.max(1, Math.round(region.height * scaleY)),
  }
  
  // OPTIMIZATION: Using the cloned image directly
  return imageClone
    .extract(scaledRegion)
    .resize({ width: scaledRegion.width * 2, height: scaledRegion.height * 2 })
    .greyscale()
    .normalise()
    .sharpen()
    .png()
    .toBuffer()
}

async function readRegion(sched, baseImage, regionKey, sourceWidth, sourceHeight) {
  const region = getRegions()[regionKey]
  if (!region) return ''
  try {
    // OPTIMIZATION: Pass a clone of the Sharp instance to avoid re-decoding
    const cropped = await preprocessCrop(baseImage.clone(), region, sourceWidth, sourceHeight)
    const { data } = await sched.addJob('recognize', cropped)
    return data.text.trim()
  } catch (err) {
    console.error(`OCR failed for region ${regionKey}:`, err)
    return ''
  }
}

async function startOCRWorker(frameDataUrl) {
  const sched = await initScheduler()
  const base64 = frameDataUrl.replace(/^data:image\/\w+;base64,/, '')
  const imageBuffer = Buffer.from(base64, 'base64')
  
  // OPTIMIZATION: Instantiate Sharp once per frame
  const baseImage = sharp(imageBuffer)
  const meta = await baseImage.metadata()
  const { width: sourceWidth, height: sourceHeight } = meta

  const [
    yourPokemon1Raw, yourPokemon2Raw,
    enemyPokemon1Raw, enemyPokemon2Raw,
    yourHP1Raw, yourHP2Raw,
    enemyHP1Raw, enemyHP2Raw,
    move1Raw, move2Raw, move3Raw, move4Raw,
    fieldTextRaw,
  ] = await Promise.all([
    readRegion(sched, baseImage, 'yourPokemon1',  sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'yourPokemon2',  sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'enemyPokemon1', sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'enemyPokemon2', sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'yourHP1',       sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'yourHP2',       sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'enemyHP1',      sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'enemyHP2',      sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'move1',         sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'move2',         sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'move3',         sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'move4',         sourceWidth, sourceHeight),
    readRegion(sched, baseImage, 'fieldText',     sourceWidth, sourceHeight),
  ])

  return {
    yourPokemon:  [cleanName(yourPokemon1Raw), cleanName(yourPokemon2Raw)].filter(Boolean),
    enemyPokemon: [cleanName(enemyPokemon1Raw), cleanName(enemyPokemon2Raw)].filter(Boolean),
    yourHP:       [parseHP(yourHP1Raw), parseHP(yourHP2Raw)],
    enemyHP:      [parseHP(enemyHP1Raw), parseHP(enemyHP2Raw)],
    moves:        [move1Raw, move2Raw, move3Raw, move4Raw].map(cleanName).filter(Boolean),
    fieldText:    fieldTextRaw,
  }
}

function cleanName(raw) {
  return raw.replace(/[^a-zA-Z0-9\-'. ]/g, '').trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function parseHP(raw) {
  const pct = raw.match(/(\d{1,3})\s*%/)
  if (pct) return Math.min(100, parseInt(pct[1], 10))

  const frac = raw.match(/(\d+)\s*\/\s*(\d+)/)
  if (frac) {
    const current = parseInt(frac[1], 10)
    const max = parseInt(frac[2], 10)
    if (max > 0) return Math.min(100, Math.round((current / max) * 100))
  }
  return null
}

async function stopOCRWorker() {
  if (scheduler) {
    await scheduler.terminate()
    scheduler = null
    initPromise = null
  }
}

module.exports = { startOCRWorker, stopOCRWorker, setRegions }