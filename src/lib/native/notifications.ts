"use client";

import type { WorshipPlan } from "@/lib/types";
import { isNativeApp } from "./platform";

const NOTIFICATION_ID_BASE = 41000;

function parsePlanTime(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return { hour, minute };
}

function nextOccurrence(plan: WorshipPlan, now = new Date()) {
  const parsed = parsePlanTime(plan.time);
  if (!parsed || plan.weekdays.length === 0) return null;

  const remindOffset = Math.max(0, plan.notifyMinutes);
  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    const candidate = new Date(now);
    candidate.setSeconds(0, 0);
    candidate.setDate(now.getDate() + dayOffset);
    candidate.setHours(parsed.hour, parsed.minute, 0, 0);
    candidate.setMinutes(candidate.getMinutes() - remindOffset);

    if (candidate.getTime() <= now.getTime()) continue;
    if (!plan.weekdays.includes(candidate.getDay())) continue;
    return candidate;
  }
  return null;
}

/** Schedule device local notifications for worship plans (Capacitor only). */
export async function syncNativeWorshipReminders(plans: WorshipPlan[]) {
  if (!isNativeApp()) return;

  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );

    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== "granted") {
      const requested = await LocalNotifications.requestPermissions();
      if (requested.display !== "granted") return;
    }

    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }

    const notifications = plans
      .map((plan, index) => {
        const at = nextOccurrence(plan);
        if (!at) return null;
        return {
          id: NOTIFICATION_ID_BASE + index,
          title: `${plan.name} · time to worship`,
          body: `Your plan starts soon. Open Play when you are ready.`,
          schedule: { at, allowWhileIdle: true },
          extra: { href: "/worship-play", planId: plan.id },
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    if (notifications.length === 0) return;
    await LocalNotifications.schedule({ notifications });
  } catch {
    /* plugin unavailable */
  }
}

export async function listenForNativeNotificationTaps(
  onOpen: (href: string) => void,
): Promise<() => void> {
  if (!isNativeApp()) return () => {};

  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    const handle = await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const href = event.notification.extra?.href;
        if (typeof href === "string" && href.startsWith("/")) onOpen(href);
      },
    );
    return () => {
      void handle.remove();
    };
  } catch {
    return () => {};
  }
}
