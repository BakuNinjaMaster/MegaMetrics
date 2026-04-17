import React from 'react'
import Section from '../Section'

const WEATHER_LABELS  = { sun: 'Harsh sun', rain: 'Heavy rain', sand: 'Sandstorm', snow: 'Snow' }
const TERRAIN_LABELS  = { electric: 'Electric', grassy: 'Grassy', misty: 'Misty', psychic: 'Psychic' }
const DEFAULT_TURNS   = {
  tailwindYour: 4, tailwindEnemy: 4, trickRoom: 5,
  reflectYour: 5,  reflectEnemy: 5,
  lightScreenYour: 5, lightScreenEnemy: 5,
}

// Helper to keep turns between 0 and 8
const clampTurns = (val) => Math.max(0, Math.min(8, Number(val)))

function ToggleRow({ label, activeKey, turnsKey, active, turns, onOverride, warn, danger }) {
  let color = active ? '#97C459' : 'var(--text-hint)'
  if (active && warn)   color = '#FAC775'
  if (active && danger) color = '#F09595'

  function handleToggle() {
    const next = !active
    onOverride(activeKey, next)
    if (next && turnsKey) onOverride(turnsKey, DEFAULT_TURNS[activeKey] ?? 5)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '4px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {active && turnsKey && (
          <>
            <input
              type="number" min={0} max={8} value={turns}
              onChange={e => onOverride(turnsKey, clampTurns(e.target.value))}
              style={{
                width: 28, background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 3,
                padding: '1px 4px', fontSize: 9, textAlign: 'center',
              }}
            />
            <span style={{ fontSize: 8, color: 'var(--text-hint)' }}>t</span>
          </>
        )}
        <span style={{ fontSize: 9, fontWeight: 500, color, minWidth: 44, textAlign: 'right' }}>
          {active ? 'Active' : 'Inactive'}
        </span>
        <button
          onClick={handleToggle}
          style={{
            fontSize: 8, padding: '1px 7px', borderRadius: 3,
            border: `0.5px solid ${active
              ? warn   ? 'rgba(186,117,23,0.4)'
              : danger ? 'rgba(162,45,45,0.4)'
              :          'rgba(99,153,34,0.4)'
              : 'rgba(255,255,255,0.1)'}`,
            background: active
              ? warn   ? 'rgba(186,117,23,0.12)'
              : danger ? 'rgba(162,45,45,0.12)'
              :          'rgba(63,130,37,0.12)'
              : 'transparent',
            color,
          }}
        >
          {active ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  )
}

// NEW: Reusable row for Weather and Terrain dropdowns
function SelectRow({ label, activeKey, turnsKey, activeValue, turnsValue, options, activeColor, onOverride }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '4px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {activeValue && (
          <>
            <input
              type="number" min={0} max={8} value={turnsValue}
              onChange={e => onOverride(turnsKey, clampTurns(e.target.value))}
              style={{
                width: 28, background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 3,
                padding: '1px 4px', fontSize: 9, textAlign: 'center',
              }}
            />
            <span style={{ fontSize: 8, color: 'var(--text-hint)' }}>t</span>
          </>
        )}
        <select
          value={activeValue ?? ''}
          onChange={e => {
            const val = e.target.value || null
            onOverride(activeKey, val)
            
            if (!val) {
              onOverride(turnsKey, 0)
            } else if (!activeValue) {
              // Only reset to 5 if we are turning it on from a "None" state
              onOverride(turnsKey, 5)
            }
          }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 4, padding: '2px 6px', fontSize: 10,
            color: activeValue ? activeColor : 'var(--text-muted)',
          }}
        >
          <option value="">None</option>
          {Object.entries(options).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function FieldConditionsPanel({ field, onOverride }) {
  const f = field || {}

  function set(path, value) {
    onOverride(`field.${path}`, value)
  }

  return (
    <Section title="Field conditions">
      <SelectRow 
        label="Weather" 
        activeKey="weather" 
        turnsKey="weatherTurns" 
        activeValue={f.weather} 
        turnsValue={f.weatherTurns} 
        options={WEATHER_LABELS} 
        activeColor="#FAC775" 
        onOverride={set} 
      />
      
      <SelectRow 
        label="Terrain" 
        activeKey="terrain" 
        turnsKey="terrainTurns" 
        activeValue={f.terrain} 
        turnsValue={f.terrainTurns} 
        options={TERRAIN_LABELS} 
        activeColor="#97C459" 
        onOverride={set} 
      />

      <ToggleRow label="Tailwind (you)"       activeKey="tailwindYour"     turnsKey="tailwindYourTurns"     active={!!f.tailwindYour}     turns={f.tailwindYourTurns}     onOverride={set} />
      <ToggleRow label="Tailwind (enemy)"     activeKey="tailwindEnemy"    turnsKey="tailwindEnemyTurns"    active={!!f.tailwindEnemy}    turns={f.tailwindEnemyTurns}    onOverride={set} danger />
      <ToggleRow label="Trick Room"           activeKey="trickRoom"        turnsKey="trickRoomTurns"        active={!!f.trickRoom}        turns={f.trickRoomTurns}        onOverride={set} warn />
      <ToggleRow label="Reflect (you)"        activeKey="reflectYour"      turnsKey="reflectYourTurns"      active={!!f.reflectYour}      turns={f.reflectYourTurns}      onOverride={set} />
      <ToggleRow label="Reflect (enemy)"      activeKey="reflectEnemy"     turnsKey="reflectEnemyTurns"     active={!!f.reflectEnemy}     turns={f.reflectEnemyTurns}     onOverride={set} danger />
      <ToggleRow label="Light Screen (you)"   activeKey="lightScreenYour"  turnsKey="lightScreenYourTurns"  active={!!f.lightScreenYour}  turns={f.lightScreenYourTurns}  onOverride={set} />
      <ToggleRow label="Light Screen (enemy)" activeKey="lightScreenEnemy" turnsKey="lightScreenEnemyTurns" active={!!f.lightScreenEnemy} turns={f.lightScreenEnemyTurns} onOverride={set} danger />
    </Section>
  )
}