"use client";

import { useState } from "react";
import {
  ProgressMeter,
  RewardPill,
  Surface,
} from "@/components/ui/gamification-ui";
import { useAppStore } from "@/lib/store";
import { BEAD_TARGET } from "@/lib/gamification";
import { nativeHapticLight, nativeHapticSuccess } from "@/lib/native";

export function BeadCounter() {
  const { logPractice } = useAppStore();
  const [count, setCount] = useState(0);
  const [pop, setPop] = useState(false);
  const [done, setDone] = useState<{ merit: number } | null>(null);

  function tap() {
    if (done) return;
    const next = count + 1;
    setCount(next);
    setPop(true);
    window.setTimeout(() => setPop(false), 180);

    void nativeHapticLight();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        /* ignore */
      }
    }

    if (next >= BEAD_TARGET) {
      const result = logPractice({ type: "beads", bead_count: next });
      setDone(result);
      void nativeHapticSuccess();
    }
  }

  function finishPartial() {
    if (count < 1) return;
    const result = logPractice({ type: "beads", bead_count: count });
    setDone(result);
  }

  function reset() {
    setCount(0);
    setDone(null);
  }

  const progress = Math.min(1, count / BEAD_TARGET);

  return (
    <Surface className="grid justify-items-center gap-5 p-5 text-center animate-grow-in">
      <div>
        <p className="text-sm text-text-secondary">ပုတီးစိပ် · Smart Beads</p>
        <p className="mt-1 font-display text-5xl tabular-nums text-accent-merit-soft">
          {count}
          <span className="text-2xl text-text-tertiary"> / {BEAD_TARGET}</span>
        </p>
      </div>

      <div className="w-full max-w-xs">
        <ProgressMeter
          value={progress * 100}
          label="Bead practice progress"
          current={`${count} beads`}
          target={`${BEAD_TARGET} target`}
        />
      </div>

      <button
        type="button"
        onClick={tap}
        disabled={Boolean(done)}
        className={`grid h-40 w-40 place-items-center rounded-full border border-accent-tree/60 bg-gradient-to-b from-accent-tree to-leaf text-cream shadow-[0_12px_40px_rgba(61,122,74,0.35)] transition active:scale-95 disabled:opacity-60 ${
          pop ? "animate-bead-pop" : ""
        }`}
        aria-label="Tap bead"
      >
        <span className="font-display text-xl">တို့ပါ · Tap</span>
      </button>

      <div className="flex flex-wrap justify-center gap-2">
        {!done && count > 0 && count < BEAD_TARGET && (
          <button
            type="button"
            onClick={finishPartial}
            className="gamify-button gamify-button--secondary"
          >
            ယခု ပြီးဆုံးမည်
          </button>
        )}
        {(done || count > 0) && (
          <button
            type="button"
            onClick={reset}
            className="gamify-button gamify-button--quiet"
          >
            ပြန်စမည် · Reset
          </button>
        )}
      </div>

      {done && (
        <div className="grid justify-items-center gap-2 animate-grow-in">
          <RewardPill value={done.merit} />
          <p className="text-sm text-accent-success">
            {count >= BEAD_TARGET ? "ပုတီး ၁၀၈ ပြီးမြောက်" : "Practice saved"}
          </p>
        </div>
      )}

      <p className="text-sm text-text-tertiary">
        ဖုန်းတွင် vibration ပံ့ပိုးပါက တို့တိုင်း တုန်ခါမည်။
      </p>
    </Surface>
  );
}
