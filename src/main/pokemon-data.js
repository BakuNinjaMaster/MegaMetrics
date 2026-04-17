const fs = require('fs')
const path = require('path')
const { app } = require('electron')

const CHAMPIONS_ROSTER = [
  'Venusaur','Mega Venusaur','Charizard','Mega Charizard X','Mega Charizard Y',
  'Blastoise','Mega Blastoise','Beedrill','Mega Beedrill','Pidgeot','Mega Pidgeot',
  'Arbok','Pikachu','Raichu','Raichu-Alola','Clefable','Mega Clefable',
  'Ninetales','Ninetales-Alola','Arcanine','Arcanine-Hisui','Alakazam','Mega Alakazam',
  'Machamp','Victreebel','Mega Victreebel','Slowbro','Mega Slowbro','Slowbro-Galar',
  'Gengar','Mega Gengar','Kangaskhan','Mega Kangaskhan','Starmie','Mega Starmie',
  'Pinsir','Mega Pinsir','Tauros','Tauros-Paldea','Tauros-Paldea-Fire','Tauros-Paldea-Water','Gyarados','Mega Gyarados',
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
  'Gallade','Mega Gallade','Froslass','Mega Froslass','Rotom','Rotom-Heat','Rotom-Wash','Rotom-Frost','Rotom-Fan','Rotom-Mow',
  'Serperior','Emboar','Mega Emboar','Samurott','Samurott-Hisui',
  'Watchog','Liepard','Simisage','Simisear','Simipour',
  'Excadrill','Mega Excadrill','Audino','Mega Audino','Conkeldurr','Whimsicott',
  'Krookodile','Cofagrigus','Garbodor','Zoroark','Zoroark-Hisui',
  'Reuniclus','Vanilluxe','Emolga','Chandelure','Mega Chandelure',
  'Beartic','Stunfisk','Stunfisk-Galar','Golurk','Mega Golurk',
  'Hydreigon','Volcarona','Chesnaught','Mega Chesnaught','Delphox','Mega Delphox',
  'Greninja','Mega Greninja','Diggersby','Talonflame','Vivillon',
  'Floette','Mega Floette','Florges','Pangoro','Furfrou',
  'Meowstic','Meowstic-F','Mega Meowstic','Aegislash','Aegislash-Blade','Aromatisse','Slurpuff',
  'Clawitzer','Heliolisk','Tyrantrum','Aurorus','Sylveon',
  'Hawlucha','Mega Hawlucha','Dedenne','Goodra','Goodra-Hisui',
  'Klefki','Trevenant','Gourgeist','Avalugg','Avalugg-Hisui','Noivern',
  'Decidueye','Decidueye-Hisui','Incineroar','Primarina','Toucannon',
  'Crabominable','Mega Crabominable','Lycanroc','Lycanroc-Midnight','Lycanroc-Dusk','Toxapex','Mudsdale',
  'Araquanid','Salazzle','Tsareena','Oranguru','Passimian','Mimikyu',
  'Drampa','Mega Drampa','Kommo-o','Corviknight','Flapple','Appletun',
  'Sandaconda','Polteageist','Hatterene','Mr. Rime','Runerigus',
  'Alcremie','Morpeko','Morpeko-Hangry','Dragapult','Wyrdeer','Kleavor',
  'Basculegion','Basculegion-F','Sneasler','Meowscarada','Skeledirge','Quaquaval',
  'Maushold','Garganacl','Armarouge','Ceruledge','Bellibolt',
  'Scovillain','Mega Scovillain','Espathra','Tinkaton','Palafin',
  'Orthworm','Glimmora','Mega Glimmora','Farigiraf','Kingambit',
  'Sinistcha','Archaludon','Hydrapple',
]

let statCache = {}
let cacheLoaded = false
const ocrStringCache = {}

function getCachePath() {
  return path.join(app.getPath('userData'), 'pokemon-stats-cache.json')
}

function loadCache() {
  if (cacheLoaded) return
  try {
    const p = getCachePath()
    if (fs.existsSync(p)) {
      statCache = JSON.parse(fs.readFileSync(p, 'utf-8'))
    }
  } catch (e) {
    statCache = {}
  }
  cacheLoaded = true
}

function saveCache() {
  try {
    fs.writeFileSync(getCachePath(), JSON.stringify(statCache, null, 2), 'utf-8')
  } catch (e) {
    console.error('Failed to save stat cache:', e)
  }
}

