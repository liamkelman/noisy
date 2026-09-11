-- Noisy — initial schema (Neon Postgres)
-- Run via `psql $DATABASE_URL -f sql/001_tracks.sql` or the Neon SQL editor.

create extension if not exists "pgcrypto";

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
  duration_label text not null,
  descriptor text not null,
  audio_url text,
  audio_url_opus text,
  youtube_id text,
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tracks_published_idx
  on tracks (published, published_at desc);

create index if not exists tracks_category_idx
  on tracks (category_slug, published);

insert into categories (slug, name, sort_order) values
  ('sleep',  'Sleep',  10),
  ('focus',  'Focus',  20),
  ('mask',   'Mask',   30),
  ('asmr',   'ASMR',   40)
on conflict (slug) do nothing;
