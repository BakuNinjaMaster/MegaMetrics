const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
let mainWindow
let settings
let battleState
let cleanupOCRWorker = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    minWidth: 800,
    minHeight: 500,
    backgroundColor: '#0e0f1a',
    titleBarStyle: 'hiddenInset',
    title: 'MetaMetric',
    icon: path.join(__dirname, '../../src/renderer/assets/icon.ico'),
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  const { loadSettings, saveSettings } = require('./settings-manager')
  const { startOCRWorker, stopOCRWorker, setRegions } = require('./ocr-worker')
  const { BattleStateManager } = require('./battle-state')

  cleanupOCRWorker = stopOCRWorker

  settings = loadSettings()
  battleState = new BattleStateManager()

  if (settings.ocrRegions) setRegions(settings.ocrRegions)

  ipcMain.handle('get-settings', async () => settings)

  ipcMain.handle('save-team', async (event, team) => {
    try {
      settings.yourTeam = team
      saveSettings(settings)
      battleState.setTeamConfig(team)
      return true
    } catch (err) {
      console.error('Failed to save team:', err)
      return false
    }
  })

  ipcMain.handle('save-ocr-regions', async (event, regions) => {
    try {
      settings.ocrRegions = regions
      saveSettings(settings)
      setRegions(regions)
      return true
    } catch (err) {
      console.error('Failed to save OCR regions:', err)
      return false
    }
  })

  ipcMain.handle('save-prefs', async (event, prefs) => {
    try {
      settings.prefs = { ...settings.prefs, ...prefs }
      saveSettings(settings)
      return true
    } catch (err) {
      console.error('Failed to save preferences:', err)
      return false
    }
  })

  ipcMain.handle('process-frame', async (event, frameDataUrl) => {
    try {
      const ocrResult = await startOCRWorker(frameDataUrl)
      const updatedState = battleState.update(ocrResult, settings.yourTeam)
      return updatedState
    } catch (err) {
      console.error('Frame processing error:', err)
      return null
    }
  })

  ipcMain.handle('manual-override', async (event, payload) => {
    battleState.manualOverride(payload)
    return battleState.getState()
  })

  ipcMain.handle('get-battle-state', async () => battleState.getState())

  ipcMain.handle('reset-battle', async () => {
    battleState.reset()
    return battleState.getState()
  })

  ipcMain.handle('advance-turn', async () => {
    battleState.advanceTurn()
    return battleState.getState()
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', async () => {
  if (cleanupOCRWorker) {
    try {
      await cleanupOCRWorker()
    } catch (err) {
      console.error('Failed to cleanly stop OCR worker:', err)
    }
  }
})
