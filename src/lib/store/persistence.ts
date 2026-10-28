import { PRESET_HABIT_PRAYER_IDS } from "@/lib/prayers";
import type { AppState, Profile, WorshipPlan } from "@/lib/types";

export const STORAGE_KEY = "bodhi-path-mvp-v2";
export const LEGACY_STORAGE_KEY = "bodhi-path-mvp-v1";

export function storageKeyFor(userId?: string | null) {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyProfile(partial?: Partial<Profile>): Profile {
  return {
    id: partial?.id ?? uid("user"),
    display_name: partial?.display_name ?? "ယောဂီ",
    goal: partial?.goal ?? null,
    onboarding_complete: partial?.onboarding_complete ?? false,
    merit_points: partial?.merit_points ?? 0,
    streak_current: partial?.streak_current ?? 0,
    streak_longest: partial?.streak_longest ?? 0,
    last_practice_date: partial?.last_practice_date ?? null,
    tree_stage: partial?.tree_stage ?? 0,
    email: partial?.email,
  };
}

export function starterWorshipPlan(partial?: Partial<WorshipPlan>): WorshipPlan {
  return {
    id: partial?.id ?? "plan-starter",
    name: partial?.name ?? "Starter",
    time: partial?.time ?? "06:00",
    weekdays: partial?.weekdays ?? [0, 1, 2, 3, 4, 5, 6],
    notifyMinutes: partial?.notifyMinutes ?? 5,
    prayerIds: partial?.prayerIds?.length
      ? partial.prayerIds
      : [...PRESET_HABIT_PRAYER_IDS],
  };
}

export function emptyHabitState(): Pick<
  AppState,
  | "habitPlanMode"
  | "habitSelectedPrayerIds"
  | "habitTime"
  | "habitWeekdays"
  | "worshipPlans"
  | "activeWorshipPlanId"
  | "habitCompletions"
  | "worshipDayStarts"
> {
  const starter = starterWorshipPlan();
  return {
    habitPlanMode: "preset",
    habitSelectedPrayerIds: starter.prayerIds,
    habitTime: starter.time,
    habitWeekdays: starter.weekdays,
    worshipPlans: [starter],
    activeWorshipPlanId: starter.id,
    habitCompletions: {},
    worshipDayStarts: {},
  };
}

export function emptyAppState(partial?: Partial<AppState>): AppState {
  return {
    profile: null,
    completedLessonIds: [],
    earnedBadgeSlugs: [],
    sessions: [],
    quizAttempts: [],
    readNotificationIds: [],
    ...emptyHabitState(),
    ...partial,
  };
}

export function normalizeState(raw: Partial<AppState> | null | undefined): AppState {
  const habits = emptyHabitState();
  const fallbackPlan = starterWorshipPlan({
    time: raw?.habitTime || habits.habitTime,
    weekdays: Array.isArray(raw?.habitWeekdays)
      ? raw.habitWeekdays
      : habits.habitWeekdays,
    prayerIds: raw?.habitSelectedPrayerIds?.length
      ? raw.habitSelectedPrayerIds
      : habits.habitSelectedPrayerIds,
  });
  const worshipPlans = Array.isArray(raw?.worshipPlans)
    ? raw.worshipPlans
    : [fallbackPlan];
  const active =
    worshipPlans.find((plan) => plan.id === raw?.activeWorshipPlanId) ??
    worshipPlans[0];

  return emptyAppState({
    profile: raw?.profile ?? null,
    completedLessonIds: raw?.completedLessonIds ?? [],
    earnedBadgeSlugs: raw?.earnedBadgeSlugs ?? [],
    sessions: raw?.sessions ?? [],
    quizAttempts: raw?.quizAttempts ?? [],
    habitPlanMode: raw?.habitPlanMode ?? habits.habitPlanMode,
    habitSelectedPrayerIds: active?.prayerIds ?? habits.habitSelectedPrayerIds,
    habitTime: active?.time ?? habits.habitTime,
    habitWeekdays: active?.weekdays ?? habits.habitWeekdays,
    worshipPlans,
    activeWorshipPlanId: active?.id ?? "",
    habitCompletions: raw?.habitCompletions ?? {},
    worshipDayStarts:
      raw?.worshipDayStarts && typeof raw.worshipDayStarts === "object"
        ? raw.worshipDayStarts
        : {},
    readNotificationIds: Array.isArray(raw?.readNotificationIds)
      ? raw.readNotificationIds
      : [],
  });
}

export function readRawState(key: string): AppState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw) as Partial<AppState>);
  } catch {
    return null;
  }
}

export function loadState(userId?: string | null): AppState {
  if (typeof window === "undefined") {
    return emptyAppState();
  }
  const keyed = userId ? readRawState(storageKeyFor(userId)) : null;
  if (keyed) return keyed;
  const legacy =
    readRawState(STORAGE_KEY) ?? readRawState(LEGACY_STORAGE_KEY);
  if (legacy) return legacy;
  return emptyAppState();
}

export function saveState(state: AppState, userId?: string | null) {
  if (typeof window === "undefined") return;
  const key = storageKeyFor(userId ?? state.profile?.id);
  localStorage.setItem(key, JSON.stringify(state));
  // Keep legacy key in sync for the active session so older readers stay usable.
  if (!userId && !state.profile?.id) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}


