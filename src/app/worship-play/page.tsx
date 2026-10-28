"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Surface } from "@/components/ui/gamification-ui";
import { PrayerAbout } from "@/components/ui/prayer-about";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { getPrayersByIds } from "@/lib/prayers";
import { useAppStore } from "@/lib/store";

export default function WorshipPlayPage() {
  const router = useRouter();
  const {
    worshipPlans,
    activeWorshipPlanId,
    startWorshipDay,
    completeWorshipDay,
  } = useAppStore();
  const [index, setIndex] = useState(0);

  const plan =
    worshipPlans.find((item) => item.id === activeWorshipPlanId) ??
    worshipPlans[0];
  const prayers = useMemo(
    () => getPrayersByIds(plan?.prayerIds ?? []),
    [plan],
  );
  const prayer = prayers[index];
  const isLast = index >= prayers.length - 1;

  useEffect(() => {
    if (plan) startWorshipDay(plan.id);
  }, [plan, startWorshipDay]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  if (!plan || prayers.length === 0) {
    return (
      <section className="gamify-page animate-grow-in">
        <PageHeader
          title="Worship play"
          description="Apply a worship plan with prayers first."
        />
        <Link href="/worship-plans" className="gamify-button gamify-button--primary">
          Open worship plans
        </Link>
      </section>
    );
  }

  function goNext() {
    if (!isLast) setIndex((value) => value + 1);
  }

  function finish() {
    completeWorshipDay(plan.id);
    router.push("/home");
  }

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title={plan.name}
        description={`Prayer ${index + 1} of ${prayers.length}`}
      />

      <Surface className="grid gap-2 p-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
          Plan prayers
        </p>
        <ol className="worship-play-list">
          {prayers.map((item, prayerIndex) => (
            <li key={item.id}>
              <button
                type="button"
                className={`worship-play-list__item ${
                  prayerIndex === index ? "is-active" : ""
                } ${prayerIndex < index ? "is-done" : ""}`}
                onClick={() => setIndex(prayerIndex)}
              >
                <span>{prayerIndex + 1}</span>
                <strong>{item.title_mm}</strong>
              </button>
            </li>
          ))}
        </ol>
      </Surface>

      {prayer ? (
        <>
          <h2 className="worship-play-title">{prayer.title_mm}</h2>
          <PrayerAbout key={prayer.id} about={prayer.about} />

          <Surface className="grid gap-4 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent-merit-soft">
              Recitation · {prayer.verses.length} lines
            </p>
            <div className="recitation-list">
              {prayer.verses.map((verse, verseIndex) => (
                <div
                  key={`${prayer.id}-${verseIndex}`}
                  className="recitation-verse"
                >
                  <p>{verse.content}</p>
                  {verse.pronunciation ? <p>{verse.pronunciation}</p> : null}
                </div>
              ))}
            </div>
          </Surface>
        </>
      ) : null}

      <div className="worship-play-actions">
        {isLast ? (
          <button
            type="button"
            className="gamify-button gamify-button--primary w-full"
            onClick={finish}
          >
            <CheckIcon /> Complete plan
          </button>
        ) : (
          <button
            type="button"
            className="gamify-button gamify-button--primary w-full"
            onClick={goNext}
          >
            Next prayer <ArrowRightIcon />
          </button>
        )}
      </div>
    </section>
  );
}
