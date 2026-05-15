#!/usr/bin/env bash
# upload-to-r2.sh — push a rendered track to Cloudflare R2.
#
# Prereqs: rclone configured with an R2 remote called "r2".
# See docs/INFRA.md for setup.
#
# Usage:
#   ./scripts/upload-to-r2.sh <slug>
#
# Example:
#   ./scripts/upload-to-r2.sh motorway-traffic-8hr

set -euo pipefail

SLUG="${1:?slug required}"
BUCKET="${R2_BUCKET:-noisy-audio}"

if ! command -v rclone >/dev/null 2>&1; then
  echo "rclone not installed. Install with: brew install rclone" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MP3="$ROOT/public/audio/${SLUG}.mp3"
OPUS="$ROOT/public/audio/${SLUG}.opus"

[ -f "$MP3" ]  || { echo "missing $MP3"  >&2; exit 1; }
[ -f "$OPUS" ] || { echo "missing $OPUS" >&2; exit 1; }

echo "→ uploading ${SLUG}.mp3 ($(du -h "$MP3"  | cut -f1))"
rclone copy "$MP3"  "r2:${BUCKET}/" --progress

echo "→ uploading ${SLUG}.opus ($(du -h "$OPUS" | cut -f1))"
rclone copy "$OPUS" "r2:${BUCKET}/" --progress

echo "✓ uploaded"
echo
echo "Public URLs (assuming custom domain set per docs/INFRA.md):"
echo "  https://audio.noisy.<TLD>/${SLUG}.mp3"
echo "  https://audio.noisy.<TLD>/${SLUG}.opus"
