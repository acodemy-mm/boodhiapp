import { PageHeader, Surface } from "@/components/ui/gamification-ui";

export default function EventPage() {
  return (
    <section className="gamify-page section-page animate-grow-in">
      <PageHeader
        title="Event"
        description="ပွဲတော်နှင့် အသိုင်းအဝိုင်း လှုပ်ရှားမှုများ"
      />
      <Surface strong className="grid gap-3 p-5 text-center">
        <p className="font-display text-xl text-cream">Coming soon</p>
        <p className="text-sm leading-relaxed text-text-secondary">
          Community events, retreats, and shared practice days will live here.
          Your Home habit path stays ready in the meantime.
        </p>
      </Surface>
    </section>
  );
}
