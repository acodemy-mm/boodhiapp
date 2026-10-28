"use client";

import { treeLabel } from "@/lib/gamification";

type Props = {
  stage: number;
  merit: number;
  className?: string;
};

export function BodhiTree({ stage, merit, className = "" }: Props) {
  const label = treeLabel(stage);
  const height = 40 + stage * 18;
  const canopy = 28 + stage * 14;
  const leaves = Math.min(5, stage + 1);

  return (
    <div className={`animate-grow-in flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 200 220"
        className="h-48 w-48 drop-shadow-lg md:h-56 md:w-56"
        aria-hidden
      >
        <defs>
          <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--bg-deep)" />
          </linearGradient>
          <radialGradient id="canopy" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--accent-tree)" />
            <stop offset="70%" stopColor="var(--leaf)" />
            <stop offset="100%" stopColor="var(--bg-mid)" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="200" rx="48" ry="8" fill="rgba(0,0,0,0.25)" />
        {stage === 0 ? (
          <>
            <ellipse cx="100" cy="175" rx="14" ry="10" fill="var(--gold)" />
            <path
              d="M100 175 Q95 150 100 130 Q105 150 100 175"
              fill="var(--leaf-bright)"
              className="animate-pulse-soft"
            />
          </>
        ) : (
          <>
            <rect
              x={96 - stage}
              y={200 - height}
              width={8 + stage * 2}
              height={height}
              rx={3}
              fill="url(#trunk)"
            />
            <ellipse
              cx="100"
              cy={200 - height - canopy * 0.15}
              rx={canopy}
              ry={canopy * 0.75}
              fill="url(#canopy)"
              className="animate-pulse-soft"
              style={{ animationDuration: `${2.2 + stage * 0.2}s` }}
            />
            {Array.from({ length: leaves }).map((_, i) => {
              const angle = (i / leaves) * Math.PI * 2 - Math.PI / 2;
              const cx = 100 + Math.cos(angle) * (canopy * 0.55);
              const cy = 200 - height - canopy * 0.15 + Math.sin(angle) * (canopy * 0.35);
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={10 + stage}
                  ry={6 + stage * 0.5}
                  fill="var(--leaf-bright)"
                  opacity={0.85}
                  transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
                />
              );
            })}
            {stage >= 3 && (
              <circle
                cx="118"
                cy={200 - height - 10}
                r="4"
                fill="var(--gold)"
              />
            )}
          </>
        )}
      </svg>
      <p className="font-display text-lg text-accent-merit-soft">{label.mm}</p>
      <p className="text-sm text-text-secondary">
        {label.en} · {merit} merit
      </p>
    </div>
  );
}
