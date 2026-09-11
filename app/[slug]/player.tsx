"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  slug: string;
  title: string;
  category: string;
  audioUrl: string | null;
  durationSeconds: number;
};

const TIMER_OPTIONS = [
  { label: "OFF", minutes: 0 },
  { label: "15M", minutes: 15 },
  { label: "30M", minutes: 30 },
  { label: "1H", minutes: 60 },
  { label: "2H", minutes: 120 },
];

const FADE_SECONDS = 30;

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

function resumeKey(slug: string) {
  return `noisy:resume:${slug}`;
}

export default function Player({
  slug,
  title,
  category,
  audioUrl,
  durationSeconds,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  // Restore last position
  useEffect(() => {
    if (!audioUrl) return;
    const saved = Number(localStorage.getItem(resumeKey(slug)) || 0);
    if (saved > 5 && saved < durationSeconds - 5 && audioRef.current) {
      audioRef.current.currentTime = saved;
      setElapsed(saved);
    }
  }, [slug, audioUrl, durationSeconds]);

  // Tick: elapsed + timer countdown + fade-out + persist position
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const a = audioRef.current;
      const t = a ? Math.floor(a.currentTime) : elapsed + 1;
      setElapsed(t);
      if (a) localStorage.setItem(resumeKey(slug), String(t));

      setTimerRemaining((r) => {
        if (r === null) return r;
        if (a && r <= FADE_SECONDS) {
          a.volume = Math.max(0, r / FADE_SECONDS);
        }
        if (r <= 1) {
          if (a) {
            a.pause();
            a.volume = 1;
          }
          setPlaying(false);
          return null;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, slug, elapsed]);

  // Media Session API: lockscreen / OS-level controls
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "Noisy",
      album: category,
    });
    navigator.mediaSession.setActionHandler("play", () => toggle());
    navigator.mediaSession.setActionHandler("pause", () => toggle());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, category]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) {
      setPlaying((p) => !p);
      return;
    }
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const setTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimerRemaining(minutes === 0 ? null : minutes * 60);
    if (audioRef.current) audioRef.current.volume = 1;
  };

  return (
    <div className="font-mono">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={toggle}
          className="border border-fg px-6 py-3 text-sm uppercase hover:bg-fg hover:text-bg transition-colors"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="text-right">
          <div className="text-2xl tabular-nums">{formatTime(elapsed)}</div>
          <div className="text-xs uppercase text-muted">
            / {formatTime(durationSeconds)}
          </div>
        </div>
      </div>

      {!audioUrl && (
        <div className="mt-6 border-t border-line pt-4 text-xs uppercase text-muted">
          Audio rendering — track will be live shortly.
        </div>
      )}

      <div className="mt-8 border-t border-line pt-4">
        <div className="text-xs uppercase text-muted mb-3">Sleep Timer</div>
        <div className="flex gap-px bg-line border border-line">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setTimer(opt.minutes)}
              className={`flex-1 py-2 text-xs uppercase ${
                timerMinutes === opt.minutes
                  ? "bg-fg text-bg"
                  : "bg-bg hover:bg-fg hover:text-bg"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {timerRemaining !== null && (
          <div className="mt-3 text-xs uppercase text-muted tabular-nums">
            Fades out in {formatTime(timerRemaining)}
          </div>
        )}
      </div>
    </div>
  );
}
