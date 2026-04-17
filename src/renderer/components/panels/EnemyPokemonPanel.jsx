import React from 'react'
import Section from '../Section'
import { getSpriteUrl, getMegaForm, getBaseName } from '../utils/pokemonSprites'

function hpColor(pct) {
  if (pct > 50) return '#3bc46b'
  if (pct > 25) return '#EF9F27'
  return '#E24B4A'
}

function PokemonCard({ name, hpPct, onMegaEvolve }) {
  const displayHp = hpPct ?? 100
  const spriteUrl = getSpriteUrl(name)
  const megaForm = getMegaForm(name)
  const isMega = name?.startsWith('Mega ')

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(226,75,74,0.1)',
          border: '0.5px solid rgba(226,75,74,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          {spriteUrl ? (
            <img
              src={spriteUrl}
              alt={name}
              style={{ width: 32, height: 32, imageRendering: 'pixelated' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <span style={{ fontSize: 13, color: '#F09595', fontWeight: 500 }}>
              {name?.[0] ?? '?'}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)' }}>
              {name}
            </span>
            {(megaForm || isMega) && (
              <button
                onClick={() => onMegaEvolve(name)}
                style={{
                  fontSize: 8, padding: '1px 6px', borderRadius: 3, cursor: 'pointer',
                  border: `0.5px solid ${isMega ? 'rgba(239,159,39,0.5)' : 'rgba(255,255,255,0.15)'}`,
                  background: isMega ? 'rgba(239,159,39,0.15)' : 'transparent',
                  color: isMega ? '#FAC775' : 'rgba(255,255,255,0.4)',
                  marginLeft: 2,
                }}
              >
                {isMega ? 'Undo Mega' : 'Mega'}
              </button>
            )}
          </div>
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                width: `${displayHp}%`, height: '100%', borderRadius: 2,
                background: hpColor(displayHp),
                transition: 'width 0.4s ease, background 0.3s',
              }} />
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>
              {displayHp}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EnemyPokemonPanel({ activeEnemy, hpPercent, onMegaEvolve }) {
  const hasData = activeEnemy?.some(Boolean)

  return (
    <Section title="Enemy active Pokemon">
      {hasData ? (
        activeEnemy.map((name, i) =>
          name ? (
            <PokemonCard
              key={`${name}-${i}`}
              name={name}
              hpPct={hpPercent?.[i]}
              onMegaEvolve={onMegaEvolve}
            />
          ) : null
        )
      ) : (
        <div style={{ fontSize: 10, color: 'var(--text-hint)', fontStyle: 'italic', padding: '4px 0' }}>
          No Pokemon detected — enable OCR or connect capture device.
        </div>
      )}
    </Section>
  )
}