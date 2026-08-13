# TruthQuest 🔍
### UNESCO Youth Hackathon 2026 — *Play Your Part: Youth Designing the Future of Media and Information Literacy*

A browser-based **Media and Information Literacy RPG** where you play as the last honest journalist in Veridis City, fighting a disinformation campaign through real investigative tools.

---

## 🚀 Deploy in 60 Seconds

### Netlify (recommended)
1. Drag the `truthquest/` folder into [netlify.com/drop](https://app.netlify.com/drop)
2. Done. The `_redirects` file handles routing automatically.

### Vercel
```bash
npx vercel --prod
```
The `vercel.json` config handles headers and redirects.

### GitHub Pages
1. Push the `truthquest/` folder contents to a `gh-pages` branch
2. Enable GitHub Pages in repo Settings → Pages → Branch: `gh-pages` / root

### Any static host (Surge, Render, S3, etc.)
Just upload the folder. It's 100% static HTML/CSS/JS — no build step required.

---

## 📁 Project Structure

```
truthquest/
├── index.html          Landing page + Fact Checker tool
├── game.html           Main game
├── leaderboard.html    Global rankings
├── 404.html            Error page
├── manifest.json       PWA manifest
├── sw.js               Service worker (offline support)
├── robots.txt          SEO crawl instructions
├── sitemap.xml         SEO sitemap
├── _redirects          Netlify routing
├── vercel.json         Vercel config + security headers
├── css/
│   ├── main.css        Landing page styles
│   └── game.css        Game styles
├── js/
│   ├── story-data.js   Inline story fallback (works offline)
│   ├── engine.js       Narrative game engine
│   ├── city.js         Veridis city canvas renderer
│   ├── verifier.js     Minigame controller
│   └── ui.js           Toast / trust bar / badges
├── data/
│   └── story.json      Full story data (3 chapters, 20+ scenes)
└── assets/
    └── README.md       Instructions for adding videos & icons
```

---

## 🎬 Adding Your Videos

Drop files into `assets/` and update `src=""` in `index.html`:

| File | Player |
|------|--------|
| `assets/trailer.mp4` | Main trailer |
| `assets/clip-fakenews.mp4` | Ad card 1 |
| `assets/clip-deepfake.mp4` | Ad card 2 |
| `assets/clip-mil.mp4` | Ad card 3 |

---

## 🖼️ Adding PWA Icons

Create two PNG icons and place them in `assets/`:
- `assets/icon-192.png` — 192×192px
- `assets/icon-512.png` — 512×512px

Use a 🔍 magnifying glass on a `#0a0e27` navy background.

---

## ⚙️ Features

| Feature | Details |
|---------|---------|
| 🎮 Game | 3 chapters, 20+ scenes, branching narrative |
| 🔬 Fact Checker | Paste any URL/headline — instant credibility analysis |
| 🏆 Leaderboard | Local scores + 15 seeded global demo entries |
| 🌙 Dark/Light mode | Full theme system, persists across sessions |
| 📱 PWA | Installable, works offline |
| ♿ Accessibility | ARIA labels, keyboard navigation, screen reader support |
| 🔊 Sound effects | Web Audio API — no audio files needed |
| 🌐 Multi-language ready | Story data in JSON — swap `data/story.json` for translations |

---

## 🌍 About

Built for the **UNESCO Youth Hackathon 2026** under the theme:  
*"Play Your Part: Youth Designing the Future of Media and Information Literacy"*

All characters, events, and institutions in the game are fictional.

© 2026 TruthQuest Team
