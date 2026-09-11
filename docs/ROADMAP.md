---
status: living document
last-updated: 2026-05-17
---

# Noisy — Roadmap

> Useful noise made easy. No ads.
> Ad-free long-form audio for sleep, focus, masking, ASMR, and beyond.

This is a living roadmap. Each phase is shippable on its own — don't block on later phases. Ordering reflects what unlocks the most use cases for the least build cost.

---

## North star

One library, many jobs-to-be-done. The same 8-hour audio file should serve a parent rocking a baby at 2am, a developer in deep work at 11am, a tinnitus sufferer at bedtime, a student in a noisy café, a dog left alone, and a meditator. The product is the **curation + the calm + the no-ads promise**, not the audio itself.

---

## Phase 0 — Foundations *(in progress)*

Where we are today: Next.js 14 app, Supabase schema in [sql/001_tracks.sql](noisy/sql/001_tracks.sql) (not yet wired — page reads from [lib/tracks.ts](noisy/lib/tracks.ts)), one seed track, square/black/mono visual language live on [app/page.tsx](noisy/app/page.tsx).

- [ ] Wire Supabase: replace static `tracks.ts` with server reads from `tracks` table
- [ ] ~~Move audio out of `/public` to object storage~~ — deferred. Staying on `/public` + Vercel until >5 tracks or >50 GB/mo egress, then migrate to R2.
- [ ] Domain + Vercel deploy + analytics that respect the no-tracking promise (Plausible / Vercel Analytics, no GA)
- [ ] Legal minimum: privacy page, contact, no cookie banner needed if no tracking
- [ ] `sitemap.xml`, `robots.txt`, OG images per track

**Exit criteria:** one track plays end-to-end on prod, indexable, no third-party scripts loaded.

---

## Phase 1 — Core player & content engine *(weeks 1–3)*

The product only works if the player is bulletproof. Get this right before adding categories.

