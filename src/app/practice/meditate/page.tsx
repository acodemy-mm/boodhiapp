import { MeditationTimer } from "@/components/practice/meditation-timer";
import { DhammaAudioCard } from "@/components/practice/dhamma-audio-card";
import { PageHeader } from "@/components/ui/gamification-ui";

export default function MeditatePage() {
  return (
    <section className="gamify-page">
      <PageHeader
        title="တရားထိုင်ခြင်း"
        description="ထွက်သက်ဝင်သက်ကို အာရုံပြု၍ ထိုင်ပါ"
      />
      <MeditationTimer />
      <DhammaAudioCard />
    </section>
  );
}
