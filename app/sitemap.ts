import type { MetadataRoute } from "next";
import { CATEGORIES, getTracks } from "@/lib/tracks";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://noisy.fm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tracks = await getTracks();
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now },
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/c/${c.slug}`,
      lastModified: now,
    })),
    ...tracks.map((t) => ({
      url: `${BASE}/${t.slug}`,
      lastModified: now,
    })),
  ];
}
