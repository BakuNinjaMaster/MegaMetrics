// Maps Pokemon names to their PokeAPI sprite IDs
// Base URL: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png

const NAME_TO_ID = {
  // Gen 1
  'Venusaur': 3, 'Charizard': 6, 'Blastoise': 9, 'Beedrill': 15,
  'Pidgeot': 18, 'Arbok': 24, 'Pikachu': 25, 'Raichu': 26,
  'Clefable': 36, 'Ninetales': 38, 'Arcanine': 59, 'Alakazam': 65,
  'Machamp': 68, 'Victreebel': 71, 'Slowbro': 80, 'Gengar': 94,
  'Kangaskhan': 115, 'Starmie': 121, 'Pinsir': 127, 'Tauros': 128,
  'Gyarados': 130, 'Ditto': 132, 'Vaporeon': 134, 'Jolteon': 135,
  'Flareon': 136, 'Aerodactyl': 142, 'Snorlax': 143, 'Dragonite': 149,
  // Gen 2
  'Meganium': 154, 'Typhlosion': 157, 'Feraligatr': 160, 'Ariados': 168,
  'Ampharos': 181, 'Azumarill': 184, 'Politoed': 186, 'Espeon': 196,
  'Umbreon': 197, 'Slowking': 199, 'Forretress': 205, 'Steelix': 208,
  'Scizor': 212, 'Heracross': 214, 'Skarmory': 227, 'Houndoom': 229,
  'Tyranitar': 248,
  // Gen 3
  'Pelipper': 279, 'Gardevoir': 282, 'Sableye': 302, 'Aggron': 306,
  'Medicham': 308, 'Manectric': 310, 'Sharpedo': 319, 'Camerupt': 323,
  'Torkoal': 324, 'Altaria': 334, 'Milotic': 350, 'Castform': 351,
  'Banette': 354, 'Chimecho': 358, 'Absol': 359, 'Glalie': 362,
  // Gen 4
  'Torterra': 389, 'Infernape': 392, 'Empoleon': 395, 'Luxray': 405,
  'Roserade': 407, 'Rampardos': 409, 'Bastiodon': 411, 'Lopunny': 428,
  'Spiritomb': 442, 'Garchomp': 445, 'Lucario': 448, 'Hippowdon': 450,
  'Toxicroak': 454, 'Abomasnow': 460, 'Weavile': 461, 'Rhyperior': 464,
  'Leafeon': 470, 'Glaceon': 471, 'Gliscor': 472, 'Mamoswine': 473,
  'Gallade': 475, 'Froslass': 478, 'Rotom': 479,
  // Gen 5
  'Serperior': 497, 'Emboar': 500, 'Samurott': 503, 'Watchog': 505,
  'Liepard': 510, 'Simisage': 512, 'Simisear': 514, 'Simipour': 516,
  'Excadrill': 530, 'Audino': 531, 'Conkeldurr': 534, 'Whimsicott': 547,
  'Krookodile': 553, 'Cofagrigus': 563, 'Garbodor': 569, 'Zoroark': 571,
  'Reuniclus': 579, 'Vanilluxe': 584, 'Emolga': 587, 'Chandelure': 609,
  'Beartic': 614, 'Stunfisk': 618, 'Golurk': 623, 'Hydreigon': 635,
  'Volcarona': 637,
  // Gen 6
  'Chesnaught': 652, 'Delphox': 655, 'Greninja': 658, 'Diggersby': 660,
  'Talonflame': 663, 'Vivillon': 666, 'Floette': 670, 'Florges': 671,
  'Pangoro': 675, 'Furfrou': 676, 'Meowstic': 678, 'Aegislash': 681,
  'Aromatisse': 683, 'Slurpuff': 685, 'Clawitzer': 693, 'Heliolisk': 695,
  'Tyrantrum': 697, 'Aurorus': 699, 'Sylveon': 700, 'Hawlucha': 701,
  'Dedenne': 702, 'Goodra': 706, 'Klefki': 707, 'Trevenant': 709,
  'Gourgeist': 711, 'Avalugg': 713, 'Noivern': 715,
  // Gen 7
  'Decidueye': 724, 'Incineroar': 727, 'Primarina': 730, 'Toucannon': 733,
  'Crabominable': 740, 'Lycanroc': 745, 'Toxapex': 748, 'Mudsdale': 750,
  'Araquanid': 752, 'Salazzle': 758, 'Tsareena': 763, 'Oranguru': 765,
  'Passimian': 766, 'Mimikyu': 778, 'Drampa': 780, 'Kommo-o': 784,
  // Gen 8
  'Corviknight': 823, 'Flapple': 841, 'Appletun': 842, 'Sandaconda': 844,
  'Polteageist': 855, 'Hatterene': 858, 'Mr. Rime': 866, 'Runerigus': 867,
  'Alcremie': 869, 'Morpeko': 877, 'Dragapult': 887,
  // Hisui/Legends
  'Wyrdeer': 899, 'Kleavor': 900, 'Basculegion': 902, 'Sneasler': 903,
  // Gen 9
  'Meowscarada': 908, 'Skeledirge': 911, 'Quaquaval': 914, 'Maushold': 925,
  'Garganacl': 934, 'Armarouge': 936, 'Ceruledge': 937, 'Bellibolt': 939,
  'Scovillain': 952, 'Espathra': 956, 'Tinkaton': 959, 'Palafin': 964,
  'Orthworm': 968, 'Glimmora': 970, 'Farigiraf': 981, 'Kingambit': 983,
  'Sinistcha': 1013, 'Archaludon': 1018, 'Hydrapple': 1019,
  // Regional variants - same base sprite
  'Raichu-Alola': 26, 'Ninetales-Alola': 38, 'Arcanine-Hisui': 59,
  'Slowbro-Galar': 80, 'Slowking-Galar': 199, 'Stunfisk-Galar': 618,
  'Typhlosion-Hisui': 157, 'Samurott-Hisui': 503, 'Zoroark-Hisui': 571,
  'Decidueye-Hisui': 724, 'Goodra-Hisui': 706, 'Avalugg-Hisui': 713,
  'Tauros-Paldea': 128,
}

