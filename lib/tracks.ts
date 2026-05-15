export type Track = {
  slug: string;
  title: string;
  category: "sleep" | "focus" | "mask" | "asmr";
  durationLabel: string;
  durationSeconds: number;
  descriptor: string;
  audioUrl: string | null;
  youtubeId: string | null;
  published: boolean;
};

export const tracks: Track[] = [
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

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}
