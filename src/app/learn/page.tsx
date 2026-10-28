"use client";

import Link from "next/link";
import {
  PageHeader,
  ProgressMeter,
  RewardPill,
  Surface,
} from "@/components/ui/gamification-ui";
import { MODULES, getLessonsForModule } from "@/lib/content";
import { MERIT } from "@/lib/gamification";
import { createGamificationSnapshot } from "@/lib/gamification/view";
import { useAppStore } from "@/lib/store";

const TRACK_LABEL: Record<string, string> = {
  vipassana: "ဝိပဿနာ",
  abhidhamma: "အဘိဓမ္မာ",
  pali: "ပါဠိ",
};

export default function LearnPage() {
  const {
    profile,
    completedLessonIds,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
  } = useAppStore();
  const snapshot = createGamificationSnapshot({
    profile,
    completedLessonIds,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
  });

  return (
    <section className="gamify-page section-page animate-grow-in">
      <PageHeader
        title="သင်ယူရန် · Learn"
        description="သင်ခန်းစာ လေ့လာပြီးလျှင် ကုသိုလ်အမှတ် ရရှိမည်"
      />

      {snapshot && (
        <Surface strong className="grid gap-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-text-secondary">Your learning path</p>
              <p className="text-lg font-bold text-cream">
                Level {snapshot.level} · {snapshot.tree.en}
              </p>
            </div>
            <RewardPill value={snapshot.merit} label="merit" prefix="" />
          </div>
          <ProgressMeter
            value={snapshot.progressPercent}
            label="Level progress"
            current={`${snapshot.merit} merit`}
            target={
              snapshot.isMaxLevel
                ? "Max level"
                : `${snapshot.meritToNext} to grow`
            }
            tone="tree"
          />
        </Surface>
      )}

      <div className="mt-8 space-y-4">
        {MODULES.map((mod) => {
          const lessons = getLessonsForModule(mod.slug);
          const doneCount = lessons.filter((l) =>
            completedLessonIds.includes(l.id),
          ).length;

          return (
            <Surface key={mod.id} interactive className="grid gap-4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="gamify-kicker">
                    {TRACK_LABEL[mod.track]}
                  </p>
                  <h2 className="mt-1 font-display text-xl text-cream">
                    {mod.title_mm}
                  </h2>
                  <p className="text-sm text-text-secondary">{mod.title_en}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {mod.description_mm}
                  </p>
                </div>
                <span className="rounded-full bg-accent-tree/15 px-3 py-1 text-xs text-accent-merit-soft">
                  {doneCount}/{lessons.length} ပြီး
                </span>
              </div>

              <ul className="space-y-2 border-t border-border-subtle pt-3">
                {lessons.map((lesson) => {
                  const done = completedLessonIds.includes(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/learn/${mod.slug}/${lesson.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition hover:bg-surface-muted"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-cream">
                            {lesson.title_mm}
                          </span>
                          <span className="text-xs text-text-tertiary">
                            {lesson.title_en} · {lesson.duration_mins} မိနစ်
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-accent-merit-soft">
                          {done ? "ပြီးပြီ" : `သင်လျှင် +${MERIT.lesson}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Surface>
          );
        })}
      </div>
    </section>
  );
}
