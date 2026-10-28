"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState, PageHeader } from "@/components/ui/gamification-ui";
import { ArrowRightIcon } from "@/components/ui/icons";

type DictionaryWord = {
  id: number;
  word: string;
};

type DictionaryResponse = {
  letters: { letter: string; count: number }[];
  words: DictionaryWord[];
  total: number;
  letter: string | null;
};

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("အ");
  const [letters, setLetters] = useState<{ letter: string; count: number }[]>([]);
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams({ limit: "60" });
      if (query.trim()) params.set("q", query.trim());
      else params.set("letter", letter);
      fetch(`/api/dictionary?${params}`)
        .then((response) => response.json())
        .then((data: DictionaryResponse) => {
          setLetters(data.letters);
          setWords(data.words);
          setTotal(data.total);
          if (!query.trim() && data.letter && data.letter !== letter) {
            setLetter(data.letter);
          }
        })
        .finally(() => setLoading(false));
    }, 180);
    return () => window.clearTimeout(handle);
  }, [query, letter]);

  async function showMore() {
    const params = new URLSearchParams({
      limit: "60",
      offset: String(words.length),
    });
    if (query.trim()) params.set("q", query.trim());
    else params.set("letter", letter);
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/dictionary?${params}`);
      const data: DictionaryResponse = await response.json();
      setWords((current) => [...current, ...data.words]);
      setTotal(data.total);
    } finally {
      setLoadingMore(false);
    }
  }

  const browsing = query.trim().length === 0;

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Pāli Dictionary"
        description="တိပိဋက ပါဠိ-မြန်မာ အဘိဓာန် · စကားလုံးရှာပြီး အက္ခရာအလိုက် ကြည့်ပါ"
      />

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">
          Search words
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ပါဠိ သို့မဟုတ် မြန်မာစာလုံး…"
          className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted px-3.5 py-3 text-sm text-cream outline-none placeholder:text-text-tertiary focus:border-border-strong"
        />
      </label>

      <div className="dictionary-alpha" role="tablist" aria-label="Alphabet">
        {letters.map((item) => (
          <button
            key={item.letter}
            type="button"
            role="tab"
            aria-selected={browsing && letter === item.letter}
            className={browsing && letter === item.letter ? "is-active" : ""}
            onClick={() => {
              setQuery("");
              setLetter(item.letter);
            }}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading words…</p>
      ) : words.length === 0 ? (
        <EmptyState>
          {browsing
            ? `No words under ${letter}.`
            : `No matches for “${query.trim()}”.`}
        </EmptyState>
      ) : (
        <div className="grid gap-2">
          <p className="text-xs text-text-tertiary">
            {browsing ? `${letter} · ` : ""}
            {total.toLocaleString()} word{total === 1 ? "" : "s"}
          </p>
          {words.map((entry) => (
            <Link
              key={entry.id}
              href={`/dictionary/${entry.id}`}
              className="gamify-choice flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <strong className="block text-sm text-cream">{entry.word}</strong>
              </span>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(243,213,106,0.16)] text-[var(--gold-soft)]"
                aria-hidden
              >
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
          {words.length < total ? (
            <button
              type="button"
              className="gamify-button gamify-button--secondary"
              onClick={showMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading…" : "Show more"}
            </button>
          ) : null}
        </div>
      )}

      <p className="text-xs text-text-tertiary">
        Word index from the Tipitaka Pali–Myanmar Dictionary by Pn Daza.
      </p>
    </section>
  );
}
