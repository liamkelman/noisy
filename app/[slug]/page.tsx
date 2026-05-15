import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrack, tracks } from "@/lib/tracks";
import Player from "./player";

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs uppercase text-muted hover:text-fg"
      >
        ← Back
      </Link>

      <div className="mt-10 flex justify-between items-baseline font-mono text-xs uppercase text-muted">
        <span>/ {track.category}</span>
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
          audioUrl={track.audioUrl}
          durationSeconds={track.durationSeconds}
        />
      </div>
    </div>
  );
}
