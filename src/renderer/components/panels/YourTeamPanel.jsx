import React, { useState } from 'react'
import Section from '../Section'
import { getSpriteUrl } from '../utils/pokemonSprites'

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
  'Sinistcha','Archaludon','Hydrapple','Rotom-Heat','Rotom-Wash','Rotom-Frost','Rotom-Fan','Rotom-Mow','Lycanroc-Midnight','Lycanroc-Dusk','Tauros-Paldea-Fire','Tauros-Paldea-Water','Morpeko-Hangry','Aegislash-Blade','Meowstic-F','Basculegion-F',
]

const TYPE_COLORS = {
  Normal:'#A8A878', Fire:'#F08030', Water:'#6890F0', Electric:'#F8D030',
  Grass:'#78C850', Ice:'#98D8D8', Fighting:'#C03028', Poison:'#A040A0',
  Ground:'#E0C068', Flying:'#A890F0', Psychic:'#F85888', Bug:'#A8B820',
  Rock:'#B8A038', Ghost:'#705898', Dragon:'#7038F8', Dark:'#705848',
  Steel:'#B8B8D0', Fairy:'#EE99AC',
}

function hpColor(pct) {
  if (pct > 50) return '#3bc46b'
  if (pct > 25) return '#EF9F27'
  return '#E24B4A'
}

function TypeBadge({ type }) {
  const bg = TYPE_COLORS[type] ?? '#888'
  return (
    <span style={{
      fontSize: 8, padding: '1px 5px', borderRadius: 3, fontWeight: 600,
      background: bg + '33', color: bg,
      border: `0.5px solid ${bg}66`,
    }}>
      {type}
    </span>
  )
}

function PokemonCard({ name, hpPct, config, slotIndex, onOverride }) {
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const moves   = config?.moves?.filter(Boolean) ?? []
  const item     = config?.item
  const nature   = config?.nature
  const ability  = config?.ability
  const types    = config?.types ?? []
  const displayHp = hpPct ?? 100
  const spriteUrl = getSpriteUrl(name)

  const filtered = ALL_NAMES
    .filter(n => n.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)

  function handleSelect(newName) {
    onOverride?.(`activeYour.${slotIndex}`, newName)
    setEditing(false)
    setQuery('')
    setShowDropdown(false)
  }

  return (
    <li style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {/* Sprite */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(55,138,221,0.12)',
          border: '0.5px solid rgba(55,138,221,0.3)',
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
            <span style={{ fontSize: 13, color: '#85B7EB', fontWeight: 500 }}>
              {name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {editing ? (
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  autoFocus
                  value={query}
                  onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
                  onBlur={() => setTimeout(() => { setEditing(false); setShowDropdown(false) }, 150)}
                  placeholder="Search Pokemon..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.08)',
                    border: '0.5px solid rgba(55,138,221,0.4)', borderRadius: 4,
                    padding: '2px 6px', fontSize: 11, color: 'var(--text-primary)',
                  }}
                />
                {showDropdown && filtered.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#1a1c2e', border: '0.5px solid rgba(255,255,255,0.15)',
                    borderRadius: 5, zIndex: 50, maxHeight: 140, overflowY: 'auto', marginTop: 2,
                  }}>
                    {filtered.map(n => (
                      <div
                        key={n}
                        onMouseDown={() => handleSelect(n)}
                        style={{ padding: '4px 8px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {name}
                </span>
                {types.map(t => <TypeBadge key={t} type={t} />)}
                <button
                  onClick={() => { setEditing(true); setQuery('') }}
                  style={{
                    fontSize: 8, padding: '1px 5px', borderRadius: 3,
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                  }}
                >
                  Switch
                </button>
                {item && (
                  <span style={{
                    fontSize: 8, padding: '1px 5px', borderRadius: 3,
                    background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                  }}>
                    {item}
                  </span>
                )}
              </>
            )}
          </div>

          {!editing && (ability || nature) && (
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
              {[nature, ability].filter(Boolean).join(' · ')}
            </div>
          )}

          {!editing && (
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
          )}
        </div>
      </div>

      {moves.length > 0 && !editing && (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 3, paddingLeft: 44, margin: 0, listStyle: 'none' }}>
          {moves.map(move => (
            <li key={move} style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.09)',
              color: 'var(--text-secondary)',
            }}>
              {move}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default function YourTeamPanel({ activeYour, hpPercent, team, onOverride }) {
  const activePokemon = activeYour?.filter(Boolean)
  if (!activePokemon || activePokemon.length === 0) return null

  return (
    <Section title="Your active Pokemon">
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        {activeYour.map((name, i) => {
          if (!name) return null
          const config = team?.find(t => t.name === name)
          return (
            <PokemonCard
              key={`${name}-${i}`}
              name={name}
              hpPct={hpPercent[i]}
              config={config}
              slotIndex={i}
              onOverride={onOverride}
            />
          )
        })}
      </ul>
    </Section>
  )
}