const FALLBACK_STATS = {
  'Venusaur':        { hp:80,  atk:82,  def:83,  spa:100, spd:100, spe:80,  types:['Grass','Poison'] },
  'Mega Venusaur':   { hp:80,  atk:100, def:123, spa:122, spd:120, spe:80,  types:['Grass','Poison'] },
  'Charizard':       { hp:78,  atk:84,  def:78,  spa:109, spd:85,  spe:100, types:['Fire','Flying'] },
  'Mega Charizard X':{ hp:78,  atk:130, def:111, spa:130, spd:85,  spe:100, types:['Fire','Dragon'] },
  'Mega Charizard Y':{ hp:78,  atk:104, def:78,  spa:159, spd:115, spe:100, types:['Fire','Flying'] },
  'Blastoise':       { hp:79,  atk:83,  def:100, spa:85,  spd:105, spe:78,  types:['Water'] },
  'Mega Blastoise':  { hp:79,  atk:103, def:120, spa:135, spd:115, spe:78,  types:['Water'] },
  'Beedrill':        { hp:65,  atk:90,  def:40,  spa:45,  spd:80,  spe:75,  types:['Bug','Poison'] },
  'Mega Beedrill':   { hp:65,  atk:150, def:40,  spa:15,  spd:80,  spe:145, types:['Bug','Poison'] },
  'Pidgeot':         { hp:83,  atk:80,  def:75,  spa:70,  spd:70,  spe:101, types:['Normal','Flying'] },
  'Mega Pidgeot':    { hp:83,  atk:80,  def:80,  spa:135, spd:80,  spe:121, types:['Normal','Flying'] },
  'Arbok':           { hp:60,  atk:95,  def:69,  spa:65,  spd:79,  spe:80,  types:['Poison'] },
  'Pikachu':         { hp:35,  atk:55,  def:40,  spa:50,  spd:50,  spe:90,  types:['Electric'] },
  'Raichu':          { hp:60,  atk:90,  def:55,  spa:90,  spd:80,  spe:110, types:['Electric'] },
  'Raichu-Alola':    { hp:60,  atk:85,  def:50,  spa:95,  spd:85,  spe:110, types:['Electric','Psychic'] },
  'Clefable':        { hp:95,  atk:70,  def:73,  spa:95,  spd:90,  spe:60,  types:['Fairy'] },
  'Mega Clefable':   { hp:95,  atk:80,  def:93,  spa:115, spd:110, spe:60,  types:['Fairy'] },
  'Ninetales':       { hp:73,  atk:76,  def:75,  spa:81,  spd:100, spe:100, types:['Fire'] },
  'Ninetales-Alola': { hp:73,  atk:67,  def:75,  spa:81,  spd:100, spe:109, types:['Ice','Fairy'] },
  'Arcanine':        { hp:90,  atk:110, def:80,  spa:100, spd:80,  spe:95,  types:['Fire'] },
  'Arcanine-Hisui':  { hp:95,  atk:115, def:80,  spa:95,  spd:80,  spe:90,  types:['Fire','Rock'] },
  'Alakazam':        { hp:55,  atk:50,  def:45,  spa:135, spd:95,  spe:120, types:['Psychic'] },
  'Mega Alakazam':   { hp:55,  atk:50,  def:65,  spa:175, spd:105, spe:150, types:['Psychic'] },
  'Machamp':         { hp:90,  atk:130, def:80,  spa:65,  spd:85,  spe:55,  types:['Fighting'] },
  'Victreebel':      { hp:80,  atk:105, def:65,  spa:100, spd:70,  spe:70,  types:['Grass','Poison'] },
  'Mega Victreebel': { hp:80,  atk:125, def:75,  spa:120, spd:80,  spe:70,  types:['Grass','Poison'] },
  'Slowbro':         { hp:95,  atk:75,  def:110, spa:100, spd:80,  spe:30,  types:['Water','Psychic'] },
  'Mega Slowbro':    { hp:95,  atk:75,  def:180, spa:130, spd:80,  spe:30,  types:['Water','Psychic'] },
  'Slowbro-Galar':   { hp:95,  atk:100, def:95,  spa:100, spd:70,  spe:30,  types:['Poison','Psychic'] },
  'Gengar':          { hp:60,  atk:65,  def:60,  spa:130, spd:75,  spe:110, types:['Ghost','Poison'] },
  'Mega Gengar':     { hp:60,  atk:65,  def:80,  spa:170, spd:95,  spe:130, types:['Ghost','Poison'] },
  'Kangaskhan':      { hp:105, atk:95,  def:80,  spa:40,  spd:80,  spe:90,  types:['Normal'] },
  'Mega Kangaskhan': { hp:105, atk:125, def:100, spa:60,  spd:100, spe:100, types:['Normal'] },
  'Starmie':         { hp:60,  atk:75,  def:85,  spa:100, spd:85,  spe:115, types:['Water','Psychic'] },
  'Mega Starmie':    { hp:60,  atk:75,  def:100, spa:130, spd:100, spe:130, types:['Water','Psychic'] },
  'Pinsir':          { hp:65,  atk:125, def:100, spa:55,  spd:70,  spe:85,  types:['Bug'] },
  'Mega Pinsir':     { hp:65,  atk:155, def:120, spa:65,  spd:90,  spe:105, types:['Bug','Flying'] },
  'Tauros':          { hp:75,  atk:100, def:95,  spa:40,  spd:70,  spe:110, types:['Normal'] },
  'Tauros-Paldea':   { hp:75,  atk:110, def:105, spa:30,  spd:70,  spe:100, types:['Fighting'] },
  'Gyarados':        { hp:95,  atk:125, def:79,  spa:60,  spd:100, spe:81,  types:['Water','Flying'] },
  'Mega Gyarados':   { hp:95,  atk:155, def:109, spa:70,  spd:130, spe:81,  types:['Water','Dark'] },
  'Ditto':           { hp:48,  atk:48,  def:48,  spa:48,  spd:48,  spe:48,  types:['Normal'] },
  'Vaporeon':        { hp:130, atk:65,  def:60,  spa:110, spd:95,  spe:65,  types:['Water'] },
  'Jolteon':         { hp:65,  atk:65,  def:60,  spa:110, spd:95,  spe:130, types:['Electric'] },
  'Flareon':         { hp:65,  atk:130, def:60,  spa:95,  spd:110, spe:65,  types:['Fire'] },
  'Aerodactyl':      { hp:80,  atk:105, def:65,  spa:60,  spd:75,  spe:130, types:['Rock','Flying'] },
  'Mega Aerodactyl': { hp:80,  atk:135, def:85,  spa:70,  spd:95,  spe:150, types:['Rock','Flying'] },
  'Snorlax':         { hp:160, atk:110, def:65,  spa:65,  spd:110, spe:30,  types:['Normal'] },
  'Dragonite':       { hp:91,  atk:134, def:95,  spa:100, spd:100, spe:80,  types:['Dragon','Flying'] },
  'Mega Dragonite':  { hp:91,  atk:160, def:105, spa:120, spd:110, spe:90,  types:['Dragon','Flying'] },
  'Meganium':        { hp:80,  atk:82,  def:100, spa:83,  spd:100, spe:80,  types:['Grass'] },
  'Mega Meganium':   { hp:80,  atk:102, def:120, spa:103, spd:120, spe:80,  types:['Grass'] },
  'Typhlosion':      { hp:78,  atk:84,  def:78,  spa:109, spd:85,  spe:100, types:['Fire'] },
  'Typhlosion-Hisui':{ hp:73,  atk:84,  def:78,  spa:119, spd:85,  spe:95,  types:['Fire','Ghost'] },
  'Feraligatr':      { hp:85,  atk:105, def:100, spa:79,  spd:83,  spe:78,  types:['Water'] },
  'Mega Feraligatr': { hp:85,  atk:135, def:110, spa:79,  spd:93,  spe:88,  types:['Water'] },
  'Ariados':         { hp:70,  atk:90,  def:70,  spa:60,  spd:60,  spe:40,  types:['Bug','Poison'] },
  'Ampharos':        { hp:90,  atk:75,  def:85,  spa:115, spd:90,  spe:55,  types:['Electric'] },
  'Mega Ampharos':   { hp:90,  atk:95,  def:105, spa:165, spd:110, spe:45,  types:['Electric','Dragon'] },
  'Azumarill':       { hp:100, atk:50,  def:80,  spa:60,  spd:80,  spe:50,  types:['Water','Fairy'] },
  'Politoed':        { hp:90,  atk:75,  def:75,  spa:90,  spd:100, spe:70,  types:['Water'] },
  'Espeon':          { hp:65,  atk:65,  def:60,  spa:130, spd:95,  spe:110, types:['Psychic'] },
  'Umbreon':         { hp:95,  atk:65,  def:110, spa:60,  spd:130, spe:65,  types:['Dark'] },
  'Slowking':        { hp:95,  atk:75,  def:80,  spa:100, spd:110, spe:30,  types:['Water','Psychic'] },
  'Slowking-Galar':  { hp:95,  atk:65,  def:80,  spa:110, spd:110, spe:30,  types:['Poison','Psychic'] },
  'Forretress':      { hp:75,  atk:90,  def:140, spa:60,  spd:60,  spe:40,  types:['Bug','Steel'] },
  'Steelix':         { hp:75,  atk:85,  def:200, spa:55,  spd:65,  spe:30,  types:['Steel','Ground'] },
  'Mega Steelix':    { hp:75,  atk:125, def:230, spa:55,  spd:95,  spe:30,  types:['Steel','Ground'] },
  'Scizor':          { hp:70,  atk:130, def:100, spa:55,  spd:80,  spe:65,  types:['Bug','Steel'] },
  'Mega Scizor':     { hp:70,  atk:150, def:140, spa:65,  spd:100, spe:75,  types:['Bug','Steel'] },
  'Heracross':       { hp:80,  atk:125, def:75,  spa:40,  spd:95,  spe:85,  types:['Bug','Fighting'] },
  'Mega Heracross':  { hp:80,  atk:185, def:115, spa:40,  spd:105, spe:75,  types:['Bug','Fighting'] },
  'Skarmory':        { hp:65,  atk:80,  def:140, spa:40,  spd:70,  spe:70,  types:['Steel','Flying'] },
  'Mega Skarmory':   { hp:65,  atk:100, def:170, spa:40,  spd:90,  spe:80,  types:['Steel','Flying'] },
  'Houndoom':        { hp:75,  atk:90,  def:50,  spa:110, spd:80,  spe:95,  types:['Dark','Fire'] },
  'Mega Houndoom':   { hp:75,  atk:90,  def:90,  spa:140, spd:90,  spe:115, types:['Dark','Fire'] },
  'Tyranitar':       { hp:100, atk:134, def:110, spa:95,  spd:100, spe:61,  types:['Rock','Dark'] },
  'Mega Tyranitar':  { hp:100, atk:164, def:150, spa:95,  spd:120, spe:71,  types:['Rock','Dark'] },
  'Pelipper':        { hp:60,  atk:50,  def:100, spa:95,  spd:70,  spe:65,  types:['Water','Flying'] },
  'Gardevoir':       { hp:68,  atk:65,  def:65,  spa:125, spd:115, spe:80,  types:['Psychic','Fairy'] },
  'Mega Gardevoir':  { hp:68,  atk:85,  def:65,  spa:165, spd:135, spe:100, types:['Psychic','Fairy'] },
  'Sableye':         { hp:50,  atk:75,  def:75,  spa:65,  spd:65,  spe:50,  types:['Dark','Ghost'] },
  'Mega Sableye':    { hp:50,  atk:85,  def:125, spa:85,  spd:115, spe:20,  types:['Dark','Ghost'] },
  'Aggron':          { hp:70,  atk:110, def:180, spa:60,  spd:60,  spe:50,  types:['Steel','Rock'] },
  'Mega Aggron':     { hp:70,  atk:140, def:230, spa:60,  spd:80,  spe:50,  types:['Steel'] },
  'Medicham':        { hp:60,  atk:60,  def:75,  spa:60,  spd:75,  spe:80,  types:['Fighting','Psychic'] },
  'Mega Medicham':   { hp:60,  atk:100, def:85,  spa:80,  spd:85,  spe:100, types:['Fighting','Psychic'] },
  'Manectric':       { hp:70,  atk:75,  def:60,  spa:105, spd:60,  spe:105, types:['Electric'] },
  'Mega Manectric':  { hp:70,  atk:75,  def:80,  spa:135, spd:80,  spe:135, types:['Electric'] },
  'Sharpedo':        { hp:70,  atk:120, def:40,  spa:95,  spd:40,  spe:95,  types:['Water','Dark'] },
  'Mega Sharpedo':   { hp:70,  atk:140, def:70,  spa:110, spd:65,  spe:105, types:['Water','Dark'] },
  'Camerupt':        { hp:70,  atk:100, def:70,  spa:105, spd:75,  spe:40,  types:['Fire','Ground'] },
  'Mega Camerupt':   { hp:70,  atk:120, def:100, spa:145, spd:105, spe:20,  types:['Fire','Ground'] },
  'Torkoal':         { hp:70,  atk:85,  def:140, spa:85,  spd:70,  spe:20,  types:['Fire'] },
  'Altaria':         { hp:75,  atk:70,  def:90,  spa:70,  spd:105, spe:80,  types:['Dragon','Flying'] },
  'Mega Altaria':    { hp:75,  atk:110, def:110, spa:110, spd:105, spe:80,  types:['Dragon','Fairy'] },
  'Milotic':         { hp:95,  atk:60,  def:79,  spa:100, spd:125, spe:81,  types:['Water'] },
  'Castform':        { hp:70,  atk:70,  def:70,  spa:70,  spd:70,  spe:70,  types:['Normal'] },
  'Banette':         { hp:64,  atk:115, def:65,  spa:83,  spd:63,  spe:65,  types:['Ghost'] },
  'Mega Banette':    { hp:64,  atk:165, def:75,  spa:93,  spd:83,  spe:75,  types:['Ghost'] },
  'Chimecho':        { hp:65,  atk:50,  def:70,  spa:95,  spd:80,  spe:65,  types:['Psychic'] },
  'Mega Chimecho':   { hp:65,  atk:60,  def:90,  spa:120, spd:100, spe:70,  types:['Psychic'] },
  'Absol':           { hp:65,  atk:130, def:60,  spa:75,  spd:60,  spe:75,  types:['Dark'] },
  'Mega Absol':      { hp:65,  atk:150, def:60,  spa:115, spd:60,  spe:115, types:['Dark'] },
  'Glalie':          { hp:80,  atk:80,  def:80,  spa:80,  spd:80,  spe:80,  types:['Ice'] },
  'Mega Glalie':     { hp:80,  atk:120, def:80,  spa:120, spd:80,  spe:100, types:['Ice'] },
  'Torterra':        { hp:95,  atk:109, def:105, spa:75,  spd:85,  spe:56,  types:['Grass','Ground'] },
  'Infernape':       { hp:76,  atk:104, def:71,  spa:104, spd:71,  spe:108, types:['Fire','Fighting'] },
  'Empoleon':        { hp:84,  atk:86,  def:88,  spa:111, spd:101, spe:60,  types:['Water','Steel'] },
  'Luxray':          { hp:80,  atk:120, def:79,  spa:95,  spd:79,  spe:70,  types:['Electric'] },
  'Roserade':        { hp:60,  atk:70,  def:65,  spa:125, spd:105, spe:90,  types:['Grass','Poison'] },
  'Rampardos':       { hp:97,  atk:165, def:60,  spa:65,  spd:50,  spe:58,  types:['Rock'] },
  'Bastiodon':       { hp:60,  atk:52,  def:168, spa:47,  spd:138, spe:30,  types:['Rock','Steel'] },
  'Lopunny':         { hp:65,  atk:76,  def:84,  spa:54,  spd:96,  spe:105, types:['Normal'] },
  'Mega Lopunny':    { hp:65,  atk:136, def:94,  spa:54,  spd:96,  spe:135, types:['Normal','Fighting'] },
  'Spiritomb':       { hp:50,  atk:92,  def:108, spa:92,  spd:108, spe:35,  types:['Ghost','Dark'] },
  'Garchomp':        { hp:108, atk:130, def:95,  spa:80,  spd:85,  spe:102, types:['Dragon','Ground'] },
  'Mega Garchomp':   { hp:108, atk:170, def:115, spa:120, spd:95,  spe:92,  types:['Dragon','Ground'] },
  'Lucario':         { hp:70,  atk:110, def:70,  spa:115, spd:70,  spe:90,  types:['Fighting','Steel'] },
  'Mega Lucario':    { hp:70,  atk:145, def:88,  spa:140, spd:70,  spe:112, types:['Fighting','Steel'] },
  'Hippowdon':       { hp:108, atk:112, def:118, spa:68,  spd:72,  spe:47,  types:['Ground'] },
  'Toxicroak':       { hp:83,  atk:106, def:65,  spa:86,  spd:65,  spe:85,  types:['Poison','Fighting'] },
  'Abomasnow':       { hp:90,  atk:92,  def:75,  spa:92,  spd:85,  spe:60,  types:['Grass','Ice'] },
  'Mega Abomasnow':  { hp:90,  atk:132, def:105, spa:132, spd:105, spe:30,  types:['Grass','Ice'] },
  'Weavile':         { hp:70,  atk:120, def:65,  spa:45,  spd:85,  spe:125, types:['Dark','Ice'] },
  'Rhyperior':       { hp:115, atk:140, def:130, spa:55,  spd:55,  spe:40,  types:['Ground','Rock'] },
  'Leafeon':         { hp:65,  atk:110, def:130, spa:60,  spd:65,  spe:95,  types:['Grass'] },
  'Glaceon':         { hp:65,  atk:60,  def:110, spa:130, spd:95,  spe:65,  types:['Ice'] },
  'Gliscor':         { hp:75,  atk:95,  def:125, spa:45,  spd:75,  spe:95,  types:['Ground','Flying'] },
  'Mamoswine':       { hp:110, atk:130, def:80,  spa:70,  spd:60,  spe:80,  types:['Ice','Ground'] },
  'Gallade':         { hp:68,  atk:125, def:65,  spa:65,  spd:115, spe:80,  types:['Psychic','Fighting'] },
  'Mega Gallade':    { hp:68,  atk:165, def:95,  spa:65,  spd:115, spe:110, types:['Psychic','Fighting'] },
  'Froslass':        { hp:70,  atk:80,  def:70,  spa:80,  spd:70,  spe:110, types:['Ice','Ghost'] },
  'Mega Froslass':   { hp:70,  atk:90,  def:90,  spa:110, spd:90,  spe:120, types:['Ice','Ghost'] },
  'Rotom-Heat':  { hp:50, atk:65, def:107, spa:105, spd:107, spe:86, types:['Electric','Fire'] },
'Rotom-Wash':  { hp:50, atk:65, def:107, spa:105, spd:107, spe:86, types:['Electric','Water'] },
'Rotom-Frost': { hp:50, atk:65, def:107, spa:105, spd:107, spe:86, types:['Electric','Ice'] },
'Rotom-Fan':   { hp:50, atk:65, def:107, spa:105, spd:107, spe:86, types:['Electric','Flying'] },
'Rotom-Mow':   { hp:50, atk:65, def:107, spa:105, spd:107, spe:86, types:['Electric','Grass'] },
  'Serperior':       { hp:75,  atk:75,  def:95,  spa:75,  spd:95,  spe:113, types:['Grass'] },
  'Emboar':          { hp:110, atk:123, def:65,  spa:100, spd:65,  spe:65,  types:['Fire','Fighting'] },
  'Mega Emboar':     { hp:110, atk:153, def:85,  spa:100, spd:75,  spe:55,  types:['Fire','Fighting'] },
  'Samurott':        { hp:95,  atk:100, def:85,  spa:108, spd:70,  spe:70,  types:['Water'] },
  'Samurott-Hisui':  { hp:90,  atk:108, def:80,  spa:100, spd:65,  spe:85,  types:['Water','Dark'] },
  'Watchog':         { hp:60,  atk:85,  def:69,  spa:60,  spd:69,  spe:77,  types:['Normal'] },
  'Liepard':         { hp:64,  atk:88,  def:50,  spa:88,  spd:50,  spe:106, types:['Dark'] },
  'Simisage':        { hp:75,  atk:98,  def:63,  spa:98,  spd:63,  spe:101, types:['Grass'] },
  'Simisear':        { hp:75,  atk:98,  def:63,  spa:98,  spd:63,  spe:101, types:['Fire'] },
  'Simipour':        { hp:75,  atk:98,  def:63,  spa:98,  spd:63,  spe:101, types:['Water'] },
  'Excadrill':       { hp:110, atk:135, def:60,  spa:50,  spd:65,  spe:88,  types:['Ground','Steel'] },
  'Mega Excadrill':  { hp:110, atk:165, def:80,  spa:50,  spd:75,  spe:88,  types:['Ground','Steel'] },
  'Audino':          { hp:103, atk:60,  def:86,  spa:60,  spd:86,  spe:50,  types:['Normal'] },
  'Mega Audino':     { hp:103, atk:60,  def:126, spa:80,  spd:126, spe:50,  types:['Normal','Fairy'] },
  'Conkeldurr':      { hp:105, atk:140, def:95,  spa:55,  spd:65,  spe:45,  types:['Fighting'] },
  'Whimsicott':      { hp:60,  atk:67,  def:85,  spa:77,  spd:75,  spe:116, types:['Grass','Fairy'] },
  'Krookodile':      { hp:95,  atk:117, def:80,  spa:65,  spd:70,  spe:92,  types:['Ground','Dark'] },
  'Cofagrigus':      { hp:58,  atk:50,  def:145, spa:95,  spd:105, spe:30,  types:['Ghost'] },
  'Garbodor':        { hp:80,  atk:95,  def:82,  spa:60,  spd:82,  spe:75,  types:['Poison'] },
  'Zoroark':         { hp:60,  atk:105, def:60,  spa:120, spd:60,  spe:105, types:['Dark'] },
  'Zoroark-Hisui':   { hp:55,  atk:100, def:60,  spa:100, spd:60,  spe:110, types:['Normal','Ghost'] },
  'Reuniclus':       { hp:110, atk:65,  def:75,  spa:125, spd:85,  spe:30,  types:['Psychic'] },
  'Vanilluxe':       { hp:71,  atk:95,  def:85,  spa:110, spd:95,  spe:79,  types:['Ice'] },
  'Emolga':          { hp:55,  atk:75,  def:60,  spa:75,  spd:60,  spe:103, types:['Electric','Flying'] },
  'Chandelure':      { hp:60,  atk:55,  def:90,  spa:145, spd:90,  spe:80,  types:['Ghost','Fire'] },
  'Mega Chandelure': { hp:60,  atk:55,  def:100, spa:175, spd:100, spe:90,  types:['Ghost','Fire'] },
  'Beartic':         { hp:95,  atk:130, def:80,  spa:70,  spd:80,  spe:50,  types:['Ice'] },
  'Stunfisk':        { hp:109, atk:66,  def:84,  spa:81,  spd:99,  spe:32,  types:['Ground','Electric'] },
  'Stunfisk-Galar':  { hp:109, atk:81,  def:99,  spa:66,  spd:84,  spe:32,  types:['Ground','Steel'] },
  'Golurk':          { hp:89,  atk:124, def:80,  spa:55,  spd:80,  spe:55,  types:['Ground','Ghost'] },
  'Mega Golurk':     { hp:89,  atk:154, def:100, spa:55,  spd:90,  spe:55,  types:['Ground','Ghost'] },
  'Hydreigon':       { hp:92,  atk:105, def:90,  spa:125, spd:90,  spe:98,  types:['Dark','Dragon'] },
  'Volcarona':       { hp:85,  atk:60,  def:65,  spa:135, spd:105, spe:100, types:['Bug','Fire'] },
  'Chesnaught':      { hp:88,  atk:107, def:122, spa:74,  spd:75,  spe:64,  types:['Grass','Fighting'] },
  'Mega Chesnaught': { hp:88,  atk:127, def:152, spa:74,  spd:85,  spe:54,  types:['Grass','Fighting'] },
  'Delphox':         { hp:75,  atk:69,  def:72,  spa:114, spd:100, spe:104, types:['Fire','Psychic'] },
  'Mega Delphox':    { hp:75,  atk:69,  def:92,  spa:144, spd:110, spe:104, types:['Fire','Psychic'] },
  'Greninja':        { hp:72,  atk:95,  def:67,  spa:103, spd:71,  spe:122, types:['Water','Dark'] },
  'Mega Greninja':   { hp:72,  atk:115, def:77,  spa:123, spd:81,  spe:142, types:['Water','Dark'] },
  'Diggersby':       { hp:85,  atk:56,  def:77,  spa:50,  spd:77,  spe:78,  types:['Normal','Ground'] },
  'Talonflame':      { hp:78,  atk:81,  def:71,  spa:74,  spd:69,  spe:126, types:['Fire','Flying'] },
  'Vivillon':        { hp:80,  atk:52,  def:50,  spa:90,  spd:50,  spe:89,  types:['Bug','Flying'] },
  'Floette':         { hp:54,  atk:45,  def:67,  spa:82,  spd:82,  spe:52,  types:['Fairy'] },
  'Mega Floette':    { hp:54,  atk:45,  def:87,  spa:112, spd:102, spe:52,  types:['Fairy'] },
  'Florges':         { hp:78,  atk:65,  def:68,  spa:112, spd:154, spe:75,  types:['Fairy'] },
  'Pangoro':         { hp:95,  atk:124, def:78,  spa:69,  spd:71,  spe:58,  types:['Fighting','Dark'] },
  'Furfrou':         { hp:75,  atk:80,  def:60,  spa:65,  spd:90,  spe:102, types:['Normal'] },
  'Meowstic':        { hp:74,  atk:48,  def:76,  spa:83,  spd:81,  spe:104, types:['Psychic'] },
  'Mega Meowstic':   { hp:74,  atk:48,  def:96,  spa:113, spd:101, spe:114, types:['Psychic'] },
  'Aegislash':       { hp:60,  atk:50,  def:150, spa:50,  spd:150, spe:60,  types:['Steel','Ghost'] },
  'Aromatisse':      { hp:101, atk:72,  def:72,  spa:99,  spd:89,  spe:29,  types:['Fairy'] },
  'Slurpuff':        { hp:82,  atk:80,  def:86,  spa:85,  spd:75,  spe:72,  types:['Fairy'] },
  'Clawitzer':       { hp:71,  atk:73,  def:88,  spa:120, spd:89,  spe:59,  types:['Water'] },
  'Heliolisk':       { hp:62,  atk:55,  def:52,  spa:109, spd:94,  spe:109, types:['Electric','Normal'] },
  'Tyrantrum':       { hp:82,  atk:121, def:119, spa:69,  spd:59,  spe:71,  types:['Rock','Dragon'] },
  'Aurorus':         { hp:123, atk:77,  def:72,  spa:99,  spd:92,  spe:58,  types:['Rock','Ice'] },
  'Sylveon':         { hp:95,  atk:65,  def:65,  spa:110, spd:130, spe:60,  types:['Fairy'] },
  'Hawlucha':        { hp:78,  atk:92,  def:75,  spa:74,  spd:63,  spe:118, types:['Fighting','Flying'] },
  'Mega Hawlucha':   { hp:78,  atk:112, def:85,  spa:84,  spd:73,  spe:138, types:['Fighting','Flying'] },
  'Dedenne':         { hp:67,  atk:58,  def:57,  spa:81,  spd:67,  spe:101, types:['Electric','Fairy'] },
  'Goodra':          { hp:90,  atk:100, def:70,  spa:110, spd:150, spe:80,  types:['Dragon'] },
  'Goodra-Hisui':    { hp:80,  atk:100, def:100, spa:110, spd:150, spe:60,  types:['Dragon','Steel'] },
  'Klefki':          { hp:57,  atk:80,  def:91,  spa:80,  spd:87,  spe:75,  types:['Steel','Fairy'] },
  'Trevenant':       { hp:85,  atk:110, def:76,  spa:65,  spd:82,  spe:56,  types:['Ghost','Grass'] },
  'Gourgeist':       { hp:65,  atk:90,  def:122, spa:58,  spd:75,  spe:84,  types:['Ghost','Grass'] },
  'Avalugg':         { hp:95,  atk:117, def:184, spa:44,  spd:46,  spe:28,  types:['Ice'] },
  'Avalugg-Hisui':   { hp:95,  atk:127, def:184, spa:34,  spd:36,  spe:38,  types:['Ice','Rock'] },
  'Noivern':         { hp:85,  atk:70,  def:80,  spa:97,  spd:80,  spe:123, types:['Flying','Dragon'] },
  // Gen 7
  'Decidueye':       { hp:78,  atk:107, def:75,  spa:100, spd:100, spe:70,  types:['Grass','Ghost'] },
  'Decidueye-Hisui': { hp:88,  atk:112, def:80,  spa:95,  spd:95,  spe:60,  types:['Grass','Fighting'] },
  'Incineroar':      { hp:95,  atk:115, def:90,  spa:80,  spd:90,  spe:60,  types:['Fire','Dark'] },
  'Primarina':       { hp:80,  atk:74,  def:74,  spa:126, spd:116, spe:60,  types:['Water','Fairy'] },
  'Toucannon':       { hp:80,  atk:120, def:75,  spa:75,  spd:75,  spe:60,  types:['Normal','Flying'] },
  'Crabominable':    { hp:97,  atk:132, def:77,  spa:62,  spd:67,  spe:43,  types:['Fighting','Ice'] },
  'Mega Crabominable':{ hp:97, atk:162, def:97,  spa:62,  spd:77,  spe:33,  types:['Fighting','Ice'] },
  'Lycanroc':        { hp:75,  atk:115, def:65,  spa:55,  spd:65,  spe:112, types:['Rock'] },
  'Toxapex':         { hp:50,  atk:63,  def:152, spa:53,  spd:142, spe:35,  types:['Poison','Water'] },
  'Mudsdale':        { hp:100, atk:125, def:100, spa:55,  spd:85,  spe:35,  types:['Ground'] },
  'Araquanid':       { hp:68,  atk:70,  def:92,  spa:50,  spd:132, spe:42,  types:['Water','Bug'] },
  'Salazzle':        { hp:68,  atk:64,  def:60,  spa:111, spd:60,  spe:117, types:['Poison','Fire'] },
  'Tsareena':        { hp:72,  atk:120, def:98,  spa:50,  spd:98,  spe:72,  types:['Grass'] },
  'Oranguru':        { hp:90,  atk:60,  def:80,  spa:90,  spd:110, spe:60,  types:['Normal','Psychic'] },
  'Passimian':       { hp:100, atk:120, def:90,  spa:40,  spd:60,  spe:80,  types:['Fighting'] },
  'Mimikyu':         { hp:55,  atk:90,  def:80,  spa:50,  spd:105, spe:96,  types:['Ghost','Fairy'] },
  'Drampa':          { hp:78,  atk:60,  def:85,  spa:135, spd:91,  spe:36,  types:['Normal','Dragon'] },
  'Mega Drampa':     { hp:78,  atk:70,  def:95,  spa:155, spd:101, spe:36,  types:['Normal','Dragon'] },
  'Kommo-o':         { hp:75,  atk:110, def:125, spa:100, spd:105, spe:85,  types:['Dragon','Fighting'] },
  'Togekiss':        { hp:85,  atk:50,  def:95,  spa:120, spd:115, spe:80,  types:['Fairy','Flying'] },
  // Gen 8
  'Corviknight':     { hp:98,  atk:87,  def:105, spa:53,  spd:85,  spe:67,  types:['Flying','Steel'] },
  'Flapple':         { hp:70,  atk:110, def:76,  spa:70,  spd:80,  spe:70,  types:['Grass','Dragon'] },
  'Appletun':        { hp:110, atk:85,  def:80,  spa:100, spd:80,  spe:30,  types:['Grass','Dragon'] },
  'Sandaconda':      { hp:72,  atk:107, def:125, spa:65,  spd:70,  spe:71,  types:['Ground'] },
  'Polteageist':     { hp:60,  atk:65,  def:65,  spa:134, spd:114, spe:70,  types:['Ghost'] },
  'Hatterene':       { hp:57,  atk:90,  def:95,  spa:136, spd:103, spe:29,  types:['Psychic','Fairy'] },
  'Mr. Rime':        { hp:80,  atk:85,  def:75,  spa:110, spd:100, spe:70,  types:['Ice','Psychic'] },
  'Runerigus':       { hp:58,  atk:95,  def:145, spa:50,  spd:105, spe:30,  types:['Ground','Ghost'] },
  'Alcremie':        { hp:65,  atk:60,  def:75,  spa:110, spd:121, spe:64,  types:['Fairy'] },
  'Morpeko':         { hp:58,  atk:95,  def:58,  spa:70,  spd:58,  spe:97,  types:['Electric','Dark'] },
  'Dragapult':       { hp:88,  atk:120, def:75,  spa:100, spd:75,  spe:142, types:['Dragon','Ghost'] },
  'Wyrdeer':         { hp:103, atk:105, def:72,  spa:105, spd:75,  spe:65,  types:['Normal','Psychic'] },
  'Kleavor':         { hp:70,  atk:135, def:95,  spa:45,  spd:70,  spe:85,  types:['Bug','Rock'] },
  'Basculegion':     { hp:120, atk:112, def:65,  spa:80,  spd:75,  spe:78,  types:['Water','Ghost'] },
  'Sneasler':        { hp:80,  atk:130, def:60,  spa:40,  spd:80,  spe:120, types:['Fighting','Poison'] },
  // Gen 9
  'Meowscarada':     { hp:76,  atk:110, def:70,  spa:81,  spd:70,  spe:123, types:['Grass','Dark'] },
  'Skeledirge':      { hp:104, atk:75,  def:100, spa:110, spd:75,  spe:66,  types:['Fire','Ghost'] },
  'Quaquaval':       { hp:85,  atk:120, def:80,  spa:85,  spd:75,  spe:85,  types:['Water','Fighting'] },
  'Maushold':        { hp:74,  atk:75,  def:70,  spa:65,  spd:75,  spe:111, types:['Normal'] },
  'Garganacl':       { hp:100, atk:100, def:130, spa:45,  spd:90,  spe:35,  types:['Rock'] },
  'Armarouge':       { hp:85,  atk:60,  def:100, spa:125, spd:80,  spe:75,  types:['Fire','Psychic'] },
  'Ceruledge':       { hp:75,  atk:125, def:80,  spa:60,  spd:100, spe:85,  types:['Fire','Ghost'] },
  'Bellibolt':       { hp:109, atk:64,  def:91,  spa:103, spd:83,  spe:45,  types:['Electric'] },
  'Scovillain':      { hp:65,  atk:108, def:65,  spa:108, spd:65,  spe:75,  types:['Grass','Fire'] },
  'Mega Scovillain': { hp:65,  atk:138, def:75,  spa:138, spd:75,  spe:85,  types:['Grass','Fire'] },
  'Espathra':        { hp:95,  atk:60,  def:60,  spa:101, spd:60,  spe:105, types:['Psychic'] },
  'Tinkaton':        { hp:85,  atk:75,  def:77,  spa:70,  spd:105, spe:94,  types:['Fairy','Steel'] },
  'Palafin':         { hp:100, atk:160, def:97,  spa:106, spd:87,  spe:100, types:['Water'] },
  'Orthworm':        { hp:70,  atk:85,  def:145, spa:60,  spd:55,  spe:40,  types:['Steel'] },
  'Glimmora':        { hp:83,  atk:55,  def:90,  spa:130, spd:81,  spe:86,  types:['Rock','Poison'] },
  'Mega Glimmora':   { hp:83,  atk:65,  def:110, spa:150, spd:91,  spe:96,  types:['Rock','Poison'] },
  'Farigiraf':       { hp:120, atk:90,  def:70,  spa:90,  spd:70,  spe:60,  types:['Normal','Psychic'] },
  'Kingambit':       { hp:100, atk:135, def:120, spa:60,  spd:85,  spe:50,  types:['Dark','Steel'] },
  'Sinistcha':       { hp:71,  atk:60,  def:106, spa:121, spd:80,  spe:70,  types:['Grass','Ghost'] },
  'Archaludon':      { hp:90,  atk:105, def:130, spa:125, spd:65,  spe:85,  types:['Steel','Dragon'] },
  'Hydrapple':       { hp:106, atk:80,  def:110, spa:120, spd:80,  spe:44,  types:['Grass','Dragon'] },
'Lycanroc-Midnight': { hp:75, atk:115, def:65, spa:55, spd:65, spe:82,  types:['Rock'] },
'Lycanroc-Dusk':     { hp:75, atk:117, def:65, spa:55, spd:65, spe:110, types:['Rock'] },
'Tauros-Paldea-Fire':  { hp:75, atk:110, def:105, spa:30, spd:70, spe:100, types:['Fighting','Fire'] },
'Tauros-Paldea-Water': { hp:75, atk:110, def:105, spa:30, spd:70, spe:100, types:['Fighting','Water'] },
'Morpeko-Hangry':    { hp:58, atk:95, def:58, spa:70, spd:58, spe:97,  types:['Electric','Dark'] },
'Aegislash-Blade':   { hp:60, atk:150, def:50, spa:150, spd:50, spe:60, types:['Steel','Ghost'] },
'Meowstic-F':        { hp:74, atk:48, def:76, spa:83, spd:81, spe:104, types:['Psychic'] },
'Basculegion-F':     { hp:120, atk:92, def:65, spa:100, spd:75, spe:78, types:['Water','Ghost'] },
'Stunfisk-Galar':    { hp:109, atk:81, def:99, spa:66, spd:84, spe:32,  types:['Ground','Steel'] },
'Slowbro-Galar':     { hp:95, atk:100, def:95, spa:100, spd:70, spe:30, types:['Poison','Psychic'] },
'Slowking-Galar':    { hp:95, atk:65, def:80, spa:110, spd:110, spe:30, types:['Poison','Psychic'] },
'Zoroark-Hisui':     { hp:55, atk:100, def:60, spa:100, spd:60, spe:110, types:['Normal','Ghost'] },
'Samurott-Hisui':    { hp:90, atk:108, def:80, spa:100, spd:65, spe:85, types:['Water','Dark'] },
'Typhlosion-Hisui':  { hp:73, atk:84, def:78, spa:119, spd:85, spe:95,  types:['Fire','Ghost'] },
'Decidueye-Hisui':   { hp:88, atk:112, def:80, spa:95, spd:95, spe:60,  types:['Grass','Fighting'] },
'Arcanine-Hisui':    { hp:95, atk:115, def:80, spa:95, spd:80, spe:90,  types:['Fire','Rock'] },
'Goodra-Hisui':      { hp:80, atk:100, def:100, spa:110, spd:150, spe:60, types:['Dragon','Steel'] },
'Avalugg-Hisui':     { hp:95, atk:127, def:184, spa:34, spd:36, spe:38,  types:['Ice','Rock'] },
'Raichu-Alola':      { hp:60, atk:85, def:50, spa:95, spd:85, spe:110,  types:['Electric','Psychic'] },
'Ninetales-Alola':   { hp:73, atk:67, def:75, spa:81, spd:100, spe:109, types:['Ice','Fairy'] },
}

