import React from 'react'
import Section from '../Section'

function KOTag({ move }) {
  if (!move?.koLabel) return <span style={{ fontSize: 8, color: 'var(--text-hint)' }}>—</span>
  const styles = {
    'OHKO': { background: 'rgba(226,75,74,0.2)',    color: '#F09595' },
    '2HKO': { background: 'rgba(239,159,39,0.18)',  color: '#FAC775' },
    '3HKO': { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' },
  }
  const s = styles[move.koLabel] ?? styles['3HKO']
  return (
    <span style={{ fontSize: 7, padding: '1px 5px', borderRadius: 3, fontWeight: 500, ...s }}>
      {move.koLabel}
    </span>
  )
}

function dmgColor(move) {
  if (move.isOHKO) return '#E24B4A'
  if (move.is2HKO) return '#EF9F27'
  return '#888780'
}

function CalcBlock({ attacker, defender, moves }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>
        {attacker} <span style={{ color: 'var(--text-hint)' }}>vs</span> {defender}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {moves.map((move, i) => (
          <div key={`${move.name}-${i}`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '3px 7px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 5,
          }}>
            <span style={{
              fontSize: 10, color: '#c2bfb4', flex: 1,
              minWidth: 0, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {move.name}
            </span>
            {move.low !== null ? (
              <>
                <span style={{ fontSize: 9, fontWeight: 500, color: dmgColor(move) }}>
                  {move.low}–{move.high}%
                </span>
                <KOTag move={move} />
              </>
            ) : (
              <span style={{ fontSize: 9, color: 'var(--text-hint)' }}>—</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DamageCalcPanel({ damageCalcs }) {
  const hasData = damageCalcs && damageCalcs.length > 0

  return (
    <Section title="Damage calcs">
      {hasData ? (
        damageCalcs.map((calc, i) => (
          <CalcBlock
            key={`${calc.attacker}-${calc.defender}-${i}`}
            attacker={calc.attacker}
            defender={calc.defender}
            moves={calc.moves}
          />
        ))
      ) : (
        <div style={{ fontSize: 10, color: 'var(--text-hint)', fontStyle: 'italic', padding: '4px 0' }}>
          Waiting for Pokemon and move data...
        </div>
      )}
    </Section>
  )
}