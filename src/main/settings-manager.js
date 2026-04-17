const fs = require('fs')
const path = require('path')
const { app } = require('electron')

function getSettingsPath() {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'settings.json')
}

const DEFAULT_SETTINGS = {
  yourTeam: [],
  ocrRegions: {
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
  },
  prefs: {
    ocrIntervalMs: 2500, // Correct default
    feedSize: 'sm',
    ocrEnabled: false,
  },
}

function loadSettings() {
  try {
    const p = getSettingsPath()
    if (!fs.existsSync(p)) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    const raw = fs.readFileSync(p, 'utf-8')
    const loaded = JSON.parse(raw)
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)), loaded)
  } catch (err) {
    console.error('Failed to load settings:', err)
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
  }
}

// Atomic Saving Implementation
async function saveSettings(settings) {
  try {
    const p = getSettingsPath()
    const tempPath = p + '.tmp'

    await fs.promises.mkdir(path.dirname(p), { recursive: true })
    await fs.promises.writeFile(tempPath, JSON.stringify(settings, null, 2), 'utf-8')
    await fs.promises.rename(tempPath, p)
    
    return true
  } catch (err) {
    console.error('Failed to save settings:', err)
    return false
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {}
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

module.exports = { loadSettings, saveSettings, DEFAULT_SETTINGS }