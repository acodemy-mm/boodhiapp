export const MERIT = {
  lesson: 10,
  meditate: 15,
  beads: 5,
  quiz: 8,
} as const;

export const TREE_THRESHOLDS = [0, 50, 150, 400, 1000] as const;

export const BEAD_TARGET = 108;
export const MEDITATE_MIN_SECONDS = 5 * 60;

export function treeStageFromMerit(merit: number): number {
  let stage = 0;
  for (let i = 0; i < TREE_THRESHOLDS.length; i++) {
    if (merit >= TREE_THRESHOLDS[i]) stage = i;
  }
  return stage;
}

export function nextTreeThreshold(merit: number): number | null {
  const next = TREE_THRESHOLDS.find((t) => t > merit);
  return next ?? null;
}

export function todayISODate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function yesterdayISODate(d = new Date()): string {
  const y = new Date(d);
  y.setDate(y.getDate() - 1);
  return y.toISOString().slice(0, 10);
}

/** Apply daily streak after a practice event. Mutates conceptually — returns new fields. */
export function applyStreak(input: {
  last_practice_date: string | null;
  streak_current: number;
  streak_longest: number;
  now?: Date;
}): {
  last_practice_date: string;
  streak_current: number;
  streak_longest: number;
  isNewDay: boolean;
} {
  const now = input.now ?? new Date();
  const today = todayISODate(now);
  const yesterday = yesterdayISODate(now);

  if (input.last_practice_date === today) {
    return {
      last_practice_date: today,
      streak_current: input.streak_current,
      streak_longest: input.streak_longest,
      isNewDay: false,
    };
  }

  const streak_current =
    input.last_practice_date === yesterday ? input.streak_current + 1 : 1;
  const streak_longest = Math.max(input.streak_longest, streak_current);

  return {
    last_practice_date: today,
    streak_current,
    streak_longest,
    isNewDay: true,
  };
}

export function treeLabel(stage: number): { mm: string; en: string } {
  const labels = [
    { mm: "မျိုးစေ့", en: "Seed" },
    { mm: "ပျိုးပင်", en: "Sprout" },
    { mm: "ငယ်ပင်", en: "Sapling" },
    { mm: "ဗောဓိပင်", en: "Young Bodhi" },
    { mm: "ကြီးမားသော ဗောဓိပင်", en: "Great Bodhi" },
  ];
  return labels[Math.min(stage, labels.length - 1)];
}
