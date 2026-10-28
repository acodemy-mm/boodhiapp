"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BodhiScene } from "@/components/brand/bodhi-scenes";
import {
  ArrowLeftIcon,
  PlayIcon,
  SproutIcon,
} from "@/components/ui/icons";
import {
  PageHeader,
  ProgressSteps,
  RewardPill,
  SectionHeading,
  Surface,
} from "@/components/ui/gamification-ui";
import { getLesson, getLessonsForModule, getModule, quoteOfDay } from "@/lib/content";
import { createGamificationSnapshot } from "@/lib/gamification/view";
import { useAppStore } from "@/lib/store";

function renderContent(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display mt-6 text-2xl text-accent-merit-soft">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      const text = line.slice(2);
      const html = text.replace(
        /\*\*(.+?)\*\*/g,
        "<strong class='text-accent-merit-soft'>$1</strong>",
      );
      return (
        <li
          key={i}
          className="ml-4 list-disc text-text-secondary"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="ml-4 list-decimal text-text-secondary">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    if (!line.trim()) return <br key={i} />;
    return (
      <p key={i} className="text-text-secondary leading-relaxed">
        {line}
      </p>
    );
  });
}

export default function LessonPage() {
  const params = useParams<{ module: string; lesson: string }>();
  const lesson = getLesson(params.module, params.lesson);
  const mod = getModule(params.module);
  const {
    profile,
    completedLessonIds,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
    completeLesson,
  } = useAppStore();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [started, setStarted] = useState(false);

  if (!lesson || !mod) {
    return (
      <section className="gamify-page animate-grow-in">
        <PageHeader title="သင်ခန်းစာ မတွေ့ပါ" />
        <Surface muted className="grid gap-3 p-5 text-center">
          <p className="text-sm text-text-secondary">
            သင်ခန်းစာ မတွေ့ပါ။
          </p>
          <Link href="/learn" className="gamify-button gamify-button--secondary">
            ပြန်သွားရန်
          </Link>
        </Surface>
      </section>
    );
  }

  const snapshot = createGamificationSnapshot({
    profile,
    completedLessonIds,
    earnedBadgeSlugs,
    sessions,
    quizAttempts,
  });
  const done = completedLessonIds.includes(lesson.id);
  const moduleLessons = getLessonsForModule(mod.slug);
  const lessonIndex = moduleLessons.findIndex((item) => item.id === lesson.id);
  const quote = quoteOfDay();

  function onComplete() {
    const result = completeLesson(lesson!.id);
    if (result.already) {
      setMessage("ဤသင်ခန်းစာကို ပြီးမြောက်ပြီးသား ဖြစ်သည်။");
    } else {
      setMessage(`သာဓု! +${result.merit} merit`);
      window.setTimeout(() => router.push("/learn"), 900);
    }
  }

  return (
    <article className="gamify-page animate-grow-in">
      <PageHeader
        title={mod.title_mm}
        description={mod.description_mm}
      />

      {snapshot && (
        <Surface strong className="flex items-center justify-between gap-3 p-3">
          <span className="inline-flex items-center gap-2 text-sm text-cream">
            <SproutIcon className="h-5 w-5 text-accent-tree" />
            Level {snapshot.level} · {snapshot.merit} merit
          </span>
          <RewardPill value={10} />
        </Surface>
      )}

      <Surface className="overflow-hidden p-0">
        <div className="relative aspect-[1.58] overflow-hidden bg-bg-mid">
          <BodhiScene className="h-full w-full" />
          <span className="absolute left-3 top-3 rounded-full border border-border-strong bg-bg-deep/75 px-3 py-1 text-xs font-bold text-accent-merit-soft">
            {Math.max(1, lessonIndex + 1)} / {moduleLessons.length}
          </span>
        </div>
        <div className="grid gap-2 p-4">
          <p className="gamify-kicker">{lesson.title_en}</p>
          <h2 className="font-display text-2xl text-cream">{lesson.title_mm}</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {mod.description_mm} ကို ဖြည်းဖြည်းချင်း လေ့လာပြီး လက်တွေ့ကျင့်ပါ။
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-accent-merit">
            <PlayIcon className="h-4 w-4" /> {lesson.duration_mins} min
          </span>
        </div>
      </Surface>

      <button
        type="button"
        onClick={() => setStarted(true)}
        className="gamify-button gamify-button--primary w-full"
      >
        <PlayIcon />
        {started ? "Continue Learning" : "Start Learning"}
        <ArrowLeftIcon className="rotate-180" />
      </button>

      <Surface className="grid gap-4 p-4">
        <SectionHeading
          action={
            <Link href="/home" className="text-xs text-accent-merit-soft">
              See all
            </Link>
          }
        >
          <SproutIcon /> Today&apos;s Progress
        </SectionHeading>
        <ProgressSteps
          steps={snapshot?.dailySteps ?? []}
          currentIndex={done ? 4 : started ? 1 : 0}
        />
      </Surface>

      <Surface className="flex items-start gap-3 p-4">
        <SproutIcon className="h-5 w-5 shrink-0 text-accent-tree" />
        <div>
          <p className="text-sm leading-relaxed text-cream">{quote.text_mm}</p>
          <small className="mt-1 block text-xs text-text-tertiary">
            {quote.text_en}
          </small>
        </div>
      </Surface>

      {started && (
        <Surface className="grid gap-4 p-4">
          <div className="grid gap-2 text-sm leading-8">
            {renderContent(lesson.content)}
          </div>
          <button
            type="button"
            onClick={onComplete}
            disabled={done}
            className="gamify-button gamify-button--secondary w-full"
          >
            {done ? "Lesson Complete" : "Complete Lesson · +10 Merit"}
          </button>
          {message && (
            <p className="text-center text-sm text-accent-success">{message}</p>
          )}
          <p className="text-center text-xs text-text-tertiary">
            {snapshot?.isMaxLevel
              ? "Your Bodhi Tree is fully grown."
              : `${snapshot?.meritToNext ?? 0} merit to the next level`}
          </p>
        </Surface>
      )}
    </article>
  );
}