function getPokemonData(name) {
  loadCache()
  return statCache[name] || FALLBACK_STATS[name] || null
}

function getAllNames() {
  return CHAMPIONS_ROSTER
}

function cacheStats(name, stats) {
  loadCache()
  statCache[name] = stats
  saveCache()
}

function fuzzyMatchPokemon(rawName) {
  if (!rawName || rawName.length < 3) return null
  const cleaned = rawName.trim().toLowerCase()
  if (ocrStringCache[cleaned] !== undefined) return ocrStringCache[cleaned]
  let bestMatch = null, bestScore = 0
  for (const name of CHAMPIONS_ROSTER) {
    const score = similarity(cleaned, name.toLowerCase())
    if (score > bestScore) { bestScore = score; bestMatch = name }
  }
  const result = bestScore > 0.55 ? { name: bestMatch, confidence: bestScore } : null
  ocrStringCache[cleaned] = result
  return result
}

function similarity(a, b) {
  const longer = a.length > b.length ? a : b
  const shorter = a.length > b.length ? b : a
  if (longer.length === 0) return 1.0
  return (longer.length - editDistance(longer, shorter)) / longer.length
}

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
  return dp[a.length][b.length]
}

function getSmogonCalcs(attackerName, defenderName, moveNames, statStages, field, yourTeamConfig) {
  if (!attackerName || !defenderName) return null
  try {
    const { calculate, Pokemon, Move, Field, Side } = require('@smogon/calc')
    const attackerConfig = yourTeamConfig?.find(p => p.name === attackerName)
    const attackerStages = statStages?.your ?? {}
    const defenderStages = statStages?.enemy ?? {}

    const attackerOpts = {
      level: 50,
      boosts: { atk: attackerStages.atk ?? 0, spa: attackerStages.spa ?? 0, spe: attackerStages.spe ?? 0 },
    }
    if (attackerConfig) {
      if (attackerConfig.nature) attackerOpts.nature = attackerConfig.nature
      if (attackerConfig.evs)    attackerOpts.evs = attackerConfig.evs
      if (attackerConfig.item)   attackerOpts.item = attackerConfig.item
    }

    const attacker = new Pokemon(9, attackerName, attackerOpts)

    const defenderMinBulk = new Pokemon(9, defenderName, {
      level: 50,
      nature: 'Lonely',
      boosts: { def: defenderStages.def ?? 0, spd: defenderStages.spd ?? 0 },
    })

    const defenderMaxBulk = new Pokemon(9, defenderName, {
      level: 50,
      nature: 'Bold',
      evs: { hp: 252, def: 252, spd: 252 },
      boosts: { def: defenderStages.def ?? 0, spd: defenderStages.spd ?? 0 },
    })

    const smogonField = new Field({
      weather: mapWeather(field?.weather),
      terrain: mapTerrain(field?.terrain),
      isTrickRoom: field?.trickRoom ?? false,
      attackerSide: new Side({
        isTailwind: field?.tailwindYour ?? false,
        isReflect: field?.reflectYour ?? false,
        isLightScreen: field?.lightScreenYour ?? false,
      }),
      defenderSide: new Side({
        isTailwind: field?.tailwindEnemy ?? false,
        isReflect: field?.reflectEnemy ?? false,
        isLightScreen: field?.lightScreenEnemy ?? false,
      }),
    })

    return moveNames.map(moveName => {
      if (!moveName) return null
      try {
        const move = new Move(9, moveName, { isCrit: false })
        const resultMin = calculate(9, attacker, defenderMaxBulk, move, smogonField)
        const resultMax = calculate(9, attacker, defenderMinBulk, move, smogonField)
        const [lowMin] = resultMin.range()
        const [, highMax] = resultMax.range()
        const low  = Math.round(lowMin)
        const high = Math.round(highMax)
        return {
          name: moveName,
          low,
          high,
          koLabel: low >= 100 ? 'OHKO' : low >= 50 ? '2HKO' : low >= 34 ? '3HKO' : null,
          isOHKO: low >= 100,
          is2HKO: low >= 50 && low < 100,
        }
      } catch {
        return { name: moveName, low: null, high: null, koLabel: null, isOHKO: false, is2HKO: false }
      }
    }).filter(Boolean)
  } catch (err) {
    console.error('Smogon calc error:', err)
    return null
  }
}

