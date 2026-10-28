import type { ReactNode } from "react";
import {
  CheckIcon,
  FireIcon,
  LeafIcon,
  LockIcon,
} from "@/components/ui/icons";
import type { ActivityDay } from "@/lib/gamification/view";

export function PageHeader({
  eyebrow = "BODHI PATH",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="gamify-page-header">
      {eyebrow && <p className="gamify-kicker">{eyebrow}</p>}
      <div className="flex items-start justify-between gap-3">
        <h1 className="gamify-page-title">{title}</h1>
        {action}
      </div>
      {description && <p className="gamify-page-description">{description}</p>}
    </header>
  );
}

export function Surface({
  children,
  className = "",
  strong = false,
  muted = false,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  muted?: boolean;
  interactive?: boolean;
}) {
  return (
    <div
      className={[
        "gamify-surface",
        strong && "gamify-surface--strong",
        muted && "gamify-surface--muted",
        interactive && "gamify-surface--interactive",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="gamify-section-heading">
      <span>{children}</span>
      {action}
    </div>
  );
}

export function ProgressMeter({
  value,
  label,
  current,
  target,
  tone = "merit",
}: {
  value: number;
  label: string;
  current?: string;
  target?: string;
  tone?: "merit" | "streak" | "tree";
}) {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <div className="gamify-progress">
      {(current || target) && (
        <div className="gamify-progress__meta">
          <span>{current}</span>
          <span>{target}</span>
        </div>
      )}
      <div
        className="gamify-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <span
          className={`gamify-progress__fill gamify-progress__fill--${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function RewardPill({
  value,
  label = "Merit",
  prefix = "+",
}: {
  value: number;
  label?: string;
  prefix?: string;
}) {
  return (
    <span className="gamify-reward-pill">
      <LeafIcon />
      {prefix}
      {value} {label}
    </span>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="gamify-stat">
      <span className="gamify-stat__value">{value}</span>
      <span className="gamify-stat__label">{label}</span>
    </div>
  );
}

export function StreakCard({
  current,
  longest,
  week,
}: {
  current: number;
  longest: number;
  week: ActivityDay[];
}) {
  return (
    <Surface className="grid gap-4 p-4">
      <div className="flex items-center gap-3">
        <span className="gamify-badge__mark text-accent-streak">
          <FireIcon />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-cream">Daily Streak</p>
          <p className="text-xs text-text-tertiary">
            {current > 0
              ? "Keep the mindful rhythm going."
              : "A small step today is enough."}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold text-accent-streak">{current}</p>
          <p className="text-[0.62rem] text-text-tertiary">days</p>
        </div>
      </div>
      <div className="gamify-week" aria-label="Seven day activity">
        {week.map((day) => (
          <div
            key={day.key}
            className={`gamify-week__day ${day.active ? "is-active" : ""}`}
          >
            <span className="gamify-week__mark">
              {day.active ? <LeafIcon /> : day.date}
            </span>
            <span>{day.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-tertiary">
        Longest streak: {longest} days
      </p>
    </Surface>
  );
}

export function ProgressSteps({
  steps,
  currentIndex = 0,
}: {
  steps: { id: string; label: string; complete: boolean }[];
  currentIndex?: number;
}) {
  return (
    <div className="gamify-steps">
      {steps.map((step, index) => {
        const current = index === currentIndex;
        return (
          <div
            key={step.id}
            className={`gamify-week__day relative z-10 ${
              step.complete ? "is-active" : ""
            }`}
          >
            <span
              className={`gamify-week__mark ${
                current ? "ring-2 ring-accent-merit ring-offset-2 ring-offset-bg-deep" : ""
              }`}
            >
              {step.complete ? <CheckIcon /> : current ? <LeafIcon /> : <LockIcon />}
            </span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="gamify-empty">{children}</div>;
}
