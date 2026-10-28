"use client";

import { useEffect, useRef, useState } from "react";
import { ProgressMeter, RewardPill, Surface } from "@/components/ui/gamification-ui";
import { useAppStore } from "@/lib/store";
import { MEDITATE_MIN_SECONDS } from "@/lib/gamification";
import { nativeHapticSuccess } from "@/lib/native";

const PRESETS = [
  { label: "5 မိနစ်", seconds: 5 * 60 },
  { label: "10 မိနစ်", seconds: 10 * 60 },
  { label: "15 မိနစ်", seconds: 15 * 60 },
];

function formatTime(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function MeditationTimer() {
  const { logPractice } = useAppStore();
  const [duration, setDuration] = useState(PRESETS[0].seconds);
  const [remaining, setRemaining] = useState(PRESETS[0].seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<{ merit: number } | null>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setRunning(false);
          const elapsed = duration;
          const result = logPractice({
            type: "meditate",
            duration_sec: elapsed,
          });
          setDone(result);
          void nativeHapticSuccess();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, duration, logPractice]);

  function start() {
    setDone(null);
    setRemaining(duration);
    startedAt.current = Date.now();
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function finishEarly() {
    setRunning(false);
    const elapsed = duration - remaining;
    if (elapsed < 30) {
      setRemaining(duration);
      return;
    }
    const result = logPractice({ type: "meditate", duration_sec: elapsed });
    setDone(result);
  }

  const progress = 1 - remaining / duration;

  return (
    <Surface className="grid justify-items-center gap-5 p-5 text-center animate-grow-in">
      <div className="relative flex h-52 w-52 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--progress-track)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--accent-merit)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            className="transition-[stroke-dashoffset] duration-1000 linear"
          />
        </svg>
        <span className="font-display text-4xl tabular-nums text-cream">
          {formatTime(remaining)}
        </span>
      </div>

      {!running && !done && (
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.seconds}
              type="button"
              onClick={() => {
                setDuration(p.seconds);
                setRemaining(p.seconds);
              }}
              className={`gamify-button ${
                duration === p.seconds
                  ? "bg-leaf text-cream"
                  : "gamify-button--secondary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {!running && !done && (
          <button
            type="button"
            onClick={start}
            className="gamify-button gamify-button--primary"
          >
            စတင်ရန် · Start
          </button>
        )}
        {running && (
          <>
            <button
              type="button"
              onClick={pause}
              className="gamify-button gamify-button--secondary"
            >
              ခဏရပ် · Pause
            </button>
            <button
              type="button"
              onClick={finishEarly}
              className="gamify-button gamify-button--secondary"
            >
              ပြီးဆုံး · Finish
            </button>
          </>
        )}
        {!running && remaining > 0 && remaining < duration && !done && (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="gamify-button gamify-button--primary"
          >
            ဆက်လက် · Resume
          </button>
        )}
        {done && (
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setRemaining(duration);
            }}
            className="gamify-button gamify-button--secondary"
          >
            ထပ်မံ ထိုင်မည်
          </button>
        )}
      </div>

      {done && (
        <div className="grid justify-items-center gap-2 animate-grow-in">
          <RewardPill value={done.merit} />
          <p className="text-sm text-accent-success">
            {(duration - remaining || duration) >= MEDITATE_MIN_SECONDS
              ? "ပြည့်မီသော ထိုင်ခြင်း"
              : "တိုတောင်းသော ထိုင်ခြင်း"}
          </p>
        </div>
      )}

      <div className="w-full max-w-xs">
        <ProgressMeter
          value={progress * 100}
          label="Meditation progress"
          current={`${Math.round(progress * duration)} sec`}
          target={`${duration} sec`}
        />
      </div>
      <p className="text-sm text-text-tertiary">
        ၅ မိနစ်နှင့်အထက် ထိုင်လျှင် +15 merit ရရှိမည်။
      </p>
    </Surface>
  );
}
