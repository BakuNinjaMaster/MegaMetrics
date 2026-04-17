# MetaMetric

A real-time battle companion app for **Pokémon Champions** (Nintendo Switch), built for competitive players who want live damage calculations, speed tiers, and field condition tracking during matches.

![MetaMetric Screenshot](docs/screenshot.png)

---

## What It Does

MetaMetric reads your battle screen through a capture card and displays live information in a side panel alongside your feed:

- **Damage Calcs** — See how much damage your moves deal against the enemy, shown as a percentage range (min bulk to max bulk)
- **Speed Tier** — Full team speed order including benched Pokémon, with min/max ranges for enemies
- **Field Conditions** — Auto-detected weather, terrain, Trick Room, Tailwind, Reflect, and Light Screen with turn counters
- **Stat Stage Tracker** — Track +/- stat changes for both sides with manual +/− buttons
- **Enemy Team Panel** — Enemy Pokémon with sprites, HP bar, and Mega Evolution toggle
- **Your Team Panel** — Your active Pokémon with sprites, types, ability, nature, item, and moves

---

## Requirements

- Windows 10 or 11
- A **capture card** connected to your Nintendo Switch (e.g. Elgato, AVerMedia)
- The capture card must be recognized as a video input device on your PC

---

## Installation

1. Go to the [Releases](../../releases) page
2. Download `MetaMetric Setup x.x.x.exe`
3. Run the installer

> **Windows SmartScreen Warning** — Since the app is not code signed, Windows may show a warning. Click **More info** then **Run anyway**. This is normal for indie apps.

---

## Setup

### 1. Connect Your Capture Card
- Launch MetaMetric
- Click **Connect** in the capture feed panel
- Select your capture card from the device list
- Your Switch feed should appear in the left panel

### 2. Build Your Team
- Click **Settings** in the top right
- Go to the **Team Builder** tab
- Add all 6 of your Pokémon with their nature, EVs, IVs, ability, item, and moves
- Click **Save Team**

This is required for accurate damage calculations and speed tiers.

### 3. Calibrate OCR
- Click **Settings** → **OCR Calibration** tab
- Draw regions over the parts of your battle screen that show Pokémon names and HP
- Click **Save Regions**

OCR calibration tells MetaMetric exactly where to look on your screen for battle information. Without it, auto-detection won't work.

### 4. Enable OCR
- Click the **OCR** button in the top bar to toggle it on (it will highlight blue)
- MetaMetric will now scan your capture feed every 2.5 seconds and update automatically

---

## Features

### Damage Calcs
Damage is calculated using [@smogon/calc](https://github.com/smogon/damage-calc) at Level 50 with no critical hits. The range shown is:
- **Low end** — enemy at max bulk (Bold nature, 252 HP/Def/SpD EVs)
- **High end** — enemy at min bulk (Lonely nature, 0 EVs)

Your Pokémon use exact stats from your saved team config.

### Speed Tier
- Your Pokémon use exact speed from your saved team
- Enemy Pokémon show a min/max range based on nature and EVs
- Benched Pokémon are shown dimmed
- Reverses automatically in Trick Room

### Mega Evolution
On the Enemy panel, click the **Mega** button next to an enemy Pokémon to toggle their Mega Evolved form. MetaMetric will lock that form in and won't revert it during OCR updates.

### Manual Override
If OCR misreads a Pokémon name, click the **Switch** button on any panel slot to manually search and correct it.

---

## Field Conditions Supported

| Condition | Auto-detected | Manual Toggle |
|-----------|--------------|---------------|
| Weather (Sun/Rain/Sand/Snow) | ✅ | ✅ |
| Terrain (Electric/Grassy/Misty/Psychic) | ✅ | ✅ |
| Trick Room | ✅ | ✅ |
| Tailwind (you/enemy) | ✅ | ✅ |
| Reflect (you/enemy) | ❌ | ✅ |
| Light Screen (you/enemy) | ❌ | ✅ |

Click **End Turn** in the top bar to decrement all turn counters by 1.

---

## Items Supported

MetaMetric includes the full Champions launch item pool:

- All 18 type-boosting items
- Utility items: Choice Scarf, Focus Sash, Focus Band, Shell Bell, Scope Lens, King's Rock, Mental Herb, Bright Powder, Quick Claw
- All status cure berries and damage-reducing berries
- All Mega Stones available at launch including Legends: Z-A exclusives

---

## Pokémon Supported

MetaMetric includes the full Champions roster at launch including all alternate forms:

- All regional variants (Alola, Galar, Hisui, Paldea)
- All Rotom forms (Heat, Wash, Frost, Fan, Mow)
- All Lycanroc forms (Midday, Midnight, Dusk)
- All Mega Evolutions available in Champions
- All other alternate forms (Aegislash-Blade, Meowstic-F, Basculegion-F, etc.)

---

## Building From Source

```bash
# Clone the repo
git clone https://github.com/BakuNinjaMaster/MetaMetric.git
cd MetaMetric

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build installer
npm run build
```

---

## Known Limitations

- OCR accuracy depends on your capture resolution and calibration. 1080p capture is recommended.
- Mega Evolution sprites for Champions-exclusive Megas (e.g. Mega Dragonite, Mega Greninja) are not available as they don't exist in PokeAPI.
- Items not yet in Champions (Life Orb, Choice Band, Assault Vest, etc.) are intentionally excluded.

---

## Disclaimer

MetaMetric is a fan-made tool and is not affiliated with, endorsed by, or connected to Nintendo, The Pokémon Company, or Game Freak. Pokémon and all related names are trademarks of their respective owners. This app is free and non-commercial.

---

## Credits

- Damage calculations powered by [@smogon/calc](https://github.com/smogon/damage-calc)
- Sprites provided by [PokeAPI](https://pokeapi.co/)
- OCR powered by [Tesseract.js](https://github.com/naptha/tesseract.js)
- Built with [Electron](https://www.electronjs.org/) + [React](https://react.dev/) + [Vite](https://vitejs.dev/)
