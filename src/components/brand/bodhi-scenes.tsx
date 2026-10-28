import type { SVGProps } from "react";

type SceneProps = SVGProps<SVGSVGElement>;

/** Inline lesson illustration — no remote image dependency. */
export function BodhiScene(props: SceneProps) {
  const id = "lesson";

  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label="Bodhi Path lesson illustration"
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--bg-mid)" />
          <stop offset="0.5" stopColor="var(--leaf)" />
          <stop offset="1" stopColor="var(--accent-tree)" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--leaf)" />
          <stop offset="1" stopColor="var(--bg-deep)" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent-tree)" />
          <stop offset="1" stopColor="var(--leaf-bright)" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--gold-soft)" stopOpacity=".95" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <rect width="480" height="300" fill={`url(#${id}-sky)`} />
      <circle cx="350" cy="54" r="92" fill={`url(#${id}-sun)`} opacity=".75" />

      {/* misty forest and a small waterfall */}
      <path d="M0 125 45 88l30 24 42-48 43 45 40-56 55 73 42-38 48 42 38-26 97 75v95H0Z" fill="var(--bg-deep)" opacity=".55" />
      <path d="M303 55c-8 37-11 81-3 130h30c-7-49-4-93-9-130Z" fill="var(--cream)" opacity=".35" filter={`url(#${id}-blur)`} />
      <path d="M310 50c-5 40-5 86 1 130h16c-5-45-2-92-6-130Z" fill="var(--cream)" opacity=".55" />
      <path d="M0 185c56-18 92-15 132 11 35 22 77 22 117 3 38-19 89-17 134 8 33 18 60 22 97 13v80H0Z" fill={`url(#${id}-ground)`} />
      <path d="M0 232c54-22 98-15 148 14 49 28 87 24 129 4 52-25 102-15 143 10 20 12 39 17 60 18v22H0Z" fill="var(--bg-deep)" opacity=".72" />

      {/* foreground foliage */}
      <g fill="var(--bg-mid)" opacity=".96">
        <path d="M0 210c11-43 34-62 71-67-1 40-19 70-71 88Z" />
        <path d="M34 236c8-36 28-55 61-62 3 38-16 63-61 78Z" />
        <path d="M480 205c-18-48-43-65-78-68 4 40 23 67 78 85Z" />
        <path d="M443 244c-9-37-29-54-61-60-1 36 20 61 61 75Z" />
      </g>

      <g>
        {/* lesson mascot sitting on a rock with a book */}
        <ellipse cx="292" cy="252" rx="91" ry="17" fill="var(--bg-deep)" opacity=".45" />
        <path d="M218 252c8-44 35-57 74-55 39 2 62 23 70 55Z" fill="var(--leaf)" />
        <path d="M230 202c5-34 23-54 55-55 34-2 56 18 61 54-17 17-96 16-116 1Z" fill={`url(#${id}-body)`} />
        <circle cx="280" cy="156" r="38" fill={`url(#${id}-body)`} />
        <path d="M280 118c-5-25 11-37 27-44 9 18 4 34-8 45" fill="var(--leaf-bright)" />
        <path d="M284 111c10-14 19-18 32-19-4 16-14 23-30 26" fill="var(--accent-tree)" />
        <ellipse cx="267" cy="157" rx="4" ry="6" fill="var(--bg-deep)" />
        <ellipse cx="294" cy="157" rx="4" ry="6" fill="var(--bg-deep)" />
        <path d="M277 170c4 5 9 5 13 0" stroke="var(--leaf)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M227 211c-20 14-31 28-31 42h74c-3-25-17-38-43-42Z" fill="var(--bg-soft)" />
        <path d="M197 233h74l-4 18h-79Z" fill="var(--gold)" />
        <path d="m204 235 31-15 31 15-31 14Z" fill="var(--cream)" />
        <path d="m235 220 1 28M204 235l31 14 31-14" stroke="var(--gold-soft)" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}
