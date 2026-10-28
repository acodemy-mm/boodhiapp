import { BADGES, LESSONS } from "@/lib/content";
import {
  TREE_THRESHOLDS,
  nextTreeThreshold,
  treeLabel,
  treeStageFromMerit,
} from "./rules";
import type {
  Profile,
  PracticeSession,
  QuizAttempt,
} from "@/lib/types";

export type ActivityDay = {
  key: string;
  label: string;
  date: number;
  active: boolean;
  today: boolean;
};

export type BadgeStatus = (typeof BADGES)[number] & {
  earned: boolean;
};

export type GamificationSnapshot = {
  level: number;
  stage: number;
  merit: number;
  currentThreshold: number;
  nextThreshold: number | null;
  meritIntoLevel: number;
  meritToNext: number;
  progressPercent: number;
  isMaxLevel: boolean;
  tree: ReturnType<typeof treeLabel>;
  currentStreak: number;
  longestStreak: number;
  todayActive: boolean;
  week: ActivityDay[];
  completedLessonCount: number;
  lessonTotal: number;
  practiceSessionCount: number;
  quizAttemptCount: number;
  dailySteps: {
    id: string;
    label: string;
    complete: boolean;
  }[];
  badges: BadgeStatus[];
};

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "narrow" }).format(date);
}

function eventDateKeys(
  sessions: PracticeSession[],
  quizAttempts: QuizAttempt[],
): Set<string> {
  return new Set(
    [...sessions, ...quizAttempts].map((event) =>
      localDateKey(new Date(event.created_at)),
    ),
  );
}

export function createGamificationSnapshot(input: {
  profile: Profile | null;
  completedLessonIds: string[];
  earnedBadgeSlugs: string[];
  sessions: PracticeSession[];
  quizAttempts: QuizAttempt[];
  now?: Date;
}): GamificationSnapshot | null {
  if (!input.profile) return null;

  const now = input.now ?? new Date();
  const todayKey = localDateKey(now);
  const merit = input.profile.merit_points;
  const stage = treeStageFromMerit(merit);
  const currentThreshold = TREE_THRESHOLDS[stage] ?? 0;
  const nextThreshold = nextTreeThreshold(merit);
  const isMaxLevel = nextThreshold === null;
  const meritIntoLevel = Math.max(0, merit - currentThreshold);
  const levelSpan = nextThreshold
    ? Math.max(1, nextThreshold - currentThreshold)
    : 1;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.max(0, (meritIntoLevel / levelSpan) * 100));
  const dates = eventDateKeys(input.sessions, input.quizAttempts);
  if (input.profile.last_practice_date) {
    dates.add(input.profile.last_practice_date);
  }

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = localDateKey(date);
    return {
      key,
      label: dayLabel(date),
      date: date.getDate(),
      active: dates.has(key),
      today: key === todayKey,
    };
  });

  const todayActive = dates.has(todayKey);
  const todayPractice = [...input.sessions].some(
    (session) => localDateKey(new Date(session.created_at)) === todayKey,
  );
  const todayExam = [...input.quizAttempts].some(
    (attempt) => localDateKey(new Date(attempt.created_at)) === todayKey,
  );
  const completedLessonCount = input.completedLessonIds.length;

  return {
    level: stage + 1,
    stage,
    merit,
    currentThreshold,
    nextThreshold,
    meritIntoLevel,
    meritToNext: nextThreshold ? Math.max(0, nextThreshold - merit) : 0,
    progressPercent,
    isMaxLevel,
    tree: treeLabel(stage),
    currentStreak: input.profile.streak_current,
    longestStreak: input.profile.streak_longest,
    todayActive,
    week,
    completedLessonCount,
    lessonTotal: LESSONS.length,
    practiceSessionCount: input.sessions.length,
    quizAttemptCount: input.quizAttempts.length,
    dailySteps: [
      { id: "learn", label: "Learn", complete: completedLessonCount > 0 },
      { id: "practice", label: "Practice", complete: todayPractice },
      { id: "exam", label: "Exam", complete: todayExam },
      { id: "review", label: "Review", complete: todayActive },
      { id: "grow", label: "Grow", complete: merit > 0 },
    ],
    badges: BADGES.map((badge) => ({
      ...badge,
      earned: input.earnedBadgeSlugs.includes(badge.slug),
    })),
  };
}
