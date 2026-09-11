#!/usr/bin/env node
// Seed the full launch library. Tracks without an audio_url render as
// "coming soon" via the player's existing null-handling branch — no fake audio.
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const sql = neon(process.env.DATABASE_URL);

const HRS = (h) => ({ seconds: h * 3600, label: `${h} HRS` });
const MIN = (m) => ({ seconds: m * 60, label: `${m} MIN` });

const tracks = [
  // ──────────────── SLEEP ────────────────
  {
    slug: "motorway-traffic-8hr",
    title: "Motorway Traffic",
    category: "sleep",
    duration: HRS(8),
    descriptor:
      "Distant lorries, the steady wash of tyres on wet tarmac, a slow lane that never stops. Engineered to mask the spikes that wake a sleeping baby.",
    audio_url: "/audio/motorway-traffic-8hr.mp3",
  },
  {
    slug: "womb-heartbeat-8hr",
    title: "Womb Heartbeat",
    category: "sleep",
    duration: HRS(8),
    descriptor:
      "The muffled rhythm a newborn already knows. Slow, low, and exactly the tempo babies fall asleep to.",
    audio_url: null,
  },
  {
    slug: "hairdryer-loop-8hr",
    title: "Hairdryer",
    category: "sleep",
    duration: HRS(8),
    descriptor:
      "The classic parenting trick, looped seamlessly so you never have to stand by the cot at 3am again.",
    audio_url: null,
  },
  {
    slug: "rain-on-tin-8hr",
    title: "Rain on a Tin Roof",
    category: "sleep",
    duration: HRS(8),
    descriptor:
      "Steady, soft, broad-spectrum rainfall on corrugated steel. Smooths out hard edges in the room.",
    audio_url: null,
  },

  // ──────────────── FOCUS ────────────────
  {
    slug: "cafe-hum-2hr",
    title: "Café Hum",
    category: "focus",
    duration: HRS(2),
    descriptor:
      "The low murmur of a busy café — unintelligible voices, distant espresso machine, no music. The proven productivity ambient.",
    audio_url: null,
  },
  {
    slug: "library-room-2hr",
    title: "Reading Room",
    category: "focus",
    duration: HRS(2),
    descriptor:
      "A reference library in the late afternoon. Page turns, faint HVAC, a chair creaking three desks away.",
    audio_url: null,
  },
  {
    slug: "train-cabin-2hr",
    title: "Train Cabin",
    category: "focus",
    duration: HRS(2),
    descriptor:
      "Inter-city service at cruising speed. Steady mechanical rhythm — the reason so much writing gets done on trains.",
    audio_url: null,
  },

  // ──────────────── MASK ────────────────
  {
    slug: "brown-noise-8hr",
    title: "Brown Noise",
    category: "mask",
    duration: HRS(8),
    descriptor:
      "Deep, low-frequency-weighted noise. The one your TikTok feed has been telling you about — actually useful for masking traffic, neighbours, and intrusive thoughts.",
    audio_url: null,
  },
  {
    slug: "pink-noise-8hr",
    title: "Pink Noise",
    category: "mask",
    duration: HRS(8),
    descriptor:
      "Equal energy per octave. Softer than white, less heavy than brown. Recommended by audiologists for tinnitus masking.",
    audio_url: null,
  },
  {
    slug: "notched-white-8hr",
    title: "Notched White Noise",
    category: "mask",
    duration: HRS(8),
    descriptor:
      "Broadband noise with a narrow band removed at your tinnitus frequency. For long sessions; not a substitute for an audiologist.",
    audio_url: null,
  },
  {
    slug: "oscillating-fan-8hr",
    title: "Oscillating Fan",
    category: "mask",
    duration: HRS(8),
    descriptor:
      "A cheap plastic fan slowly turning in the corner. The sleep aid an entire generation grew up on.",
    audio_url: null,
  },

  // ──────────────── ASMR ────────────────
  {
    slug: "page-turning-1hr",
    title: "Page Turning",
    category: "asmr",
    duration: HRS(1),
    descriptor:
      "Thin paper. A second-hand paperback. Occasional pause, occasional double-page. No talking.",
    audio_url: null,
  },
  {
    slug: "soft-tapping-1hr",
    title: "Soft Tapping",
    category: "asmr",
    duration: HRS(1),
    descriptor:
      "Fingernails on wood, glass, cardboard. Slow, deliberate, low volume. Best with headphones at 30%.",
    audio_url: null,
  },
  {
    slug: "brushing-1hr",
    title: "Brushing",
    category: "asmr",
    duration: HRS(1),
    descriptor:
      "Soft-bristle brushes across microphone foam and fabric. Long, even strokes. The classic.",
    audio_url: null,
  },
];

for (const t of tracks) {
  await sql`
    insert into tracks (slug, title, category_slug, duration_seconds, duration_label, descriptor, audio_url, published, published_at)
    values (${t.slug}, ${t.title}, ${t.category}, ${t.duration.seconds}, ${t.duration.label}, ${t.descriptor}, ${t.audio_url}, true, now())
    on conflict (slug) do update set
      title = excluded.title,
      category_slug = excluded.category_slug,
      duration_seconds = excluded.duration_seconds,
      duration_label = excluded.duration_label,
      descriptor = excluded.descriptor,
      audio_url = coalesce(excluded.audio_url, tracks.audio_url),
      published = excluded.published,
      updated_at = now()
  `;
}

const rows = await sql`
  select category_slug, count(*) as n,
         sum(case when audio_url is not null then 1 else 0 end) as live
  from tracks where published = true
  group by category_slug order by category_slug
`;
console.log("library state:");
for (const r of rows) console.log(`  ${r.category_slug.padEnd(7)} ${r.live}/${r.n} live`);