// Alternate forms with specific form sprite IDs
const FORM_SPRITE_URLS = {
  'Rotom-Heat':  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10008.png',
  'Rotom-Wash':  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10009.png',
  'Rotom-Frost': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10010.png',
  'Rotom-Fan':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10011.png',
  'Rotom-Mow':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10012.png',
  'Lycanroc-Midnight': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10147.png',
  'Lycanroc-Dusk':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10152.png',
  'Aegislash-Blade':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10026.png',
  'Meowstic-F':          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10521.png',
  'Morpeko-Hangry':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10184.png',
  'Basculegion-F':       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10243.png',
  'Tauros-Paldea-Fire':  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10250.png',
  'Tauros-Paldea-Water': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10251.png',
}

// Mega form sprites
const MEGA_SPRITE_URLS = {
  'Mega Venusaur':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10033.png',
  'Mega Charizard X': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10034.png',
  'Mega Charizard Y': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10035.png',
  'Mega Blastoise':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10036.png',
  'Mega Alakazam':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10037.png',
  'Mega Gengar':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10038.png',
  'Mega Kangaskhan':  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10039.png',
  'Mega Pinsir':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10040.png',
  'Mega Gyarados':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10041.png',
  'Mega Aerodactyl':  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10042.png',
  'Mega Ampharos':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10045.png',
  'Mega Scizor':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10046.png',
  'Mega Heracross':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10047.png',
  'Mega Houndoom':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10048.png',
  'Mega Tyranitar':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10049.png',
  'Mega Gardevoir':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10051.png',
  'Mega Aggron':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10053.png',
  'Mega Medicham':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10054.png',
  'Mega Manectric':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10055.png',
  'Mega Banette':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10056.png',
  'Mega Absol':       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10057.png',
  'Mega Garchomp':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10058.png',
  'Mega Lucario':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10059.png',
  'Mega Abomasnow':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10060.png',
  'Mega Sableye':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10064.png',
  'Mega Altaria':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10065.png',
  'Mega Salamence':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10066.png',
  'Mega Metagross':   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10067.png',
  'Mega Latias':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10068.png',
  'Mega Latios':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10069.png',
  'Mega Lopunny':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10070.png',
  'Mega Gallade':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10071.png',
  'Mega Audino':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10072.png',
  'Mega Slowbro':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10073.png',
  'Mega Steelix':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10074.png',
  'Mega Pidgeot':     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10075.png',
  'Mega Glalie':      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10076.png',
  'Mega Sharpedo':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10077.png',
  'Mega Camerupt':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10078.png',
  'Mega Beedrill':    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10090.png',
  // Champions-exclusive Megas with no PokeAPI sprite
  'Mega Meganium': null, 'Mega Dragonite': null, 'Mega Feraligatr': null,
  'Mega Excadrill': null, 'Mega Golurk': null, 'Mega Chandelure': null,
  'Mega Emboar': null, 'Mega Chesnaught': null, 'Mega Delphox': null,
  'Mega Greninja': null, 'Mega Froslass': null, 'Mega Clefable': null,
  'Mega Victreebel': null, 'Mega Hawlucha': null, 'Mega Drampa': null,
  'Mega Skarmory': null, 'Mega Meowstic': null, 'Mega Floette': null,
  'Mega Crabominable': null, 'Mega Scovillain': null, 'Mega Glimmora': null,
  'Mega Starmie': null, 'Mega Chimecho': null,
}

