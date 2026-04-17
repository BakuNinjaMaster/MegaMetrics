import { useState, useEffect, useCallback } from 'react'

const INITIAL_STATE = {
  activeYour:  [null, null],
  activeEnemy: [null, null],
  hpPercent:   { your: [100, 100], enemy: [100, 100] },
  statStages: {
    your:  [{ atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }],
    enemy: [{ atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }],
  },
  field: {
    weather: null,       weatherTurns: 0,
    terrain: null,       terrainTurns: 0,
    tailwindYour: false, tailwindYourTurns: 0,
    tailwindEnemy: false,tailwindEnemyTurns: 0,
    trickRoom: false,    trickRoomTurns: 0,
    reflectYour: false,  reflectYourTurns: 0,
    reflectEnemy: false, reflectEnemyTurns: 0,
    lightScreenYour: false,  lightScreenYourTurns: 0,
    lightScreenEnemy: false, lightScreenEnemyTurns: 0,
  },
  currentMoves: [],
  damageCalcs:  [],
  speedOrder:   [],
  turn: 0,
}

export function useBattleState() {
  const [battleState, setBattleState] = useState(INITIAL_STATE)

  // OPTIMIZATION: Removed the 1000ms polling loop. 
  // We only need to fetch the initial state exactly once when the app boots.
  // All future updates are driven perfectly by App.jsx's captureFrame!
  useEffect(() => {
    async function syncInitial() {
      if (!window.metaAPI) return
      const state = await window.metaAPI.getBattleState()
      if (state) setBattleState(state)
    }
    syncInitial()
  }, [])

  const updateFromOCR = useCallback((newState) => {
    if (!newState) return
    // OPTIMIZATION: The backend is the source of truth. Just replace the state.
    setBattleState(newState)
  }, [])

  const manualOverride = useCallback(async (path, value) => {
    if (window.metaAPI) {
      // The backend recalculates Smogon damage/speeds and returns the complete new state
      const recalced = await window.metaAPI.manualOverride({ path, value })
      if (recalced) setBattleState(recalced)
    } else {
      // Dev fallback if running without Electron
      setBattleState(prev => {
        const next = JSON.parse(JSON.stringify(prev))
        const keys = path.split('.')
        let obj = next
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
        obj[keys[keys.length - 1]] = value
        return next
      })
    }
  }, [])

  const advanceTurn = useCallback(async () => {
    if (window.metaAPI) {
      const newState = await window.metaAPI.advanceTurn()
      if (newState) setBattleState(newState)
    }
  }, [])

  const resetBattle = useCallback(async () => {
    setBattleState(INITIAL_STATE)
    if (window.metaAPI) {
      const newState = await window.metaAPI.resetBattle()
      if (newState) setBattleState(newState)
    }
  }, [])

  return { battleState, updateFromOCR, manualOverride, advanceTurn, resetBattle }
}