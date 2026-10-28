import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({
  children,
  className,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={["h-5 w-5 shrink-0", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4.2 1.5 5.5 1.5 5.5H5s1.5-1.3 1.5-5.5Z" />
      <path d="M10 18.2a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19.4 4.6C11 4.6 6.1 8 6.1 13.4c0 3.1 2 5.1 4.8 5.1 5.1 0 8.5-4.8 8.5-13.9Z" />
      <path d="M5 20c2.1-4.4 5.1-7.3 9.1-9.1" />
    </Icon>
  );
}

export function SproutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20V10" />
      <path d="M12 12C8.5 12 6 9.8 6 6.5c3.7-.1 6 1.5 6 5.5Z" />
      <path d="M12 10c.2-3.2 2.2-5.2 5.8-5.3.1 3.4-1.8 5.7-5.8 5.3Z" />
      <path d="M8 20h8" />
    </Icon>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8v4.6a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5.5v1.5A3.5 3.5 0 0 0 9 11" />
      <path d="M16 6h2.5v1.5A3.5 3.5 0 0 1 15 11" />
      <path d="M12 12.6V17M8.5 20h7M10 17h4" />
    </Icon>
  );
}

export function FireIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12.2 21c3.5 0 6-2.4 6-5.9 0-2.5-1.3-4.7-3.3-6.9-.1 2.1-1 3.2-2 3.8.3-3.3-1.1-6.4-4.2-8.8.2 3.8-2.6 5.9-2.6 9.8C6.1 17.8 8.5 21 12.2 21Z" />
      <path d="M12 20c-1.7-.6-2.7-1.8-2.7-3.5 0-1.1.6-2.1 1.8-3.4.1 1 .5 1.7 1.3 2.1.4-.6.7-1.1.7-2 1.2 1.1 1.7 2.1 1.7 3.2 0 1.8-1 3-2.8 3.6Z" fill="currentColor" stroke="none" opacity=".65" />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 6 9 6-9 6V6Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function RestartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 12a7 7 0 1 1-2.1-5" />
      <path d="M19 4v4h-4" />
    </Icon>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 12H6M11 6l-6 6 6 6" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6.5 12.5 3.6 3.6 7.4-8" />
    </Icon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="6.5" y="10" width="11" height="9" rx="1.5" />
      <path d="M9 10V7.5a3 3 0 0 1 6 0V10" />
    </Icon>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 5.8A1.8 1.8 0 0 1 6.8 4H12v15H6.8A1.8 1.8 0 0 1 5 17.2V5.8Z" />
      <path d="M12 4h5.2A1.8 1.8 0 0 1 19 5.8v11.4a1.8 1.8 0 0 1-1.8 1.8H12" />
    </Icon>
  );
}

export function StoryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4.5h8.5A2.5 2.5 0 0 1 18 7v12.2l-3.2-1.6L12 19l-2.8-1.4L6 19.2V7A2.5 2.5 0 0 1 8.5 4.5" />
      <path d="M9.2 9h5.6M9.2 12h5.6M9.2 15h3.4" />
    </Icon>
  );
}
