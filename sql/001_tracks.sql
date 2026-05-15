-- Noisy — initial schema
-- Run in Supabase SQL editor on a fresh project.

create extension if not exists "pgcrypto";

-- Categories: sleep, focus, mask, asmr, etc.
create table if not exists categories (
  slug text primary key,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category_slug text not null references categories(slug),
  duration_seconds int not null,
  duration_label text not null,           -- "8 HRS", "1 HR" — for display
  descriptor text not null,               -- the editorial one-liner
  audio_url text,                         -- R2 public URL
  audio_url_opus text,                    -- R2 public URL for opus variant
  youtube_id text,                        -- optional YT mirror
  cover_url text,                         -- OG image (optional)
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tracks_published_idx
  on tracks (published, published_at desc);

create index if not exists tracks_category_idx
  on tracks (category_slug, published);

-- RLS — anon can read published rows only. Service-role bypasses RLS for writes.
alter table categories enable row level security;
alter table tracks enable row level security;

create policy "categories readable by anon"
  on categories for select
  to anon
  using (true);

create policy "published tracks readable by anon"
  on tracks for select
  to anon
  using (published = true);

-- Seed
insert into categories (slug, name, sort_order) values
  ('sleep',  'Sleep',  10),
  ('focus',  'Focus',  20),
  ('mask',   'Mask',   30),
  ('asmr',   'ASMR',   40)
on conflict (slug) do nothing;
