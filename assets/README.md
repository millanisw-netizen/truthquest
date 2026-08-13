# TruthQuest — Assets Folder

Place your media files here. The game will automatically use them.

## Video Files

| File | Used in | Notes |
|------|---------|-------|
| `trailer.mp4` | Landing page main trailer | 16:9, recommended 720p–1080p |
| `clip-fakenews.mp4` | Ad card 1 "How to Spot Fake News" | Short clip, 60–90 seconds |
| `clip-deepfake.mp4` | Ad card 2 "Deepfakes Explained" | Short clip, 90–150 seconds |
| `clip-mil.mp4` | Ad card 3 "Why MIL Matters" | Short clip, 2–4 minutes |

To activate each video, update the `src=""` attribute in `index.html`:

```html
<!-- Main trailer -->
<video id="trailer-video" src="assets/trailer.mp4" ...>

<!-- Ad cards -->
<video class="ad-video-clip" src="assets/clip-fakenews.mp4" ...>
<video class="ad-video-clip" src="assets/clip-deepfake.mp4" ...>
<video class="ad-video-clip" src="assets/clip-mil.mp4" ...>
```

## Icons (for PWA install)

| File | Size |
|------|------|
| `icon-192.png` | 192×192 px |
| `icon-512.png` | 512×512 px |

Use any image editor to create a simple 🔍 or TQ logo on a `#0a0e27` background.

## Audio (optional)

| File | Used in |
|------|---------|
| `ambient.mp3` | Background game music (soft, looping) |
| `badge.mp3` | Badge earned sound effect |
| `click.mp3` | Button click sound |

> All files are optional. The game works fully without them.
