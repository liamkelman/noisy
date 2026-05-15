import Link from "next/link";
import { tracks } from "@/lib/tracks";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <section className="mb-20">
        <h1 className="text-5xl md:text-7xl font-mono uppercase tracking-tight leading-none">
          Useful noise.
          <br />
          No noise.
        </h1>
        <p className="mt-8 max-w-xl text-muted font-mono text-sm uppercase leading-relaxed">
          Long-form audio for sleeping babies, focused work, and masking the
          rest of the world. No ads. No mid-rolls. No login.
        </p>
      </section>

      <section>
        <div className="font-mono text-xs uppercase text-muted mb-4 border-b border-line pb-2">
          / Library
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
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
          <li className="bg-bg p-6 opacity-40">
            <div className="font-mono text-xs uppercase">Coming</div>
            <div className="mt-6 text-2xl font-mono uppercase tracking-tight">
              More noise
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Rain on tin. Café hum. Brown noise. Hairdryer.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
