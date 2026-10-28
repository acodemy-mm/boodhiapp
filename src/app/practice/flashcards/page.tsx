"use client";

import { useMemo, useState } from "react";
import {
  EmptyState,
  PageHeader,
  Surface,
} from "@/components/ui/gamification-ui";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { FLASHCARDS } from "@/lib/learning-tools";

export default function FlashcardsPage() {
  const cards = useMemo(() => FLASHCARDS, []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);

  const card = cards[index];
  const knownCount = knownIds.length;

  function go(delta: number) {
    setFlipped(false);
    setIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return cards.length - 1;
      if (next >= cards.length) return 0;
      return next;
    });
  }

  function markKnown() {
    if (!card) return;
    setKnownIds((prev) =>
      prev.includes(card.id) ? prev : [...prev, card.id],
    );
    go(1);
  }

  if (!card) {
    return (
      <section className="gamify-page animate-grow-in">
        <PageHeader title="Flashcard Exercises" />
        <EmptyState>No flashcards available yet.</EmptyState>
      </section>
    );
  }

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Flashcard Exercises"
        description="ပါဠိနှင့် တရားအသုံးအနှုန်းများကို လေ့ကျင့်ပါ"
      />

      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>
          Card {index + 1} / {cards.length}
        </span>
        <span>
          Known {knownCount}/{cards.length}
        </span>
      </div>

      <button
        type="button"
        className="gamify-surface gamify-surface--strong grid min-h-[14rem] w-full gap-3 p-6 text-left transition"
        onClick={() => setFlipped((value) => !value)}
        aria-label={flipped ? "Show question" : "Show answer"}
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent-merit-soft">
          {flipped ? "Answer" : "Prompt"}
          {card.hint ? ` · ${card.hint}` : ""}
        </span>
        {flipped ? (
          <>
            <strong className="font-display text-2xl text-cream">
              {card.back_mm}
            </strong>
            <p className="text-sm text-text-secondary">{card.back_en}</p>
          </>
        ) : (
          <>
            <strong className="font-display text-3xl text-cream">
              {card.front_mm}
            </strong>
            <p className="text-sm text-accent-merit-soft">{card.front_en}</p>
            <small className="mt-auto text-xs text-text-tertiary">
              Tap to reveal
            </small>
          </>
        )}
      </button>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          className="gamify-button gamify-button--secondary"
          onClick={() => go(-1)}
        >
          <ArrowLeftIcon /> Prev
        </button>
        <button
          type="button"
          className="gamify-button gamify-button--primary"
          onClick={markKnown}
        >
          Got it
        </button>
        <button
          type="button"
          className="gamify-button gamify-button--secondary"
          onClick={() => go(1)}
        >
          Next <ArrowRightIcon />
        </button>
      </div>

      <Surface muted className="p-4 text-sm text-text-secondary">
        Review a few cards each day. Mark “Got it” when the meaning feels
        familiar — you can still revisit any card.
      </Surface>
    </section>
  );
}
