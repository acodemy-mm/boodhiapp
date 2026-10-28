import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/gamification-ui";
import { getAbidanEntry } from "@/lib/dictionary/abidan";

export const dynamic = "force-dynamic";

export default async function DictionaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getAbidanEntry(Number(id));
  if (!entry) notFound();

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader title={entry.word} description="အဓိပ္ပာယ်" />

      <div className="grid gap-4">
        {entry.pages.map((page) => (
          <figure key={`${page.bookId}-${page.pdfIndex}`} className="grid gap-2">
            <img
              src={`/api/dictionary/page?book=${encodeURIComponent(page.bookId)}&index=${page.pdfIndex}`}
              alt={`${entry.word} အဓိပ္ပာယ်`}
              className="dictionary-meaning"
            />
            <figcaption className="text-xs text-text-tertiary">
              {page.bookName} · စာမျက်နှာ {page.page}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
