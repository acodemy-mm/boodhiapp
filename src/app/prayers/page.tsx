"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, PageHeader } from "@/components/ui/gamification-ui";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PRAYER_DOCUMENTS } from "@/lib/prayers";

export default function PrayersPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRAYER_DOCUMENTS;
    return PRAYER_DOCUMENTS.filter((prayer) => {
      const haystack = [
        prayer.title_mm,
        prayer.title_en,
        prayer.about,
        prayer.body_mm,
        prayer.body_en,
        ...prayer.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader title="Prayer Sar" />

      <label className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">
          Search
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Title, tag, or keyword…"
          className="gamify-input"
        />
      </label>

      {results.length === 0 ? (
        <EmptyState>No prayer documents match “{query}”.</EmptyState>
      ) : (
        <div className="grid gap-2">
          <p className="text-xs text-text-tertiary">
            {results.length} document{results.length === 1 ? "" : "s"}
          </p>
          {results.map((prayer) => (
            <Link
              key={prayer.id}
              href={`/prayers/${encodeURIComponent(prayer.id)}`}
              className="gamify-choice flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <strong className="block text-sm text-cream">
                  {prayer.title_mm}
                </strong>
                <span className="mt-1 block text-xs text-text-secondary">
                  {prayer.title_en}
                </span>
              </span>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(243,213,106,0.16)] text-[var(--gold-soft)]"
                aria-hidden
              >
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
