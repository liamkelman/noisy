#!/usr/bin/env node
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

await sql`
  insert into tracks (slug, title, category_slug, duration_seconds, duration_label, descriptor, audio_url, published, published_at)
  values (
    'motorway-traffic-8hr',
    'Motorway Traffic',
    'sleep',
    ${8 * 60 * 60},
    '8 HRS',
    'Distant lorries, the steady wash of tyres on wet tarmac, a slow lane that never stops. Engineered to mask the spikes that wake a sleeping baby.',
    '/audio/motorway-traffic-8hr.mp3',
    true,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    category_slug = excluded.category_slug,
    duration_seconds = excluded.duration_seconds,
    duration_label = excluded.duration_label,
    descriptor = excluded.descriptor,
    audio_url = excluded.audio_url,
    published = excluded.published,
    updated_at = now()
`;

const rows = await sql`select slug, title, published from tracks order by created_at`;
console.log("seeded:", rows);
