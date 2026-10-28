"use client";

import {
  PageHeader,
  Surface,
  StatCard,
} from "@/components/ui/gamification-ui";
import { TrophyIcon } from "@/components/ui/icons";
import { TREE_THRESHOLDS } from "@/lib/gamification";
import { buildLeaderboard } from "@/lib/learning-tools";
import { useAppStore } from "@/lib/store";

export default function LeaderboardPage() {
  const { profile } = useAppStore();

  if (!profile) return null;

  const level = profile.tree_stage + 1;
  const board = buildLeaderboard({
    displayName: profile.display_name || "You",
    merit: profile.merit_points,
    level,
    streak: profile.streak_current,
  });
  const yourRank = board.findIndex((entry) => entry.isYou) + 1;
  const nextThreshold =
    TREE_THRESHOLDS[profile.tree_stage + 1] ??
    profile.merit_points + 50;

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Leaderboard"
        description="ကုသိုလ်အမှတ်ဖြင့် အတူတကွ ကြီးထွားကြပါစို့"
      />

      <Surface strong className="grid gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-tree/25 text-accent-merit">
            <TrophyIcon />
          </span>
          <div>
            <p className="text-sm text-text-tertiary">Your standing</p>
            <p className="font-display text-2xl text-cream">
              Rank #{yourRank}
            </p>
            <p className="text-sm text-accent-merit-soft">
              {profile.merit_points} Merit · Level {level}
            </p>
          </div>
        </div>
        <p className="text-xs text-text-secondary">
          {Math.max(0, nextThreshold - profile.merit_points)} XP to the next
          tree stage. Practice and learn to climb the board.
        </p>
      </Surface>

      <div className="gamify-stat-grid">
        <StatCard label="Your rank" value={`#${yourRank}`} />
        <StatCard label="Merit" value={profile.merit_points} />
        <StatCard label="Streak" value={profile.streak_current} />
      </div>

      <div className="grid gap-2">
        {board.map((entry, index) => (
          <div
            key={entry.id}
            className={`gamify-surface flex items-center gap-3 p-3.5 ${
              entry.isYou ? "gamify-surface--strong border-border-strong" : ""
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                index === 0
                  ? "bg-accent-merit/25 text-accent-merit"
                  : index === 1
                    ? "bg-accent-tree/25 text-accent-tree"
                    : index === 2
                      ? "bg-accent-streak/20 text-accent-streak"
                      : "bg-surface-muted text-text-secondary"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-cream">
                {entry.name}
                {entry.isYou ? " · You" : ""}
              </p>
              <p className="text-xs text-text-tertiary">
                Level {entry.level} · {entry.streak}-day streak
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-accent-merit">
                {entry.merit}
              </p>
              <p className="text-[0.62rem] text-text-tertiary">Merit</p>
            </div>
          </div>
        ))}
      </div>

      <Surface muted className="p-4 text-sm text-text-secondary">
        Leaderboard peers are sample companions for now. Your Merit, level, and
        streak update from your real practice.
      </Surface>
    </section>
  );
}
