const { fuzzyMatchPokemon, getPokemonData, getSmogonCalcs, getNatureModifier } = require('./pokemon-data')

const DEFAULT_STATE = {
  activeYour:  [null, null],
  activeEnemy: [null, null],
  hpPercent: { your: [100, 100], enemy: [100, 100] },
  statStages: {
    your:  [{ atk:0, def:0, spa:0, spd:0, spe:0 }, { atk:0, def:0, spa:0, spd:0, spe:0 }],
    enemy: [{ atk:0, def:0, spa:0, spd:0, spe:0 }, { atk:0, def:0, spa:0, spd:0, spe:0 }],
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
  lastOCRRaw: null,
}

class BattleStateManager {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE))
    this.teamConfig = []
  }

  setTeamConfig(team) {
    this.teamConfig = team || []
    this._recalculate()
  }

  update(ocrResult, teamConfig) {
    if (!ocrResult) return this.state
    if (teamConfig) this.teamConfig = teamConfig
    this.state.lastOCRRaw = ocrResult

    const resolvedYour  = ocrResult.yourPokemon.map(n => fuzzyMatchPokemon(n))
    const resolvedEnemy = ocrResult.enemyPokemon.map(n => fuzzyMatchPokemon(n))

    resolvedYour.forEach((m, i)  => { if (m?.confidence > 0.7) this.state.activeYour[i]  = m.name })
    resolvedEnemy.forEach((m, i) => {
  if (m?.confidence > 0.7) {
    const current = this.state.activeEnemy[i]
    const isMega = current?.startsWith('Mega ')
    const megaBase = isMega ? current.replace(/^Mega /, '').replace(/ [XY]$/, '') : null
    const incomingBase = m.name
    const isRevertingMega = isMega && (
      megaBase === incomingBase ||
      current.includes(incomingBase) ||
      incomingBase.includes(megaBase)
    )
    if (!isRevertingMega) this.state.activeEnemy[i] = m.name
  }
})

    ocrResult.yourHP.forEach((hp, i)  => { if (hp !== null) this.state.hpPercent.your[i]  = hp })
    ocrResult.enemyHP.forEach((hp, i) => { if (hp !== null) this.state.hpPercent.enemy[i] = hp })

    this._parseFieldConditions(ocrResult.fieldText)
    if (ocrResult.moves.length > 0) this.state.currentMoves = ocrResult.moves

    this._recalculate()
    return this.state
  }

  advanceTurn() {
    this.state.turn++
    const f = this.state.field

    function tick(activeKey, turnsKey) {
      if (f[activeKey] && f[turnsKey] > 0) {
        f[turnsKey]--
        if (f[turnsKey] === 0) f[activeKey] = false
      }
    }

    if (f.weather && f.weatherTurns > 0) {
      f.weatherTurns--
      if (f.weatherTurns === 0) f.weather = null
    }
    if (f.terrain && f.terrainTurns > 0) {
      f.terrainTurns--
      if (f.terrainTurns === 0) f.terrain = null
    }

    tick('tailwindYour',      'tailwindYourTurns')
    tick('tailwindEnemy',     'tailwindEnemyTurns')
    tick('trickRoom',         'trickRoomTurns')
    tick('reflectYour',       'reflectYourTurns')
    tick('reflectEnemy',      'reflectEnemyTurns')
    tick('lightScreenYour',   'lightScreenYourTurns')
    tick('lightScreenEnemy',  'lightScreenEnemyTurns')

    this._recalculate()
    return this.state
  }

  _parseFieldConditions(text) {
    if (!text) return
    const t = text.toLowerCase()

    if (t.includes('harsh sunlight') || t.includes('harsh sun')) {
      if (!this.state.field.weather) { this.state.field.weather = 'sun'; this.state.field.weatherTurns = 5 }
    } else if (t.includes('heavy rain') || t.includes('rain')) {
      if (!this.state.field.weather) { this.state.field.weather = 'rain'; this.state.field.weatherTurns = 5 }
    } else if (t.includes('sandstorm')) {
      if (!this.state.field.weather) { this.state.field.weather = 'sand'; this.state.field.weatherTurns = 5 }
    } else if (t.includes('hail') || t.includes('snow')) {
      if (!this.state.field.weather) { this.state.field.weather = 'snow'; this.state.field.weatherTurns = 5 }
    }

    if (t.includes('trick room') && !this.state.field.trickRoom) {
      this.state.field.trickRoom = true
      this.state.field.trickRoomTurns = 5
    }
    if (t.includes('tailwind') && !this.state.field.tailwindYour) {
      this.state.field.tailwindYour = true
      this.state.field.tailwindYourTurns = 4
    }

    if (t.includes('electric terrain')) { this.state.field.terrain = 'electric'; this.state.field.terrainTurns = 5 }
    if (t.includes('grassy terrain'))   { this.state.field.terrain = 'grassy';   this.state.field.terrainTurns = 5 }
    if (t.includes('misty terrain'))    { this.state.field.terrain = 'misty';    this.state.field.terrainTurns = 5 }
    if (t.includes('psychic terrain'))  { this.state.field.terrain = 'psychic';  this.state.field.terrainTurns = 5 }

    if (t.includes('sunlight faded') || t.includes('rain stopped') || t.includes('sandstorm subsided') || t.includes('snow stopped')) {
      this.state.field.weather = null
      this.state.field.weatherTurns = 0
    }
    if (t.includes('shattered') && t.includes('room')) {
      this.state.field.trickRoom = false
      this.state.field.trickRoomTurns = 0
    }
  }

  _recalculate() {
    this.state.damageCalcs = []

    const yourActive = this.state.activeYour
      .map((name, index) => ({ name, index }))
      .filter(p => p.name)

    const enemyActive = this.state.activeEnemy
      .map((name, index) => ({ name, index }))
      .filter(p => p.name)

    yourActive.forEach(attacker => {
      enemyActive.forEach(defender => {
        const moves = this._getMovesForPokemon(attacker.name)
        const currentStages = {
          your:  this.state.statStages.your[attacker.index],
          enemy: this.state.statStages.enemy[defender.index],
        }
        const calcs = getSmogonCalcs(
          attacker.name, defender.name, moves,
          currentStages, this.state.field, this.teamConfig
        )
        if (calcs) this.state.damageCalcs.push({ attacker: attacker.name, defender: defender.name, moves: calcs })
      })
    })

    // Your active Pokemon on field
    const yourOnField = yourActive.map(p => {
      const data = getPokemonData(p.name)
      const config = this.teamConfig?.find(c => c.name === p.name)
      const base = data?.spe ?? 0
      const stages = this.state.statStages.your[p.index]
      const nature = config?.nature ?? 'Hardy'
      const evs = config?.evs?.spe ?? 0
      const actual = calcStat(base, evs, 31, nature, 'spe')
      let spe = Math.round(actual * getStageMultiplier(stages?.spe ?? 0))
      if (this.state.field.tailwindYour) spe *= 2
      return { name: p.name, side: 'your', effectiveSpeed: spe, speedMin: null, speedMax: null, onField: true }
    })

    // Your benched Pokemon (in team config but not on field)
    const yourBenched = this.teamConfig
      .filter(c => c.name && !yourActive.find(p => p.name === c.name))
      .map(config => {
        const data = getPokemonData(config.name)
        const base = data?.spe ?? 0
        const nature = config?.nature ?? 'Hardy'
        const evs = config?.evs?.spe ?? 0
        const actual = calcStat(base, evs, 31, nature, 'spe')
        return { name: config.name, side: 'your', effectiveSpeed: actual, speedMin: null, speedMax: null, onField: false }
      })

    // Enemy active Pokemon
    const enemyOnField = enemyActive.map(p => {
      const data = getPokemonData(p.name)
      const base = data?.spe ?? 0
      const stages = this.state.statStages.enemy[p.index]
      const minStat = calcStat(base, 0, 31, 'negative', 'spe')
      const maxStat = calcStat(base, 252, 31, 'positive', 'spe')
      let minSpe = Math.round(minStat * getStageMultiplier(stages?.spe ?? 0))
      let maxSpe = Math.round(maxStat * getStageMultiplier(stages?.spe ?? 0))
      if (this.state.field.tailwindEnemy) { minSpe *= 2; maxSpe *= 2 }
      return { name: p.name, side: 'enemy', effectiveSpeed: maxSpe, speedMin: minSpe, speedMax: maxSpe, onField: true }
    })

    const allActive = [...yourOnField, ...yourBenched, ...enemyOnField]

    const trickRoom = this.state.field.trickRoom
    allActive.sort((a, b) =>
      trickRoom ? a.effectiveSpeed - b.effectiveSpeed : b.effectiveSpeed - a.effectiveSpeed
    )
    this.state.speedOrder = allActive
  }

  _getMovesForPokemon(name) {
    const config = this.teamConfig?.find(c => c.name === name)
    if (config?.moves?.length) return config.moves.filter(Boolean)
    return this.state.currentMoves
  }

  manualOverride({ path, value }) {
    const keys = path.split('.')
    let obj = this.state
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = value
    this._recalculate()
  }

  getState()  { return this.state }
  reset()     { this.state = JSON.parse(JSON.stringify(DEFAULT_STATE)) }
}

function getStageMultiplier(stage) {
  const table = {
    '-6': 2/8, '-5': 2/7, '-4': 2/6, '-3': 2/5, '-2': 2/4, '-1': 2/3,
    '0': 1,
    '1': 3/2, '2': 4/2, '3': 5/2, '4': 6/2, '5': 7/2, '6': 8/2,
  }
  return table[String(Math.max(-6, Math.min(6, stage)))] ?? 1
}

function calcStat(base, ev, iv, nature, statName) {
  let natureMult = 1
  if (nature === 'positive') {
    natureMult = 1.1
  } else if (nature === 'negative') {
    natureMult = 0.9
  } else {
    try {
      const mod = getNatureModifier(nature)
      if (mod.inc === statName) natureMult = 1.1
      if (mod.dec === statName) natureMult = 0.9
    } catch (e) {
      console.error('Failed to get nature modifier', e)
    }
  }
  return Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * 50 / 100) + 5) * natureMult)
}

module.exports = { BattleStateManager }