import { PageHeader } from "@/components/ui/gamification-ui";
import { FireIcon, LeafIcon, PlayIcon } from "@/components/ui/icons";
import Link from "next/link";

export default function PracticeHubPage() {
  return (
    <section className="gamify-page section-page animate-grow-in">
      <PageHeader
        title="လေ့ကျင့်ရန် · Practice"
        description="တရားထိုင်ခြင်းနှင့် မှတ်တမ်း"
      />

      <div className="grid gap-3">
        <Link
          href="/practice/meditate"
          className="gamify-surface gamify-surface--interactive grid gap-3 p-5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
            <LeafIcon />
          </span>
          <h2 className="font-display text-2xl text-cream">တရားထိုင်ခြင်း</h2>
          <p className="text-sm text-accent-merit-soft">
            Meditation Timer · Dhamma Audio
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            ၅ / ၁၀ / ၁၅ မိနစ် အချိန်မှတ်တမ်းနှင့် YouTube တရားနာရန်
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-merit">
            <PlayIcon className="h-4 w-4" /> Begin a calm session
          </span>
        </Link>
        <Link
          href="/profile#history"
          className="gamify-surface gamify-surface--interactive grid gap-3 p-5"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
            <FireIcon />
          </span>
          <h2 className="font-display text-2xl text-cream">မှတ်တမ်း · History</h2>
          <p className="text-sm text-accent-merit-soft">
            Tracker & recent practice
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            တရားထိုင်ခြင်းနှင့် worship ပြီးဆုံးမှုများကို ကြည့်ရန်
          </p>
        </Link>
      </div>
    </section>
  );
}