- [ ] Custom HTML5 `<audio>` player — play/pause, seek, elapsed/remaining, volume
- [ ] **Sleep timer** (15/30/60/90 min, fade-out last 30s) — non-negotiable for the parent use case
- [ ] **Background playback** on mobile web (Media Session API: title, artwork, lockscreen controls)
- [ ] **Loop** flag so an 8hr file becomes effectively infinite
- [ ] **Resume position** in localStorage (don't lose place if tab refreshes at 3am)
- [ ] Pre-buffer + graceful network drop handling
- [ ] Opus + MP3 dual encoding, browser picks via `<source>`
- [ ] Admin: a tiny `/admin` (Supabase auth, single user) to add/publish tracks without SQL

**Exit criteria:** a parent can press play, lock their phone, set a 60-min timer, and trust it.

---

## Phase 2 — Widen the use cases *(weeks 3–6)*

Categories already modelled in schema (`sleep`, `focus`, `mask`, `asmr`). Fill them out, plus broaden.

Use cases to target — each one needs ≥3 tracks before launch-promoting it:

| Use case | Audience | Example tracks |
|---|---|---|
| **Baby sleep** | Parents | Motorway, womb, hairdryer, vacuum, rain-on-tin |
| **Adult sleep** | Insomniacs, light sleepers | Brown noise, distant thunder, oscillating fan |
| **Focus / deep work** | Devs, writers, students | Café hum, library, train cabin, server room |
| **Tinnitus masking** | Hearing-loss community | Pink noise, notched white noise, soft rain |
| **Meditation / wind-down** | Adults | Tibetan bowls, forest dusk, slow breathing pacer |
| **Study / revision** | Students | Lo-fi-free rain, classroom hum, library |
| **Pet anxiety** | Dog owners (fireworks/storms) | Calm rain, low rumble, heartbeat |
| **ASMR** | General | Page-turning, soft tapping, brushing |
| **Travel / commute** | Anyone | Aeroplane cabin, train, ferry |
| **Sensory regulation** | Neurodivergent users | Steady predictable loops, no jump-scares |

Build:

- [ ] Category landing pages (`/sleep`, `/focus`, …) with editorial copy that names the *job*, not the sound
- [ ] **"Why this works"** blurb on every track — credibility + SEO
- [ ] Cross-tagging: a track can serve multiple use cases (rain → sleep + focus + masking)
- [ ] Length variants: 30 min / 1 hr / 8 hr per source — different jobs need different lengths
- [ ] Search / filter by length, intensity, category

**Exit criteria:** a stranger lands on the homepage and within 10 seconds finds a track for *their* situation.

---

## Phase 3 — Discovery & trust *(weeks 5–8, parallel to Phase 2)*

The moat is *being findable when someone needs it* + *being trusted enough to leave on overnight*.

- [ ] AEO/SEO via `aeo-toolkit` — structured data (`AudioObject`, `FAQPage`), per-track schema
- [ ] One blog post per use case ("Best sound for a baby that wakes at every car door") — long-tail intent
- [ ] YouTube channel: upload 8hr versions with timestamps + link back. Discovery, no monetisation
- [ ] Reddit / forum presence in `/r/sleeptrain`, `/r/tinnitus`, `/r/getdisciplined` — link only when genuinely helpful
- [ ] Press the no-ads angle hard on the homepage and in OG images
- [ ] Track-level open-graph audio previews (15s) so links auto-play in messengers

---

## Phase 4 — Personalisation without accounts *(weeks 8–10)*

Stay logged-out-first. Everything in `localStorage` until a user *asks* to sync.

- [ ] Recently played
- [ ] Favourites
- [ ] **Mixer**: layer 2–3 tracks with independent volume (rain + café + brown noise)
- [ ] Saved mixes (localStorage; share via URL hash)
- [ ] Suggested-next based on current track's tags

---

## Phase 5 — Native mobile app *(months 3–5)*

Web is the funnel. App is the retention. Parents will not pull out a browser at 3am.

Stack call (to decide): **Expo / React Native** vs native SwiftUI+Kotlin. Expo wins on speed unless background-audio quirks bite.

- [ ] Background audio + lockscreen controls + CarPlay/Android Auto
- [ ] **Sleep timer + alarm-free wake** (fade out, don't jolt)
- [ ] Offline downloads (the killer feature — flaky hotel wifi, planes, baby's bedroom dead zone)
- [ ] Widget: one-tap "play last track"
- [ ] Apple Watch / Wear OS: play/pause + timer from wrist
- [ ] Shortcuts / Siri / Google Assistant: "Hey Siri, play motorway"
- [ ] App-store positioning: ad-free is the headline feature

---

## Phase 6 — Sustainable revenue *(month 6+)*

Only when the audience is real. Never compromise the no-ads promise.

Options, ranked by alignment:

1. **Optional Pro** (£2–3/mo or one-time): offline downloads, longer files (12hr), mixer slots, early access. Free tier remains fully ad-free.
2. **Pay-what-you-want / tip jar** — works for the calm-internet aesthetic
3. **B2B licensing** — clinics, dental practices, co-working spaces want ad-free background audio
4. **Hardware partnerships** — bundling deals with white-noise device makers

Explicitly **never**: ads, autoplay video, "watch this to unlock", aggressive email capture, dark patterns, selling data.

---

## Phase 7 — Community & UGC *(month 9+)*

- [ ] Submit-a-sound: users send field recordings, we master + publish with credit
- [ ] Editorial collections curated by guests (sleep consultants, focus coaches, audiologists)
- [ ] Accessibility audit pass — captions on YouTube, transcripts of what each sound *contains* (helpful for deaf parents choosing for their baby)

---

## Cross-cutting concerns

These never get a phase of their own but apply throughout:

- **Performance:** First Contentful Paint < 1s. The whole homepage should weigh less than one ad on a competitor's site.
- **Accessibility:** WCAG AA. Keyboard-first. Reduced-motion respected. High contrast is already free given the visual language.
- **Audio quality:** -16 LUFS integrated for sleep tracks, no clicks at loop points, dithered. Cheap audio = cheap brand.
- **Loop seams:** every long-form file must loop seamlessly — the audible click at 8:00:00 ruins the trust.
- **Content provenance:** decide and disclose. Field-recorded / CC0 / AI-generated — say which, per track.
- **Licensing:** if any track uses third-party audio, log the licence in the DB row.

---

## Open questions

- Audio source: field recordings (slow, authentic, defensible) vs CC0 (fast, generic) vs AI-seeded (cheap, ethically murky). Probably a mix; lead with field recordings for hero tracks.
- Storage cost at scale — 8hr Opus ≈ 200MB. Hundreds of tracks × thousands of streams = real bandwidth. R2 egress-free is the obvious answer.
- Do we ever do video (e.g. fireplace loop on a TV)? Probably yes, post-app, as YouTube-first.
- Naming: "Noisy" is great but check trademark exposure before spending on brand.

---

## Definition of done for v1 launch

- 20+ published tracks across ≥5 use cases
- Player passes the "3am test" on iOS Safari, Android Chrome, desktop
- One blog post per category live + indexed
- YouTube channel with mirror uploads
- Homepage Lighthouse 100/100/100/100
- Zero third-party tracking scripts in the network tab
