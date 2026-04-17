import React, { useState } from 'react'

const ALL_NAMES = [
  'Venusaur','Mega Venusaur','Charizard','Mega Charizard X','Mega Charizard Y',
  'Blastoise','Mega Blastoise','Beedrill','Mega Beedrill','Pidgeot','Mega Pidgeot',
  'Arbok','Pikachu','Raichu','Raichu-Alola','Clefable','Mega Clefable',
  'Ninetales','Ninetales-Alola','Arcanine','Arcanine-Hisui','Alakazam','Mega Alakazam',
  'Machamp','Victreebel','Mega Victreebel','Slowbro','Mega Slowbro','Slowbro-Galar',
  'Gengar','Mega Gengar','Kangaskhan','Mega Kangaskhan','Starmie','Mega Starmie',
  'Pinsir','Mega Pinsir','Tauros','Tauros-Paldea','Gyarados','Mega Gyarados',
  'Ditto','Vaporeon','Jolteon','Flareon','Aerodactyl','Mega Aerodactyl',
  'Snorlax','Dragonite','Mega Dragonite','Meganium','Mega Meganium',
  'Typhlosion','Typhlosion-Hisui','Feraligatr','Mega Feraligatr','Ariados',
  'Ampharos','Mega Ampharos','Azumarill','Politoed','Espeon','Umbreon',
  'Slowking','Slowking-Galar','Forretress','Steelix','Mega Steelix',
  'Scizor','Mega Scizor','Heracross','Mega Heracross','Skarmory','Mega Skarmory',
  'Houndoom','Mega Houndoom','Tyranitar','Mega Tyranitar','Pelipper',
  'Gardevoir','Mega Gardevoir','Sableye','Mega Sableye','Aggron','Mega Aggron',
  'Medicham','Mega Medicham','Manectric','Mega Manectric','Sharpedo','Mega Sharpedo',
  'Camerupt','Mega Camerupt','Torkoal','Altaria','Mega Altaria','Milotic','Castform',
  'Banette','Mega Banette','Chimecho','Mega Chimecho','Absol','Mega Absol',
  'Glalie','Mega Glalie','Torterra','Infernape','Empoleon','Luxray','Roserade',
  'Rampardos','Bastiodon','Lopunny','Mega Lopunny','Spiritomb','Garchomp','Mega Garchomp',
  'Lucario','Mega Lucario','Hippowdon','Toxicroak','Abomasnow','Mega Abomasnow',
  'Weavile','Rhyperior','Leafeon','Glaceon','Gliscor','Mamoswine',
  'Gallade','Mega Gallade','Froslass','Mega Froslass','Rotom',
  'Serperior','Emboar','Mega Emboar','Samurott','Samurott-Hisui',
  'Watchog','Liepard','Simisage','Simisear','Simipour',
  'Excadrill','Mega Excadrill','Audino','Mega Audino','Conkeldurr','Whimsicott',
  'Krookodile','Cofagrigus','Garbodor','Zoroark','Zoroark-Hisui',
  'Reuniclus','Vanilluxe','Emolga','Chandelure','Mega Chandelure',
  'Beartic','Stunfisk','Stunfisk-Galar','Golurk','Mega Golurk',
  'Hydreigon','Volcarona','Chesnaught','Mega Chesnaught','Delphox','Mega Delphox',
  'Greninja','Mega Greninja','Diggersby','Talonflame','Vivillon',
  'Floette','Mega Floette','Florges','Pangoro','Furfrou',
  'Meowstic','Mega Meowstic','Aegislash','Aromatisse','Slurpuff',
  'Clawitzer','Heliolisk','Tyrantrum','Aurorus','Sylveon',
  'Hawlucha','Mega Hawlucha','Dedenne','Goodra','Goodra-Hisui',
  'Klefki','Trevenant','Gourgeist','Avalugg','Avalugg-Hisui','Noivern',
  'Decidueye','Decidueye-Hisui','Incineroar','Primarina','Toucannon',
  'Crabominable','Mega Crabominable','Lycanroc','Toxapex','Mudsdale',
  'Araquanid','Salazzle','Tsareena','Oranguru','Passimian','Mimikyu',
  'Drampa','Mega Drampa','Kommo-o','Corviknight','Flapple','Appletun',
  'Sandaconda','Polteageist','Hatterene','Mr. Rime','Runerigus',
  'Alcremie','Morpeko','Dragapult','Wyrdeer','Kleavor',
  'Basculegion','Sneasler','Meowscarada','Skeledirge','Quaquaval',
  'Maushold','Garganacl','Armarouge','Ceruledge','Bellibolt',
  'Scovillain','Mega Scovillain','Espathra','Tinkaton','Palafin',
  'Orthworm','Glimmora','Mega Glimmora','Farigiraf','Kingambit',
  'Sinistcha','Archaludon','Hydrapple','Rotom-Heat','Rotom-Wash','Rotom-Frost','Rotom-Fan','Rotom-Mow','Lycanroc-Midnight','Lycanroc-Dusk','Lycanroc-Midnight','Lycanroc-Dusk','Tauros-Paldea-Fire','Tauros-Paldea-Water','Morpeko-Hangry','Aegislash-Blade','Meowstic-F','Basculegion-F',
]

