"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
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

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function Player({ audioUrl, durationSeconds }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setElapsed((e) => Math.min(e + 1, durationSeconds));
      setTimerRemaining((r) => {
        if (r === null) return r;
        if (r <= 1) {
          setPlaying(false);
          audioRef.current?.pause();
          return null;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, durationSeconds]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) {
      setPlaying((p) => !p);
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const setTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimerRemaining(minutes === 0 ? null : minutes * 60);
  };

  return (
    <div className="font-mono">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} loop preload="none" />
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
