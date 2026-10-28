import { todayISODate } from "@/lib/gamification";
import type { WorshipPlan } from "@/lib/types";

export type NotificationIconType = "habit" | "streak" | "level" | "event";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: NotificationIconType;
  href?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatClock(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${pad(minute)} ${suffix}`;
}

function minutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function parsePlanMinutes(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function relativeLabel(diffMinutes: number) {
  if (diffMinutes <= 0) return "Due now";
  if (diffMinutes < 60) return `In ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  if (mins === 0) return `In ${hours}h`;
  return `In ${hours}h ${mins}m`;
}

/** Build in-app worship reminders from plan time + notifyMinutes + weekdays. */
export function buildWorshipReminders(
  plans: WorshipPlan[],
  now = new Date(),
): AppNotification[] {
  const todayKey = todayISODate(now);
  const weekday = now.getDay();
  const nowMins = minutesSinceMidnight(now);

  return plans.flatMap((plan) => {
    if (!plan.weekdays.includes(weekday)) return [];
    const planMins = parsePlanMinutes(plan.time);
    if (planMins == null) return [];

    const remindMins = Math.max(0, planMins - Math.max(0, plan.notifyMinutes));
    const diffToRemind = remindMins - nowMins;
    const diffToPlan = planMins - nowMins;
    const withinWindow =
      nowMins >= remindMins - 5 && nowMins <= planMins + 60;

    // Always surface today's scheduled plan reminder while the app is open.
    const due = nowMins >= remindMins && nowMins <= planMins + 30;
    return [
      {
        id: `worship-reminder:${plan.id}:${todayKey}`,
        title: due
          ? `${plan.name} · time to worship`
          : `${plan.name} · in-app reminder`,
        body: due
          ? `Your plan starts at ${formatClock(plan.time)}. Open Play when you are ready.`
          : `We'll remind you here ${plan.notifyMinutes} min before ${formatClock(plan.time)}.`,
        time: withinWindow
          ? relativeLabel(Math.max(0, diffToPlan))
          : relativeLabel(Math.max(0, diffToRemind)),
        icon: "habit" as const,
        href: "/worship-play",
      },
    ];
  });
}

export function buildLaunchNotifications(input: {
  worshipPlans: WorshipPlan[];
  lastPracticeDate?: string | null;
  now?: Date;
}): AppNotification[] {
  const now = input.now ?? new Date();
  const todayKey = todayISODate(now);
  const reminders = buildWorshipReminders(input.worshipPlans, now);
  const tips: AppNotification[] = [];

  if (input.lastPracticeDate !== todayKey) {
    tips.push({
      id: `streak-tip:${todayKey}`,
      title: "Streak reminder",
      body: "A single mindful step today protects your daily streak.",
      time: "Today",
      icon: "streak",
      href: "/practice/meditate",
    });
  }

  return [...reminders, ...tips];
}

export function getUnreadNotifications(
  items: AppNotification[],
  readIds: string[],
) {
  const read = new Set(readIds);
  return items.filter((item) => !read.has(item.id));
}

export function getUnreadNotificationCount(
  items: AppNotification[],
  readIds: string[],
) {
  return getUnreadNotifications(items, readIds).length;
}
