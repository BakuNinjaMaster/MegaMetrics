import React from 'react'
import EnemyPokemonPanel from './panels/EnemyPokemonPanel'
import YourTeamPanel from './panels/YourTeamPanel'
import DamageCalcPanel from './panels/DamageCalcPanel'
import SpeedTierPanel from './panels/SpeedTierPanel'
import FieldConditionsPanel from './panels/FieldConditionsPanel'
import BuffTrackerPanel from './panels/BuffTrackerPanel'
import { getMegaForm, getBaseName } from './utils/pokemonSprites'

export default function InfoPanel({ battleState, onManualOverride, team }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, overflowY: 'auto',
      padding: '12px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      alignContent: 'start',
      gap: '12px',
    }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <YourTeamPanel
          activeYour={battleState.activeYour}
          hpPercent={battleState.hpPercent.your}
          team={team}
        />
        <EnemyPokemonPanel
          activeEnemy={battleState.activeEnemy}
          hpPercent={battleState.hpPercent.enemy}
          onMegaEvolve={(name) => {
            const i = battleState.activeEnemy.indexOf(name)
            if (i === -1) return
            const isMega = name?.startsWith('Mega ')
            const newName = isMega ? getBaseName(name) : getMegaForm(name)
            if (newName) onManualOverride(`activeEnemy.${i}`, newName)
          }}
        />
        <FieldConditionsPanel
          field={battleState.field}
          onOverride={onManualOverride}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <DamageCalcPanel
          damageCalcs={battleState.damageCalcs}
        />
        <SpeedTierPanel
          speedOrder={battleState.speedOrder}
          field={battleState.field}
        />
        <BuffTrackerPanel
          statStages={battleState.statStages}
          onOverride={onManualOverride}
        />
      </div>

    </div>
  )
}