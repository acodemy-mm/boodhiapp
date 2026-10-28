import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Surface } from "@/components/ui/gamification-ui";
import { PrayerAbout } from "@/components/ui/prayer-about";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getNextPrayer, getPrayer } from "@/lib/prayers";

export default async function PrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prayer = getPrayer(decodeURIComponent(id));
  if (!prayer) notFound();
  const next = getNextPrayer(prayer.id);

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader title={prayer.title_mm} />
      <PrayerAbout about={prayer.about} />

      <Surface className="grid gap-4 p-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
          Recitation · {prayer.verses.length} lines
        </p>
        <div className="recitation-list">
          {prayer.verses.map((verse, index) => (
            <div key={`${prayer.id}-${index}`} className="recitation-verse">
              <p>{verse.content}</p>
              {verse.pronunciation ? <p>{verse.pronunciation}</p> : null}
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="grid gap-3 p-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
          Next
        </p>
        {next ? (
          <Link
            href={`/prayers/${encodeURIComponent(next.id)}`}
            className="gamify-choice flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <strong className="block text-base text-cream">
                {next.title_mm}
              </strong>
              {next.title_en ? (
                <span className="mt-1 block text-xs leading-relaxed text-text-secondary">
                  {next.title_en}
                </span>
              ) : null}
            </span>
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(243,213,106,0.16)] text-[var(--gold-soft)]"
              aria-hidden
            >
              <ArrowRightIcon />
            </span>
          </Link>
        ) : (
          <Link
            href="/prayers"
            className="gamify-choice flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <strong className="block text-base text-cream">Prayer Sar</strong>
              <span className="mt-1 block text-xs leading-relaxed text-text-secondary">
                Return to the full Prayer Sar list.
              </span>
            </span>
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(243,213,106,0.16)] text-[var(--gold-soft)]"
              aria-hidden
            >
              <ArrowRightIcon />
            </span>
          </Link>
        )}
      </Surface>
    </section>
  );
}
