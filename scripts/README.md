# Noisy — audio pipeline

## One-time setup

```bash
# Install Homebrew (Apple Silicon path; adjust if Intel)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install ffmpeg
brew install ffmpeg
```

## Per-track workflow

### 1. Generate seed in Stable Audio (web UI)

Go to https://stableaudio.com → New generation.

**Prompt template for traffic-style ambience:**

> Distant motorway traffic at night, wet tarmac, occasional heavy lorry passing,
> consistent low-frequency rumble, no music, no voices, no horns, no sirens,
> seamless loop, deep masking noise for sleep

Settings:
- **Duration:** the longest the UI allows (currently ~3 min)
- **Steps:** max quality
- **Format:** WAV download (not MP3 — we re-encode ourselves)

Generate 5–10 variations. Keep the one with: (a) no obvious repetition, (b) no
sudden spikes, (c) consistent texture from start to end.

### 2. Drop the file somewhere predictable

```bash
mkdir -p ~/Documents/ai-music/noisy/audio-seeds
mv ~/Downloads/<the-file>.wav ~/Documents/ai-music/noisy/audio-seeds/motorway-seed.wav
```

### 3. Render the 8hr master

```bash
cd ~/Documents/ai-music/noisy
./scripts/render-long.sh audio-seeds/motorway-seed.wav motorway-traffic-8hr 8
```

This produces:
- `public/audio/motorway-traffic-8hr.mp3` (~440 MB, 128 kbps mono)
- `public/audio/motorway-traffic-8hr.opus` (~220 MB, 64 kbps mono)

### 4. Wire it into the track list

Edit `lib/tracks.ts` and set `audioUrl: "/audio/motorway-traffic-8hr.mp3"`.

## Why these choices

- **Mono** — halves file size, identical experience on phone speakers / crib monitors, safer on lockscreen mixers.
- **-16 LUFS** — quiet target. Streaming standard is -14 LUFS for music; we go lower because nobody wants the noise to *be* loud, they want it consistent.
- **128 kbps mp3 / 64 kbps opus** — noise compresses brilliantly; you cannot hear the difference from 320 kbps on broadband texture.
- **4s afade in/out per unit** — on broadband traffic noise, fade-in/out is inaudible. We don't need true acrossfade stitching like we would for tonal content.

## Hosting note

8hr MP3 ≈ 440 MB. Serving this from Vercel's static `public/` folder will eat
bandwidth fast (Vercel free tier = 100 GB/month → ~227 listens). Once we have
real traffic, move audio to **Cloudflare R2** (free egress) or **Supabase
Storage** (cheaper than Vercel). Keep the URL behind `audioUrl` so the swap is
one column change.