function mapWeather(w) {
  return { sun:'Sun', rain:'Rain', sand:'Sand', snow:'Snow' }[w] ?? 'None'
}

function mapTerrain(t) {
  return { electric:'Electric', grassy:'Grassy', misty:'Misty', psychic:'Psychic' }[t] ?? 'None'
}

const NATURE_MODIFIERS = {
  Hardy:{inc:null,dec:null}, Lonely:{inc:'atk',dec:'def'}, Brave:{inc:'atk',dec:'spe'},
  Adamant:{inc:'atk',dec:'spa'}, Naughty:{inc:'atk',dec:'spd'},
  Bold:{inc:'def',dec:'atk'}, Docile:{inc:null,dec:null}, Relaxed:{inc:'def',dec:'spe'},
  Impish:{inc:'def',dec:'spa'}, Lax:{inc:'def',dec:'spd'},
  Timid:{inc:'spe',dec:'atk'}, Hasty:{inc:'spe',dec:'def'}, Serious:{inc:null,dec:null},
  Jolly:{inc:'spe',dec:'spa'}, Naive:{inc:'spe',dec:'spd'},
  Modest:{inc:'spa',dec:'atk'}, Mild:{inc:'spa',dec:'def'}, Quiet:{inc:'spa',dec:'spe'},
  Bashful:{inc:null,dec:null}, Rash:{inc:'spa',dec:'spd'},
  Calm:{inc:'spd',dec:'atk'}, Gentle:{inc:'spd',dec:'def'}, Sassy:{inc:'spd',dec:'spe'},
  Careful:{inc:'spd',dec:'spa'}, Quirky:{inc:null,dec:null},
}

function getNatureModifier(nature) {
  return NATURE_MODIFIERS[nature] ?? { inc: null, dec: null }
}

module.exports = {
  getPokemonData, getAllNames, fuzzyMatchPokemon,
  getSmogonCalcs, cacheStats, CHAMPIONS_ROSTER, getNatureModifier,
}