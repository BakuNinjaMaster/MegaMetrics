const { contextBridge, ipcRenderer } = require('electron')

// IMPROVEMENT: Whitelist of allowed channels for Main -> Renderer communication.
// This maintains security while allowing the backend to push events to the frontend.
const ALLOWED_LISTEN_CHANNELS = ['ocr-status-update', 'hotkey-pressed', 'backend-error']

contextBridge.exposeInMainWorld('metaAPI', {
  // ==========================================
  // BATTLE STATE
  // ==========================================
  
  /** @param {string} frameDataUrl - Base64 image string of the game frame */
  processFrame:   (frameDataUrl) => ipcRenderer.invoke('process-frame', frameDataUrl),
  
  /** @param {Object} payload - { path: string, value: any } for manual stat adjustments */
  manualOverride: (payload)      => ipcRenderer.invoke('manual-override', payload),
  
  /** @returns {Promise<Object>} The current complete battle state object */
  getBattleState: ()             => ipcRenderer.invoke('get-battle-state'),
  
  /** @returns {Promise<Object>} The fresh, empty battle state object */
  resetBattle:    ()             => ipcRenderer.invoke('reset-battle'),
  
  /** @returns {Promise<Object>} The updated battle state after decrementing turn counters */
  advanceTurn:    ()             => ipcRenderer.invoke('advance-turn'),

  // ==========================================
  // SETTINGS
  // ==========================================
  
  /** @returns {Promise<Object>} The user's saved settings */
  getSettings:    ()             => ipcRenderer.invoke('get-settings'),
  
  /** @param {Array} team - Array of Pokemon team objects */
  saveTeam:       (team)         => ipcRenderer.invoke('save-team', team),
  
  /** @param {Object} regions - Coordinate map for the OCR bounding boxes */
  saveOcrRegions: (regions)      => ipcRenderer.invoke('save-ocr-regions', regions),
  
  /** @param {Object} prefs - General UI/app preferences */
  savePrefs:      (prefs)        => ipcRenderer.invoke('save-prefs', prefs),

  // ==========================================
  // EVENT LISTENERS (Main -> Renderer)
  // ==========================================
  
  /**
   * Listen for unsolicited messages pushed by the Main process.
   * @param {string} channel - The event channel to listen to
   * @param {function} callback - Function to run when the event fires
   * @returns {function} A cleanup function to remove the listener
   */
  onBackendMessage: (channel, callback) => {
    if (ALLOWED_LISTEN_CHANNELS.includes(channel)) {
      // Strip the raw 'event' object to prevent IPC leaks, pass only the data arguments
      const subscription = (_event, ...args) => callback(...args)
      ipcRenderer.on(channel, subscription)
      
      // Return a teardown function so React/Vue `useEffect` hooks can clean up properly
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  }
})