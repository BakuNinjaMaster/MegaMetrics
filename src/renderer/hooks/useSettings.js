import { useState, useEffect, useCallback } from 'react'

const DEFAULT_TEAM = Array(6).fill(null).map(() => ({
  name: '',
  nature: 'Hardy',
  item: '',
  ability: '',
  moves: ['', '', '', ''],
  evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  tera: '',
}))

const DEFAULT_PREFS = {
  // IMPROVEMENT: Synced with the backend default to prevent CPU thrashing on first boot
  ocrIntervalMs: 2500, 
  feedSize: 'sm',
  ocrEnabled: false,
}

export function useSettings() {
  const [team, setTeam] = useState(DEFAULT_TEAM)
  const [ocrRegions, setOcrRegions] = useState(null)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      if (!window.metaAPI) { 
        setLoaded(true) 
        return 
      }
      
      const settings = await window.metaAPI.getSettings()
      
      if (settings.yourTeam?.length) {
        const merged = DEFAULT_TEAM.map((d, i) =>
          settings.yourTeam[i] ? { ...d, ...settings.yourTeam[i] } : d
        )
        setTeam(merged)
      }
      
      if (settings.ocrRegions) setOcrRegions(settings.ocrRegions)
      if (settings.prefs) setPrefs(p => ({ ...p, ...settings.prefs }))
      
      setLoaded(true)
    }
    load()
  }, [])

  const saveTeam = useCallback(async (newTeam) => {
    setTeam(newTeam)
    if (window.metaAPI) await window.metaAPI.saveTeam(newTeam)
  }, [])

  const saveOcrRegions = useCallback(async (regions) => {
    setOcrRegions(regions)
    if (window.metaAPI) await window.metaAPI.saveOcrRegions(regions)
  }, [])

  // IMPROVEMENT: Functional state update prevents race conditions if called rapidly
  const savePrefs = useCallback(async (newPrefs) => {
    // 1. Calculate the new state purely
    setPrefs(prevPrefs => {
      const merged = { ...prevPrefs, ...newPrefs }
      return merged
    })
    
    // 2. Fire the IPC call outside the updater. 
    // We can just send the delta (newPrefs) to the backend, 
    // since the backend merges it into the master settings object anyway!
    if (window.metaAPI) {
      window.metaAPI.savePrefs(newPrefs).catch(err => console.error('Failed to save prefs', err))
    }
  }, [])

  return { team, ocrRegions, prefs, loaded, saveTeam, saveOcrRegions, savePrefs }
}