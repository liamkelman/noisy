# Noisy — infra setup

Four accounts. Roughly 30–45 min total. Do them in this order.

---

## 1. GitHub repo (5 min)

1. Go to https://github.com/new
2. Name: `noisy` (private)
3. **Do not** initialise with README / .gitignore / licence — we already have them
4. Copy the SSH or HTTPS URL it gives you (e.g. `git@github.com:<you>/noisy.git`)
5. Paste it back to me — I'll wire up the remote and push the first commit

---

## 2. Cloudflare R2 — for audio files (15 min)

R2 has free egress, which matters because each 8hr listen = ~440 MB.

1. Sign up / log in at https://dash.cloudflare.com
2. Left sidebar → **R2 Object Storage** → enable (requires adding a payment method, but free tier covers ~10M requests + 10 GB storage/mo)
3. Create a bucket called `noisy-audio` (default settings, automatic region)
4. **Bucket → Settings → Public access → Connect Custom Domain**
   - If you don't have a domain yet, use the auto-generated `.r2.dev` URL for now (rate-limited, fine for dev)
   - When you do have a domain (e.g. `noisy.fm`), point `audio.noisy.fm` at the bucket
5. **R2 → Manage API Tokens → Create API Token**
   - Permission: **Object Read & Write**
   - Specify bucket: `noisy-audio`
   - TTL: forever
6. Copy the **Access Key ID** and **Secret Access Key** — paste them back to me along with your **Account ID** (top-right of R2 dashboard)

I'll use those to configure `rclone` and upload the motorway track.

---

## 3. Supabase — for track metadata (10 min)

1. Sign up / log in at https://supabase.com
2. **New project**
   - Name: `noisy`
   - Database password: generate strong, save to your password manager
   - Region: closest to you (London / Frankfurt for UK)
   - Plan: Free
3. Wait ~2 min for provisioning
4. **SQL Editor → New query** → paste contents of `sql/001_tracks.sql` → Run
5. **Project Settings → API** — copy:
   - **Project URL** (`https://xxx.supabase.co`)
   - **anon public key**
   - **service_role key** (secret — never commit, never expose to browser)
6. Paste all three back to me

---

## 4. Vercel — for hosting the site (5 min, do this LAST)

1. Sign up / log in at https://vercel.com using your GitHub account
2. **Add New → Project** → import the `noisy` repo
3. Don't deploy yet — first add env vars:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key
   - `NEXT_PUBLIC_SUPABASE_URL` = same as SUPABASE_URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
4. Hit Deploy

---

## What I'll do with the keys you paste back

| You give me | I do |
|---|---|
| GitHub repo URL | Wire up the remote, push initial commit |
| R2 Account ID + keys | Configure rclone, upload mp3 + opus, give you the public URL |
| Supabase URL + keys | Add to `.env.local`, migrate hardcoded `tracks.ts` → DB-backed reads |

Once those three are done, swap `audioUrl` in the DB row to the R2 URL and the site is production-ready (just needs domain + Vercel deploy).

## Cost expectation (first 12 months)

| Service | Free tier | When you'd hit limits |
|---|---|---|
| Vercel Hobby | 100 GB bandwidth | We never hit this because audio is on R2, not Vercel |
| Cloudflare R2 | 10 GB storage, free egress, 1M Class A ops/mo | ~25 tracks at 8hr each = 11 GB; minor overage cost |
| Supabase Free | 500 MB DB, 50k MAUs, 5 GB egress | Metadata-only DB will never fill this |
| GitHub | private repos free | n/a |
| **Total** | **£0** | Probably £0–£5/mo for the first year unless we go viral |