const ALL_MOVES = [
  'Acrobatics','Aerial Ace','Air Slash','Aqua Jet','Aura Sphere','Aurora Veil',
  'Avalanche','Baby-Doll Eyes','Blizzard','Body Press','Body Slam','Brave Bird',
  'Brick Break','Bug Buzz','Bulk Up','Bulldoze','Calm Mind','Close Combat',
  'Coaching','Crunch','Dazzling Gleam','Detect','Draco Meteor','Dragon Claw',
  'Dragon Dance','Dragon Darts','Dragon Pulse','Drain Punch','Earth Power',
  'Earthquake','Electroweb','Energy Ball','Fake Out','Fake Tears','Feint',
  'Fire Blast','Fire Punch','Flamethrower','Flash Cannon','Fling','Floral Healing',
  'Focus Blast','Follow Me','Foul Play','Freeze-Dry','Gigaton Hammer','Glacial Lance',
  'Grav Apple','Gravity','Hard Press','Heal Pulse','Heat Wave','Heavy Slam',
  'Helping Hand','High Horsepower','Hurricane','Hydro Pump','Hyper Voice','Hypnosis',
  'Ice Beam','Ice Punch','Ice Spinner','Icicle Crash','Imprison','Iron Defense',
  'Iron Head','Jet Punch','Jungle Healing','Knock Off','Leaf Storm','Leech Seed',
  'Light Screen','Lumina Crash','Mach Punch','Moonblast','Muddy Water',
  'Origin Pulse','Overheat','Phantom Force','Play Rough','Poison Jab','Poltergeist',
  'Population Bomb','Power Gem','Precipice Blades','Protect','Psychic',
  'Psychic Fangs','Psyshock','Quiver Dance','Rage Powder','Rain Dance','Reflect',
  'Rock Slide','Sacred Sword','Scary Face','Shadow Ball','Shadow Claw',
  'Shadow Sneak','Skill Swap','Sleep Powder','Sludge Bomb','Snarl','Snipe Shot',
  'Solar Beam','Sparkling Aria','Spectral Thief','Spore','Stone Edge',
  'Stored Power','Sucker Punch','Sunny Day','Superpower','Surf','Tail Wind',
  'Tera Blast','Thunder','Thunder Punch','Thunder Wave','Thunderbolt','Toxic',
  'Trick Room','U-turn','Volt Switch','Water Spout','Weather Ball','Wide Guard',
  'Will-O-Wisp','Wood Hammer','Zen Headbutt',
]

const ALL_ITEMS = [
  // Type-boosting items (700 VP)
  'Black Belt','Black Glasses','Charcoal','Dragon Fang','Fairy Feather',
  'Hard Stone','Magnet','Metal Coat','Miracle Seed','Mystic Water',
  'Never-Melt Ice','Poison Barb','Sharp Beak','Silk Scarf','Silver Powder',
  'Soft Sand','Spell Tag','Twisted Spoon',
  // Utility & Strategic items (up to 1,000 VP)
  'Bright Powder','Choice Scarf','Focus Band','Focus Sash','King\'s Rock',
  'Mental Herb','Quick Claw','Scope Lens','Shell Bell',
  // Berries (400 VP)
  'Cheri Berry','Chesto Berry','Pecha Berry','Rawst Berry','Aspear Berry',
  'Persim Berry','Leppa Berry','Oran Berry',
  // Damage-reducing berries (400 VP)
  'Babiri Berry','Charti Berry','Chilan Berry','Chople Berry','Coba Berry',
  'Haban Berry','Kasib Berry','Kebia Berry','Occa Berry','Passho Berry',
  'Payapa Berry','Rindo Berry','Shuca Berry','Tanga Berry','Wacan Berry',
  'Yache Berry',
  // Mega Stones (2,000 VP)
  'Abomasite','Absolite','Aerodactylite','Aggronite','Alakazite',
  'Beedrillite','Blastoisinite','Cameruptite','Chandelurite',
  'Charizardite X','Charizardite Y','Gyaradosite','Hawluchanite',
  'Heracronite','Houndoominite','Kangaskhanite','Lopunnite','Lucarionite',
  'Manectite','Sharpedonite','Skarmorite','Slowbronite','Tyranitarite',
  'Venusaurite','Victreebelite',
  // Exclusive Mega Stones (Legends: Z-A Transfer)
  'Chesnaughtite','Delphoxite','Greninjite','Eternal Flower Floettite',
]
const NATURES = [
  'Hardy','Lonely','Brave','Adamant','Naughty','Bold','Docile','Relaxed',
  'Impish','Lax','Timid','Hasty','Serious','Jolly','Naive','Modest','Mild',
  'Quiet','Bashful','Rash','Calm','Gentle','Sassy','Careful','Quirky',
]

