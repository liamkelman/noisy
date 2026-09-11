import "server-only";

export type Category = "sleep" | "focus" | "mask" | "asmr";

export type Track = {
  slug: string;
  title: string;
  category: Category;
  durationLabel: string;
  durationSeconds: number;
  descriptor: string;
  audioUrl: string | null;
  youtubeId: string | null;
  published: boolean;
};

export const CATEGORIES: { slug: Category; name: string; tagline: string }[] = [
  {
    slug: "sleep",
    name: "Sleep",
    tagline: "Long, steady, low-frequency. For babies, light sleepers, and 3am.",
  },
  {
    slug: "focus",
    name: "Focus",
    tagline: "Predictable hum. The room around you, minus the interruptions.",
  },
  {
    slug: "mask",
    name: "Mask",
    tagline: "Broad-spectrum noise that hides spikes — tinnitus, neighbours, traffic.",
  },
  {
    slug: "asmr",
    name: "ASMR",
    tagline: "Close, quiet, deliberate. Soft textures at low volume.",
  },
];

const STATIC_TRACKS: Track[] = [
  {
    slug: "motorway-traffic-8hr",
    title: "Motorway Traffic",
    category: "sleep",
    durationLabel: "8 HRS",
    durationSeconds: 8 * 60 * 60,
    descriptor:
      "Distant lorries, the steady wash of tyres on wet tarmac, a slow lane that never stops. Engineered to mask the spikes that wake a sleeping baby.",
    audioUrl: "/audio/motorway-traffic-8hr.mp3",
    youtubeId: null,
    published: true,
  },
];

type Row = {
  slug: string;
  title: string;
  category_slug: Category;
  duration_label: string;
  duration_seconds: number;
  descriptor: string;
  audio_url: string | null;
  youtube_id: string | null;
  published: boolean;
};

function rowToTrack(r: Row): Track {
  return {
    slug: r.slug,
    title: r.title,
    category: r.category_slug,
    durationLabel: r.duration_label,
    durationSeconds: r.duration_seconds,
    descriptor: r.descriptor,
    audioUrl: r.audio_url,
    youtubeId: r.youtube_id,
    published: r.published,
  };
}

async function fetchFromDb(): Promise<Track[] | null> {
  try {
    const { sql, dbConfigured } = await import("./db");
    if (!dbConfigured || !sql) return null;
    const rows = (await sql`
      select slug, title, category_slug, duration_label, duration_seconds,
             descriptor, audio_url, youtube_id, published
      from tracks
      where published = true
      order by published_at desc nulls last
    `) as unknown as Row[];
    return rows.map(rowToTrack);
  } catch (e) {
    console.warn("[tracks] neon fetch failed, falling back to static:", e);
    return null;
  }
}

export async function getTracks(): Promise<Track[]> {
  const fromDb = await fetchFromDb();
  return fromDb ?? STATIC_TRACKS;
}

export async function getTrack(slug: string): Promise<Track | undefined> {
  const all = await getTracks();
  return all.find((t) => t.slug === slug);
}

export async function getTracksByCategory(category: Category): Promise<Track[]> {
  const all = await getTracks();
  return all.filter((t) => t.category === category);
}