export function getSpriteUrl(name) {
  if (!name) return null
  if (FORM_SPRITE_URLS.hasOwnProperty(name)) return FORM_SPRITE_URLS[name]
  if (MEGA_SPRITE_URLS.hasOwnProperty(name)) return MEGA_SPRITE_URLS[name]
  const id = NAME_TO_ID[name]
  if (!id) return null
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export function getMegaForm(baseName) {
  const megaMap = {
    'Venusaur': 'Mega Venusaur', 'Charizard': 'Mega Charizard X',
    'Blastoise': 'Mega Blastoise', 'Beedrill': 'Mega Beedrill',
    'Pidgeot': 'Mega Pidgeot', 'Alakazam': 'Mega Alakazam',
    'Slowbro': 'Mega Slowbro', 'Gengar': 'Mega Gengar',
    'Kangaskhan': 'Mega Kangaskhan', 'Pinsir': 'Mega Pinsir',
    'Gyarados': 'Mega Gyarados', 'Aerodactyl': 'Mega Aerodactyl',
    'Meganium': 'Mega Meganium', 'Feraligatr': 'Mega Feraligatr',
    'Ampharos': 'Mega Ampharos', 'Steelix': 'Mega Steelix',
    'Scizor': 'Mega Scizor', 'Heracross': 'Mega Heracross',
    'Skarmory': 'Mega Skarmory', 'Houndoom': 'Mega Houndoom',
    'Tyranitar': 'Mega Tyranitar', 'Gardevoir': 'Mega Gardevoir',
    'Sableye': 'Mega Sableye', 'Aggron': 'Mega Aggron',
    'Medicham': 'Mega Medicham', 'Manectric': 'Mega Manectric',
    'Sharpedo': 'Mega Sharpedo', 'Camerupt': 'Mega Camerupt',
    'Altaria': 'Mega Altaria', 'Banette': 'Mega Banette',
    'Chimecho': 'Mega Chimecho', 'Absol': 'Mega Absol',
    'Glalie': 'Mega Glalie', 'Garchomp': 'Mega Garchomp',
    'Lucario': 'Mega Lucario', 'Abomasnow': 'Mega Abomasnow',
    'Gallade': 'Mega Gallade', 'Froslass': 'Mega Froslass',
    'Lopunny': 'Mega Lopunny', 'Audino': 'Mega Audino',
    'Excadrill': 'Mega Excadrill', 'Golurk': 'Mega Golurk',
    'Chandelure': 'Mega Chandelure', 'Emboar': 'Mega Emboar',
    'Dragonite': 'Mega Dragonite', 'Chesnaught': 'Mega Chesnaught',
    'Delphox': 'Mega Delphox', 'Greninja': 'Mega Greninja',
    'Victreebel': 'Mega Victreebel', 'Clefable': 'Mega Clefable',
    'Starmie': 'Mega Starmie', 'Hawlucha': 'Mega Hawlucha',
    'Drampa': 'Mega Drampa', 'Meowstic': 'Mega Meowstic',
    'Floette': 'Mega Floette', 'Crabominable': 'Mega Crabominable',
    'Scovillain': 'Mega Scovillain', 'Glimmora': 'Mega Glimmora',
    'Conkeldurr': 'Mega Conkeldurr',
  }
  return megaMap[baseName] ?? null
}

export function getBaseName(megaName) {
  if (!megaName?.startsWith('Mega ')) return megaName
  const stripped = megaName.replace(/^Mega /, '')
  if (stripped === 'Charizard X' || stripped === 'Charizard Y') return 'Charizard'
  return stripped
}
