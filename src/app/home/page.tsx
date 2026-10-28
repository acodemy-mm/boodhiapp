"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookIcon,
  FireIcon,
  LeafIcon,
  BellIcon,
  CheckIcon,
  PlayIcon,
  RestartIcon,
  ChevronIcon,
} from "@/components/ui/icons";
import { quoteEvery } from "@/lib/content";
import { todayISODate } from "@/lib/gamification";
import {
  buildLaunchNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications";
import { getPrayersByIds } from "@/lib/prayers";
import { useAppStore } from "@/lib/store";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const PLAN_DAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const QUOTE_INTERVAL_MS = 15 * 60 * 1000;

function useRotatingQuote() {
  const [quote, setQuote] = useState(() => quoteEvery(QUOTE_INTERVAL_MS));

  useEffect(() => {
    const update = () => setQuote(quoteEvery(QUOTE_INTERVAL_MS));
    const wait = QUOTE_INTERVAL_MS - (Date.now() % QUOTE_INTERVAL_MS);
    let interval = 0;
    const timeout = window.setTimeout(() => {
      update();
      interval = window.setInterval(update, QUOTE_INTERVAL_MS);
    }, wait);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return quote;
}

function formatClock(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export default function HomePage() {
  const {
    profile,
    worshipPlans,
    activeWorshipPlanId,
    habitCompletions,
    worshipDayStarts,
    sessions,
    completeWorshipDay,
    restartWorshipDay,
    readNotificationIds,
  } = useAppStore();
  const quote = useRotatingQuote();
  const [prayersOpen, setPrayersOpen] = useState(false);
  const launchNotifications = useMemo(
    () =>
      buildLaunchNotifications({
        worshipPlans,
        lastPracticeDate: profile?.last_practice_date,
      }),
    [worshipPlans, profile?.last_practice_date],
  );
  const unreadNotifications = getUnreadNotificationCount(
    launchNotifications,
    readNotificationIds,
  );

  const todayKey = todayISODate();
  const todayWeekday = new Date().getDay();
  const activePlan =
    worshipPlans.find((plan) => plan.id === activeWorshipPlanId) ??
    worshipPlans[0];
  const scheduledToday = activePlan
    ? activePlan.weekdays.includes(todayWeekday)
    : false;
  const todayDone = useMemo(
    () => habitCompletions[todayKey] ?? [],
    [habitCompletions, todayKey],
  );

  const activePrayerIds = useMemo(
    () => activePlan?.prayerIds ?? [],
    [activePlan],
  );

  const habitPrayers = useMemo(
    () => getPrayersByIds(activePrayerIds),
    [activePrayerIds],
  );
  const startedAt = activePlan
    ? worshipDayStarts[`${todayKey}:${activePlan.id}`]
    : undefined;
  const latestWorship = sessions.find(
    (session) =>
      session.type === "worship" &&
      session.worship_plan_id === activePlan?.id &&
      session.created_at.slice(0, 10) === todayKey,
  );
  const roundDone = Boolean(
    startedAt && latestWorship && latestWorship.created_at >= startedAt,
  );
  const playing = Boolean(startedAt) && !roundDone;

  useEffect(() => {
    if (!activePlan || !roundDone) return;
    const missing = habitPrayers.some((prayer) => !todayDone.includes(prayer.id));
    if (missing) completeWorshipDay(activePlan.id);
  }, [
    activePlan,
    completeWorshipDay,
    habitPrayers,
    roundDone,
    todayDone,
  ]);

  if (!profile) return null;

  const practicedToday = profile.last_practice_date === todayKey;
  const activeDays = Math.min(7, profile.streak_current);
  const doneCount = habitPrayers.filter((prayer) =>
    todayDone.includes(prayer.id),
  ).length;

  return (
    <section className="reference-shell reference-home animate-grow-in">
      <header className="reference-header">
        <div>
          <p className="reference-kicker">BODHI PATH</p>
          <h1 className="reference-brand">ဗောဓိလမ်း</h1>
          <p className="reference-welcome">
            မင်္ဂလာပါ၊ {profile.display_name} · Keep growing mindfully.
          </p>
        </div>
        <Link
          href="/notifications"
          className="reference-avatar"
          aria-label={
            unreadNotifications
              ? `Open notifications, ${unreadNotifications} unread`
              : "Open notifications"
          }
        >
          <BellIcon />
          {unreadNotifications > 0 ? (
            <span className="reference-avatar-badge" aria-hidden>
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          ) : null}
        </Link>
      </header>

      <div className="reference-hero">
        <Image
          src="/bodhi-mascot.png"
          alt="Bodhi, a small sprout meditating with a lotus"
          width={374}
          height={512}
          priority
          className="reference-hero-image"
        />
      </div>

      <section className="reference-habit-card">
        <div className="reference-habit-heading">
          <strong>Worship plans</strong>
          <Link href="/worship-plans">See all</Link>
        </div>

        {activePlan ? (
          <div className="worship-plan-summary">
            <div className="worship-plan-summary__top">
              <span className="worship-plan-time">{formatClock(activePlan.time)}</span>
              <div className="reference-habit-days" aria-label="Plan days">
                {PLAN_DAYS.map((label, day) => (
                  <span
                    key={`${label}-${day}`}
                    className={
                      activePlan.weekdays.includes(day) ? "is-active" : ""
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="worship-plan-summary__title">
              <h2>{activePlan.name}</h2>
              <div className="worship-plan-summary__actions">
                {roundDone ? (
                  <>
                    <span className="worship-day-done">
                      <CheckIcon /> Completed
                    </span>
                    <button
                      type="button"
                      className="worship-day-restart"
                      onClick={() => {
                        restartWorshipDay(activePlan.id);
                        setPrayersOpen(false);
                      }}
                    >
                      <RestartIcon /> Restart
                    </button>
                  </>
                ) : playing ? (
                  <>
                    <Link href="/worship-play" className="worship-day-play">
                      <PlayIcon /> Continue
                    </Link>
                    <button
                      type="button"
                      className="worship-day-complete"
                      onClick={() => completeWorshipDay(activePlan.id)}
                    >
                      <CheckIcon /> Completed
                    </button>
                  </>
                ) : (
                  <Link href="/worship-play" className="worship-day-play">
                    <PlayIcon /> Play
                  </Link>
                )}
              </div>
            </div>
            <p>
              <BellIcon /> Remind in-app {activePlan.notifyMinutes} min before
              <span>
                <BookIcon /> {activePlan.prayerIds.length} Prayers
              </span>
            </p>
          </div>
        ) : null}

        <button
          type="button"
          className="worship-plan-progress habit-accordion"
          aria-expanded={prayersOpen}
          aria-controls="home-prayer-list"
          onClick={() => setPrayersOpen((open) => !open)}
        >
          <span>
            Habit tracker · {doneCount}/{habitPrayers.length} complete today
          </span>
          <ChevronIcon />
        </button>

        <div
          className={`habit-prayers ${prayersOpen ? "is-open" : ""}`}
          id="home-prayer-list"
        >
          <div>
            {!scheduledToday ? (
              <p className="reference-habit-rest">
                This plan is not scheduled today.
              </p>
            ) : (
              <ul className="reference-habit-list">
                {habitPrayers.map((prayer) => {
                  const checked = todayDone.includes(prayer.id);
                  return (
                    <li
                      key={prayer.id}
                      className={`reference-habit-item ${checked ? "is-done" : ""}`}
                    >
                      <strong>{prayer.title_mm}</strong>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="reference-home-quote" aria-label="Daily quote">
        <div key={quote.id}>
          <p>&ldquo;{quote.text_mm}&rdquo;</p>
          <small>{quote.text_en}</small>
        </div>
      </section>

      <div className="reference-quick-grid">
        <ReferenceQuickLink
          href="/prayers"
          label="Prayers"
          icon={<BookIcon />}
        />
        <ReferenceQuickLink
          href="/worship-plans"
          label="Worship"
          icon={<BellIcon />}
        />
        <ReferenceQuickLink
          href="/practice/meditate"
          label="Meditate"
          icon={<LeafIcon />}
        />
        <ReferenceQuickLink
          href="/notifications"
          label="Reminders"
          icon={<BellIcon />}
          badge={unreadNotifications || undefined}
        />
      </div>

      <section className="reference-streak-card">
        <div className="reference-streak-heading">
          <span className="reference-streak-icon">
            <FireIcon />
          </span>
          <span>
            <strong>Daily Streak</strong>
            <small>
              {practicedToday
                ? "Keep going! You're doing great!"
                : "A small step today is enough."}
            </small>
          </span>
          <span className="reference-streak-count">
            <FireIcon /> {profile.streak_current} days
          </span>
        </div>
        <div className="reference-week">
          {WEEK.map((day, index) => {
            const active = index < activeDays;
            return (
              <span
                key={`${day}-${index}`}
                className={active ? "is-active" : ""}
              >
                <b>{active ? <LeafIcon /> : index + 1}</b>
                <small>{day}</small>
              </span>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function ReferenceQuickLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link href={href} className="reference-quick-link">
      {badge ? <span className="reference-quick-badge">{badge}</span> : null}
      <span className="reference-quick-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
