import { BeadCounter } from "@/components/practice/bead-counter";
import { PageHeader } from "@/components/ui/gamification-ui";

export default function BeadsPage() {
  return (
    <section className="gamify-page">
      <PageHeader
        title="ပုတီးစိပ်"
        description="တို့တိုင်း တစ်လုံး · ၁၀၈ လုံး ပန်းတိုင်"
      />
      <BeadCounter />
    </section>
  );
}