const TERA_TYPES = [
  'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
  'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
]

const EV_STATS = ['hp','atk','def','spa','spd','spe']
const EV_LABELS = { hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe' }

function AutoInput({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')

  React.useEffect(() => { setQuery(value || '') }, [value])

  const filtered = options
    .filter(o => o.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 5,
          padding: '4px 8px', fontSize: 11, color: 'var(--text-primary)',
        }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#1a1c2e', border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: 5, zIndex: 50, maxHeight: 160, overflowY: 'auto', marginTop: 2,
        }}>
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => { onChange(opt); setQuery(opt); setOpen(false) }}
              style={{ padding: '5px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PokemonSlot({ slot, index, onChange }) {
  const [expanded, setExpanded] = useState(false)

  function update(field, value) { onChange(index, { ...slot, [field]: value }) }
  function updateEv(stat, value) { onChange(index, { ...slot, evs: { ...slot.evs, [stat]: value } }) }
  function updateIv(stat, value) { onChange(index, { ...slot, ivs: { ...slot.ivs, [stat]: value } }) }
  function updateMove(mi, value) {
    const moves = [...slot.moves]
    moves[mi] = value
    onChange(index, { ...slot, moves })
  }

  const hasData = !!slot.name
  const totalEvs = Object.values(slot.evs || {}).reduce((a, b) => a + Number(b), 0)

  return (
    <div style={{
      border: `0.5px solid ${hasData ? 'rgba(55,138,221,0.25)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 7,
      background: hasData ? 'rgba(55,138,221,0.04)' : 'rgba(255,255,255,0.02)',
      marginBottom: 6, overflow: 'hidden',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: hasData ? 'rgba(55,138,221,0.15)' : 'rgba(255,255,255,0.06)',
          border: `0.5px solid ${hasData ? 'rgba(55,138,221,0.3)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: hasData ? '#85B7EB' : 'var(--text-hint)', fontWeight: 500, flexShrink: 0,
        }}>
          {hasData ? slot.name[0] : index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: hasData ? 'var(--text-primary)' : 'var(--text-hint)' }}>
            {hasData ? slot.name : `Slot ${index + 1}`}
          </div>
          {hasData && (
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
              {slot.nature} · {slot.item || 'No item'} · {slot.moves.filter(Boolean).length}/4 moves
            </div>
          )}
        </div>
        <span style={{ fontSize: 9, color: 'var(--text-hint)' }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={{ padding: '0 10px 10px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>Pokemon</div>
              <AutoInput value={slot.name} onChange={v => update('name', v)} options={ALL_NAMES} placeholder="Search Pokemon..." />
            </div>
            <div>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>Nature</div>
              <select
                value={slot.nature}
                onChange={e => update('nature', e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 5,
                  padding: '4px 6px', fontSize: 11,
                }}
              >
                {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>Tera type</div>
              <select
                value={slot.tera}
                onChange={e => update('tera', e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 5,
                  padding: '4px 6px', fontSize: 11,
                }}
              >
                <option value="">— none —</option>
                {TERA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>Item</div>
              <AutoInput value={slot.item} onChange={v => update('item', v)} options={ALL_ITEMS} placeholder="Search items..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 3 }}>Moves</div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
  {slot.moves.map((move, mi) => (
    <input
      key={mi}
      value={move}
      onChange={e => updateMove(mi, e.target.value)}
      placeholder={`Move ${mi + 1}`}
      style={{
        width: '100%', background: 'rgba(255,255,255,0.05)',
        border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 5,
        padding: '4px 8px', fontSize: 11, color: 'var(--text-primary)',
      }}
    />
  ))}
</div>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', marginBottom: 4 }}>EVs / IVs</div>
              {EV_STATS.map(stat => (
                <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', width: 24 }}>{EV_LABELS[stat]}</span>
                  <span style={{ fontSize: 8, color: 'var(--text-hint)', width: 16 }}>EV</span>
                  <input
                    type="number" min={0} max={252} step={4}
                    value={slot.evs?.[stat] ?? 0}
                    // IMPROVEMENT: Allows the input to briefly be completely empty without aggressively snapping to 0
                    onChange={e => updateEv(stat, e.target.value === '' ? '' : Math.max(0, Math.min(252, +e.target.value)))}
                    style={{
                      width: 48, background: 'rgba(255,255,255,0.06)',
                      border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 3,
                      padding: '2px 4px', fontSize: 10, textAlign: 'right',
                    }}
                  />
                  <span style={{ fontSize: 8, color: 'var(--text-hint)', width: 14 }}>IV</span>
                  <input
                    type="number" min={0} max={31}
                    value={slot.ivs?.[stat] ?? 31}
                    onChange={e => updateIv(stat, e.target.value === '' ? '' : Math.max(0, Math.min(31, +e.target.value)))}
                    style={{
                      width: 36, background: 'rgba(255,255,255,0.06)',
                      border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 3,
                      padding: '2px 4px', fontSize: 10, textAlign: 'right',
                    }}
                  />
                </div>
              ))}
              <div style={{ fontSize: 8, color: totalEvs > 508 ? '#E24B4A' : 'var(--text-muted)', marginTop: 4 }}>
                Total EVs: {totalEvs} / 508
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TeamTab({ team, onSave }) {
  const [localTeam, setLocalTeam] = useState(team)
  const [saved, setSaved] = useState(false)

  function updateSlot(index, newSlot) {
    const next = [...localTeam]
    next[index] = newSlot
    setLocalTeam(next)
    setSaved(false)
  }

  async function handleSave() {
    await onSave(localTeam)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '8px 12px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>6 slots · click a slot to expand</span>
        <button
          onClick={handleSave}
          style={{
            fontSize: 10, padding: '4px 12px', borderRadius: 5,
            border: `0.5px solid ${saved ? 'rgba(59,196,107,0.4)' : 'rgba(55,138,221,0.4)'}`,
            background: saved ? 'rgba(59,196,107,0.12)' : 'rgba(55,138,221,0.12)',
            color: saved ? '#3bc46b' : '#85B7EB',
          }}
        >
          {saved ? 'Saved' : 'Save team'}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {localTeam.map((slot, i) => (
          <PokemonSlot key={i} slot={slot} index={i} onChange={updateSlot} />
        ))}
      </div>
    </div>
  )
}

function PrefsTab({ prefs, onSave }) {
  const [local, setLocal] = useState(prefs)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await onSave(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function row(label, hint, children) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-primary)' }}>{label}</div>
          {hint && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{hint}</div>}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div style={{ padding: 14 }}>
      {row('OCR scan interval', 'How often to scan a frame',
        <select
          value={local.ocrIntervalMs}
          onChange={e => setLocal(p => ({ ...p, ocrIntervalMs: +e.target.value }))}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 5, padding: '4px 8px', fontSize: 11,
          }}
        >
          {/* IMPROVEMENT: Re-aligned labels to reflect our new safe defaults */}
          <option value={500}>500ms (fast)</option>
          <option value={1000}>1000ms</option>
          <option value={1500}>1500ms (fast)</option>
          <option value={2500}>2500ms (default)</option>
          <option value={5000}>5000ms (battery saver)</option>
        </select>
      )}
      {row('Default feed size', 'Starting size of capture feed',
        <select
          value={local.feedSize}
          onChange={e => setLocal(p => ({ ...p, feedSize: e.target.value }))}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: 5, padding: '4px 8px', fontSize: 11,
          }}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="fill">Large</option>
        </select>
      )}
      {row('Start OCR on launch', 'Auto-enable scanning when app opens',
        <button
          onClick={() => setLocal(p => ({ ...p, ocrEnabled: !p.ocrEnabled }))}
          style={{
            fontSize: 10, padding: '3px 10px', borderRadius: 5,
            border: `0.5px solid ${local.ocrEnabled ? 'rgba(55,138,221,0.4)' : 'rgba(255,255,255,0.15)'}`,
            background: local.ocrEnabled ? 'rgba(55,138,221,0.12)' : 'transparent',
            color: local.ocrEnabled ? '#85B7EB' : 'var(--text-muted)',
          }}
        >
          {local.ocrEnabled ? 'Enabled' : 'Disabled'}
        </button>
      )}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleSave}
          style={{
            fontSize: 10, padding: '5px 14px', borderRadius: 5,
            border: `0.5px solid ${saved ? 'rgba(59,196,107,0.4)' : 'rgba(55,138,221,0.4)'}`,
            background: saved ? 'rgba(59,196,107,0.1)' : 'rgba(55,138,221,0.1)',
            color: saved ? '#3bc46b' : '#85B7EB',
          }}
        >
          {saved ? 'Saved' : 'Save preferences'}
        </button>
      </div>
    </div>
  )
}

const REGION_KEYS = [
  { key: 'enemyPokemon1', label: 'Enemy name 1', color: '#E24B4A' },
  { key: 'enemyPokemon2', label: 'Enemy name 2', color: '#F09595' },
  { key: 'yourPokemon1',  label: 'Your name 1',  color: '#378ADD' },
  { key: 'yourPokemon2',  label: 'Your name 2',  color: '#85B7EB' },
  { key: 'enemyHP1',      label: 'Enemy HP 1',   color: '#EF9F27' },
  { key: 'enemyHP2',      label: 'Enemy HP 2',   color: '#FAC775' },
  { key: 'yourHP1',       label: 'Your HP 1',    color: '#3bc46b' },
  { key: 'yourHP2',       label: 'Your HP 2',    color: '#97C459' },
  { key: 'move1',         label: 'Move 1',       color: '#AFA9EC' },
  { key: 'move2',         label: 'Move 2',       color: '#AFA9EC' },
  { key: 'move3',         label: 'Move 3',       color: '#AFA9EC' },
  { key: 'move4',         label: 'Move 4',       color: '#AFA9EC' },
  { key: 'fieldText',     label: 'Field text',   color: '#5DCAA5' },
]

function CalibrationTab({ videoRef, currentRegions, onSave }) {
  const canvasRef = React.useRef(null)
  const bgCanvasRef = React.useRef(null)
  const [frozenFrame, setFrozenFrame] = useState(null)
  const [regions, setRegions] = useState(currentRegions || {})
  const [activeKey, setActiveKey] = useState(REGION_KEYS[0].key)
  const [drawing, setDrawing] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [saved, setSaved] = useState(false)

  function freezeFrame() {
    if (!videoRef?.current) return
    const video = videoRef.current
    const tmp = document.createElement('canvas')
    tmp.width  = video.videoWidth  || 1920
    tmp.height = video.videoHeight || 1080
    tmp.getContext('2d').drawImage(video, 0, 0)
    setFrozenFrame(tmp.toDataURL('image/png'))
  }

  React.useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (frozenFrame) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      img.src = frozenFrame
    } else {
      ctx.fillStyle = '#0e0f1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Freeze a frame to start calibrating', canvas.width / 2, canvas.height / 2)
    }
  }, [frozenFrame])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    REGION_KEYS.forEach(({ key, label, color }) => {
      const r = regions[key]
      if (!r) return
      const x = r.left, y = r.top, w = r.width, h = r.height
      ctx.strokeStyle = color
      ctx.lineWidth = key === activeKey ? 2 : 1
      ctx.setLineDash(key === activeKey ? [] : [4, 3])
      ctx.strokeRect(x, y, w, h)
      ctx.fillStyle = color + '22'
      ctx.fillRect(x, y, w, h)
      ctx.setLineDash([])
      ctx.fillStyle = color
      ctx.font = `${key === activeKey ? 'bold ' : ''}11px sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(label, x + 2, y > 14 ? y - 3 : y + h + 12)
    })
  }, [regions, activeKey])

  function getCoords(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top)  * scaleY),
    }
  }

  function onMouseDown(e) { setDragStart(getCoords(e)); setDrawing(true) }

  function onMouseMove(e) {
    if (!drawing || !dragStart) return
    const c = getCoords(e)
    setRegions(prev => ({
      ...prev,
      [activeKey]: {
        left:   Math.min(dragStart.x, c.x),
        top:    Math.min(dragStart.y, c.y),
        width:  Math.abs(c.x - dragStart.x),
        height: Math.abs(c.y - dragStart.y),
      },
    }))
  }

  function onMouseUp() {
    setDrawing(false)
    setDragStart(null)
    const idx = REGION_KEYS.findIndex(r => r.key === activeKey)
    if (idx < REGION_KEYS.length - 1) setActiveKey(REGION_KEYS[idx + 1].key)
  }

  async function handleSave() {
    await onSave(regions)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeInfo   = REGION_KEYS.find(r => r.key === activeKey)
  const activeRegion = regions[activeKey]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <button
          onClick={freezeFrame}
          style={{
            fontSize: 10, padding: '4px 12px', borderRadius: 5,
            border: '0.5px solid rgba(55,138,221,0.4)',
            background: 'rgba(55,138,221,0.1)', color: '#85B7EB',
          }}
        >
          Freeze frame
        </button>
        <button
          onClick={handleSave}
          style={{
            fontSize: 10, padding: '4px 12px', borderRadius: 5,
            border: `0.5px solid ${saved ? 'rgba(59,196,107,0.4)' : 'rgba(55,138,221,0.4)'}`,
            background: saved ? 'rgba(59,196,107,0.1)' : 'rgba(55,138,221,0.1)',
            color: saved ? '#3bc46b' : '#85B7EB',
          }}
        >
          {saved ? 'Saved' : 'Save regions'}
        </button>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          Drawing: <span style={{ color: activeInfo?.color }}>{activeInfo?.label}</span>
        </span>
        {activeRegion && (
          <span style={{ fontSize: 9, color: 'var(--text-hint)', marginLeft: 4 }}>
            {activeRegion.left},{activeRegion.top} {activeRegion.width}×{activeRegion.height}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* IMPROVEMENT: Ensures the calibration canvas maintains a strict 16:9 ratio.
            This prevents the image from squishing and breaking the OCR coordinate mapping. */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#000', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxHeight: '100%', 
            aspectRatio: '16 / 9' 
          }}>
            <canvas
              ref={bgCanvasRef}
              width={1920} height={1080}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                display: 'block',
              }}
            />
            <canvas
              ref={canvasRef}
              width={1920} height={1080}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                display: 'block', cursor: 'crosshair',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            />
          </div>
        </div>

        {/* Sidebar for Region List */}
        <div style={{
          width: 160, flexShrink: 0, overflowY: 'auto',
          borderLeft: '0.5px solid rgba(255,255,255,0.08)',
          background: '#090a14', padding: 8,
        }}>
          {REGION_KEYS.map(({ key, label, color }) => {
            const r = regions[key]
            const isActive = key === activeKey
            return (
              <div
                key={key}
                onClick={() => setActiveKey(key)}
                style={{
                  padding: '4px 6px', borderRadius: 4, marginBottom: 2, cursor: 'pointer',
                  border: `0.5px solid ${isActive ? color + '60' : 'transparent'}`,
                  background: isActive ? color + '15' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {label}
                  </span>
                </div>
                {r ? (
                  <div style={{ fontSize: 7, color: 'var(--text-hint)', marginTop: 1, paddingLeft: 9 }}>
                    {r.left},{r.top} {r.width}×{r.height}
                  </div>
                ) : (
                  <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.12)', marginTop: 1, paddingLeft: 9 }}>
                    Not set
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { key: 'team',        label: 'Team' },
  { key: 'prefs',       label: 'Preferences' },
  { key: 'calibration', label: 'OCR calibration' },
]

export default function SettingsPanel({
  team, prefs, onSaveTeam, onSavePrefs, onClose,
  videoRef, ocrRegions, onSaveOcrRegions,
}) {
  const [tab, setTab] = useState('team')

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: '#13151f', border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 10, width: 900, maxWidth: '95vw', height: '85vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Settings</span>
          <button
            onClick={onClose}
            style={{
              fontSize: 10, padding: '3px 10px', borderRadius: 5,
              border: '0.5px solid rgba(255,255,255,0.12)', color: 'var(--text-muted)',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '7px 16px', fontSize: 11, fontWeight: 500,
                color: tab === t.key ? '#85B7EB' : 'var(--text-muted)',
                borderBottom: `1.5px solid ${tab === t.key ? '#378ADD' : 'transparent'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {tab === 'team' && <TeamTab team={team} onSave={onSaveTeam} />}
          {tab === 'prefs' && <PrefsTab prefs={prefs} onSave={onSavePrefs} />}
          {tab === 'calibration' && (
            <CalibrationTab
              videoRef={videoRef}
              currentRegions={ocrRegions}
              onSave={onSaveOcrRegions}
            />
          )}
        </div>
      </div>
    </div>
  )
}