import { LESSONS } from "./lessons";
import { MODULES } from "./modules";
import { QUOTES } from "./quotes";
import type { Quote } from "@/lib/types";

export { MODULES } from "./modules";
export { LESSONS } from "./lessons";
export { QUOTES } from "./quotes";
export { BADGES } from "./badges";
export { QUIZ } from "./quiz";

export function quoteOfDay(): Quote {
  const day = Math.floor(Date.now() / 86_400_000) % QUOTES.length;
  return QUOTES[day];
}

export function quoteEvery(intervalMs: number, now = Date.now()): Quote {
  const slot = Math.floor(now / intervalMs) % QUOTES.length;
  return QUOTES[slot];
}

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}

export function getLessonsForModule(moduleSlug: string) {
  return LESSONS.filter((l) => l.module_slug === moduleSlug).sort(
    (a, b) => a.order_index - b.order_index,
  );
}

export function getLesson(moduleSlug: string, lessonSlug: string) {
  return LESSONS.find(
    (l) => l.module_slug === moduleSlug && l.slug === lessonSlug,
  );
}
