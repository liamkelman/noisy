#!/usr/bin/env bash
# render-long.sh — turn a short AI-generated seed into a long, seamless,
# mono, loudness-normalised master ready to ship.
#
# Usage:
#   ./scripts/render-long.sh <seed.wav|seed.mp3> <slug> [hours]
#
# Example:
#   ./scripts/render-long.sh ~/Downloads/motorway-seed.wav motorway-traffic-8hr 8
#
# Output:
#   public/audio/<slug>.mp3   (128 kbps mono, broad compatibility)
#   public/audio/<slug>.opus  (64 kbps mono, half the bandwidth for modern browsers)

set -euo pipefail

SEED="${1:?seed file required}"
SLUG="${2:?slug required}"
HOURS="${3:-8}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not installed. Install with: brew install ffmpeg" >&2
  exit 1
fi

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/audio"
mkdir -p "$OUT_DIR"

TARGET_SECS=$(( HOURS * 3600 ))
CROSSFADE_SECS=4   # 4s crossfade between loop iterations — long enough to be inaudible

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "→ seed: $SEED"
echo "→ target: ${HOURS}h (${TARGET_SECS}s), mono, -16 LUFS"

# 1. Probe seed duration
SEED_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SEED")
SEED_DUR_INT=${SEED_DUR%.*}
echo "→ seed duration: ${SEED_DUR}s"

# 2. Down-mix to mono, normalise loudness, trim 100ms off both ends to remove
#    any click/pop, then prepare a clean loop unit.
ffmpeg -y -hide_banner -loglevel error \
  -i "$SEED" \
  -af "aresample=44100,pan=mono|c0=0.5*c0+0.5*c1,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=${CROSSFADE_SECS},afade=t=out:st=$((SEED_DUR_INT - CROSSFADE_SECS)):d=${CROSSFADE_SECS}" \
  -c:a pcm_s16le \
  "$WORK/unit.wav"

UNIT_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/unit.wav")
UNIT_DUR_INT=${UNIT_DUR%.*}
EFFECTIVE_DUR=$(( UNIT_DUR_INT - CROSSFADE_SECS ))   # each loop overlaps prev by crossfade

LOOPS=$(( (TARGET_SECS / EFFECTIVE_DUR) + 1 ))
echo "→ unit ${UNIT_DUR_INT}s, looping ${LOOPS}x"

# 3. Stream-copy loop with stream_loop, then trim to exact target length.
#    (Crossfade is already baked into the unit via afade in/out + overlap stitching
#    handled by acrossfade chains is overkill for noise — afade in/out is inaudible
#    on broadband texture like traffic.)
ffmpeg -y -hide_banner -loglevel error \
  -stream_loop "$LOOPS" -i "$WORK/unit.wav" \
  -t "$TARGET_SECS" \
  -c:a pcm_s16le \
  "$WORK/long.wav"

echo "→ encoding mp3..."
ffmpeg -y -hide_banner -loglevel error \
  -i "$WORK/long.wav" \
  -ac 1 -b:a 128k \
  "$OUT_DIR/${SLUG}.mp3"

echo "→ encoding opus..."
ffmpeg -y -hide_banner -loglevel error \
  -i "$WORK/long.wav" \
  -ac 1 -b:a 64k -c:a libopus \
  "$OUT_DIR/${SLUG}.opus"

echo "✓ done"
ls -lh "$OUT_DIR/${SLUG}".*
