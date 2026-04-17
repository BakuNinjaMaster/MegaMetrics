import React from 'react'
import Section from '../Section'

const STATS = ['atk', 'def', 'spa', 'spd', 'spe']
const STAT_LABELS = { atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' }

// IMPROVEMENT: Completely rewritten to support all 6 Pokémon stat stages compactly
function Pips({ stage }) {
  // Added Number() wrap to prevent string coercion issues
  const clamped = Math.max(-6, Math.min(6, Number(stage) || 0))
  const magnitude = Math.abs(clamped)
  const isPos = clamped > 0

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5, 6].map(slot => {
        let bg = 'rgba(255,255,255,0.09)' // empty state
        if (slot <= magnitude) {
          bg = isPos ? '#378ADD' : '#E24B4A' // Fill blue if positive, red if negative
        }
        return <div key={slot} style={{ width: 6, height: 6, borderRadius: 1, background: bg }} />
      })}
    </div>
  )
}

function StageRow({ stat, stage, onInc, onDec }) {
  // Safely parse the stage as a number
  const currentStage = Number(stage) || 0
  const color = currentStage > 0 ? '#85B7EB' : currentStage < 0 ? '#F09595' : 'var(--text-hint)'
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
      <span style={{ fontSize: 9, color: 'var(--text-muted)', width: 22 }}>
        {STAT_LABELS[stat]}
      </span>
      
      <Pips stage={currentStage} />
      
      <span style={{ fontSize: 9, fontWeight: 500, color, width: 16, textAlign: 'right' }}>
        {currentStage > 0 ? `+${currentStage}` : currentStage}
      </span>
      
      <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
        <button
          onClick={onDec}
          style={{
            width: 16, height: 16, borderRadius: 3, fontSize: 12, lineHeight: 1,
            border: '0.5px solid rgba(255,255,255,0.1)', color: '#F09595',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          −
        </button>
        <button
          onClick={onInc}
          style={{
            width: 16, height: 16, borderRadius: 3, fontSize: 12, lineHeight: 1,
            border: '0.5px solid rgba(255,255,255,0.1)', color: '#85B7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

// IMPROVEMENT: Updated to support Arrays for Double Battles (Slot 0 and Slot 1)
function SideBlock({ label, stagesArray, pathPrefix, onOverride }) {
  // Fallback in case stagesArray is undefined during first render
  const safeArray = Array.isArray(stagesArray) ? stagesArray : [{}, {}]

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 500 }}>
        {label}
      </div>
      
      {/* Render Slot 1 and Slot 2 side-by-side using Flexbox */}
      <div style={{ display: 'flex', gap: 16 }}>
        {safeArray.map((stages, index) => (
          <div key={index} style={{ flex: 1 }}>
            <div style={{ 
              fontSize: 9, color: 'var(--text-muted)', marginBottom: 6, 
              textTransform: 'uppercase', letterSpacing: 0.5 
            }}>
              Slot {index + 1}
            </div>
            
            {STATS.map(stat => (
              <StageRow
                key={stat}
                stat={stat}
                stage={stages?.[stat] ?? 0}
                onInc={() => {
                  // FIX: Forced Number wrapper to stop strings combining like "1" + 1 = "11"
                  const current = Number(stages?.[stat] ?? 0)
                  const next = Math.max(-6, Math.min(6, current + 1))
                  console.log(`[UI Click] Incrementing ${stat} to ${next}`)
                  onOverride(`statStages.${pathPrefix}.${index}.${stat}`, next)
                }}
                onDec={() => {
                  // FIX: Forced Number wrapper
                  const current = Number(stages?.[stat] ?? 0)
                  const next = Math.max(-6, Math.min(6, current - 1))
                  console.log(`[UI Click] Decrementing ${stat} to ${next}`)
                  onOverride(`statStages.${pathPrefix}.${index}.${stat}`, next)
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BuffTrackerPanel({ statStages, onOverride }) {
  return (
    <Section title="Stat stage changes" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SideBlock
        label="Your team"
        stagesArray={statStages?.your}
        pathPrefix="your"
        onOverride={onOverride}
      />
      <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 12 }}>
        <SideBlock
          label="Enemy team"
          stagesArray={statStages?.enemy}
          pathPrefix="enemy"
          onOverride={onOverride}
        />
      </div>
    </Section>
  )
}