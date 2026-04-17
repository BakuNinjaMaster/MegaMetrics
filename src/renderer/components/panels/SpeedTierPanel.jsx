import React from 'react'
import Section from '../Section'

export default function SpeedTierPanel({ speedOrder, field }) {
  const trickRoom = field?.trickRoom
  const hasData = speedOrder?.length > 0

  return (
    <Section title={`Speed order${trickRoom ? ' · Trick Room' : ''}`}>
      {trickRoom && (
        <div style={{
          fontSize: 9, color: '#FAC775',
          background: 'rgba(186,117,23,0.12)',
          border: '0.5px solid rgba(186,117,23,0.3)',
          borderRadius: 4, padding: '3px 7px', marginBottom: 6,
        }}>
          Trick Room active — slowest moves first
        </div>
      )}

      {hasData ? (
        <>
          <div style={{
            display: 'flex', justifyContent: 'flex-end',
            fontSize: 7, color: 'var(--text-hint)',
            marginBottom: 3, paddingRight: 2, gap: 16,
          }}>
            <span style={{ color: '#F09595' }}>min spd</span>
            <span style={{ color: '#97C459' }}>max spd</span>
          </div>

          <ol style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 0, padding: 0, listStyle: 'none' }}>
            {speedOrder.map((entry, i) => {
              const isYour = entry.side === 'your'
              const isEnemy = entry.side === 'enemy'
              const onField = entry.onField !== false

              return (
                <li key={`${entry.name}-${entry.side}-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 7px', borderRadius: 5,
                  background: isYour && onField ? 'rgba(55,138,221,0.08)' : 'transparent',
                  opacity: onField ? 1 : 0.4,
                }}>
                  <span style={{ fontSize: 9, color: 'var(--text-hint)', width: 12, textAlign: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: isYour ? '#378ADD' : '#E24B4A',
                  }} />
                  <span style={{ fontSize: 10, color: '#c2bfb4', flex: 1 }}>
                    {entry.name}
                    {isYour && (
                      <span style={{
                        fontSize: 8, marginLeft: 5,
                        color: onField ? '#85B7EB' : 'rgba(255,255,255,0.3)',
                      }}>
                        {onField ? 'on field' : 'benched'}
                      </span>
                    )}
                  </span>

                  {isEnemy && entry.speedMin != null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 500, color: '#F09595' }}>{entry.speedMin}</span>
                      <span style={{ fontSize: 8, color: 'var(--text-hint)' }}>–</span>
                      <span style={{ fontSize: 9, fontWeight: 500, color: '#97C459' }}>{entry.speedMax}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 500, color: isYour ? '#85B7EB' : '#c2bfb4' }}>
                      {entry.effectiveSpeed}
                    </span>
                  )}

                  {i === 0 && onField && (
                    <span style={{
                      fontSize: 7, padding: '1px 5px', borderRadius: 3, fontWeight: 500,
                      background: 'rgba(55,138,221,0.18)', color: '#85B7EB', marginLeft: 2,
                    }}>
                      first
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          <div style={{
            fontSize: 8, color: 'var(--text-hint)',
            marginTop: 6, paddingTop: 6,
            borderTop: '0.5px solid rgba(255,255,255,0.05)',
          }}>
            Enemy speed shown as min (−nature, 0 EVs) to max (+nature, 252 EVs)
          </div>
        </>
      ) : (
        <div style={{ fontSize: 10, color: 'var(--text-hint)', fontStyle: 'italic', padding: '4px 0' }}>
          No Pokemon detected yet.
        </div>
      )}
    </Section>
  )
}