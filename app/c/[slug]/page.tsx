import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getTracksByCategory, type Category } from "@/lib/tracks";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — Noisy`,
    description: cat.tagline,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const tracks = await getTracksByCategory(slug as Category);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs uppercase text-muted hover:text-fg"
      >
        ← Back
      </Link>

      <div className="mt-10 font-mono text-xs uppercase text-muted">
        / {cat.slug}
      </div>
      <h1 className="mt-4 text-5xl md:text-6xl font-mono uppercase tracking-tight leading-none">
        {cat.name}
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed">{cat.tagline}</p>

      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
        {tracks.length === 0 && (
          <li className="bg-bg p-6 opacity-50 col-span-full">
            <div className="font-mono text-xs uppercase">Nothing yet</div>
            <p className="mt-3 text-sm leading-relaxed">
              First tracks for this category land soon.
            </p>
          </li>
        )}
        {tracks.map((t) => (
          <li key={t.slug} className="bg-bg">
            <Link
              href={`/${t.slug}`}
              className="block p-6 hover:bg-fg hover:text-bg transition-colors"
            >
              <div className="flex justify-between items-baseline font-mono text-xs uppercase">
                <span>{t.category}</span>
                <span>{t.durationLabel}</span>
              </div>
              <div className="mt-6 text-2xl font-mono uppercase tracking-tight">
                {t.title}
              </div>
              <p className="mt-3 text-sm opacity-70 leading-relaxed">
                {t.descriptor}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
