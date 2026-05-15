import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noisy — Useful noise. No noise.",
  description:
    "Ad-free useful noise. Sleep, focus, mask. Long-form audio for parents, workers, and anyone who needs the world a bit quieter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <header className="border-b border-line">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-baseline justify-between">
            <Link href="/" className="font-mono text-lg tracking-tight uppercase">
              Noisy
            </Link>
            <span className="font-mono text-xs uppercase text-muted">
              Useful noise. No noise.
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-24">
          <div className="max-w-5xl mx-auto px-6 py-6 font-mono text-xs uppercase text-muted flex justify-between">
            <span>© Noisy</span>
            <span>No ads. No tracking. No noise.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
