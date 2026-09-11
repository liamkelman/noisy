# Pick up where we left off

Paste this whole file into Claude next session.

---

## Where Noisy is right now

- **Stack**: Next.js 16 (App Router, Turbopack) + Neon serverless Postgres + Vercel (not deployed yet).
- **DB**: Neon project `jolly-band-76255658`. Schema in [sql/001_tracks.sql](sql/001_tracks.sql) is applied. Connection string in `.env.local` (gitignored).
- **Library**: 14 tracks seeded across 4 categories (sleep, focus, mask, asmr). Only **Motorway Traffic** has real audio at `/public/audio/motorway-traffic-8hr.mp3`. The other 13 are DB rows with `audio_url = null` rendering as "coming soon" placeholders.
- **Player**: resume-position via localStorage, 30s fade-out on sleep timer, Media Session API for lockscreen controls.
- **SEO**: sitemap.ts, robots.ts, JSON-LD `AudioObject` on each track page.
- **Dev server**: `npm run dev` (was running on http://localhost:3001 because 3000 was busy).
- **Deferred**: Cloudflare R2 (staying on `/public` until >5 real tracks or >50 GB/mo egress). Vercel deploy. Custom favicon/logo.
- **Roadmap**: full plan in [docs/ROADMAP.md](docs/ROADMAP.md).

## What we last talked about

We finished seeding the library and were choosing what to do next: (a) produce more real audio, (b) design a brand mark, or (c) deploy to Vercel so it's on a real URL.

## Kickoff question for next session

> **Let's deploy Noisy to Vercel so it's on a real URL. The Neon `DATABASE_URL` is in `.env.local` — what do you need from me to get the production env wired up, and is there anything I should do in the Vercel dashboard before you start?**

(Swap that question for option (a) or (b) if you've changed your mind by then.)
