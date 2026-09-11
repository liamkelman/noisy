import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTrack, getTracks } from "@/lib/tracks";
import Player from "./player";

export const revalidate = 300;

export async function generateStaticParams() {
  const tracks = await getTracks();
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = await getTrack(slug);
  if (!track) return {};
  return {
    title: `${track.title} — ${track.durationLabel} — Noisy`,
    description: track.descriptor,
    openGraph: {
      title: `${track.title} — ${track.durationLabel}`,
      description: track.descriptor,
      type: "music.song",
    },
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = await getTrack(slug);
  if (!track) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    name: track.title,
    description: track.descriptor,
    duration: `PT${track.durationSeconds}S`,
    contentUrl: track.audioUrl ?? undefined,
    genre: track.category,
    isAccessibleForFree: true,
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="font-mono text-xs uppercase text-muted hover:text-fg"
      >
        ← Back
      </Link>

      <div className="mt-10 flex justify-between items-baseline font-mono text-xs uppercase text-muted">
        <Link href={`/c/${track.category}`} className="hover:text-fg">
          / {track.category}
        </Link>
        <span>{track.durationLabel}</span>
      </div>

      <h1 className="mt-4 text-5xl md:text-6xl font-mono uppercase tracking-tight leading-none">
        {track.title}
      </h1>

      <p className="mt-8 text-base leading-relaxed max-w-xl">
        {track.descriptor}
      </p>

      <div className="mt-12 border border-line p-6">
        <Player
          slug={track.slug}
          title={track.title}
          category={track.category}
          audioUrl={track.audioUrl}
          durationSeconds={track.durationSeconds}
        />
      </div>
    </div>
  );
}
