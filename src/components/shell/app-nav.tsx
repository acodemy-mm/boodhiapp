"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { ReactNode } from "react";

/** Shared nav icon — thin stroke, design-system scale */
function NavIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <NavIcon className={className}>
      <path d="M5 11.5 12 5l7 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-3v5H6a1 1 0 0 1-1-1v-7.5Z" />
    </NavIcon>
  );
}

function IconPractice({ className }: { className?: string }) {
  return (
    <NavIcon className={className}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.25" />
    </NavIcon>
  );
}

function IconProfile({ className }: { className?: string }) {
  return (
    <NavIcon className={className}>
      <circle cx="12" cy="9" r="3" />
      <path d="M6 18.5c1.4-2.4 3.4-3.5 6-3.5s4.6 1.1 6 3.5" />
    </NavIcon>
  );
}

const LINKS: {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}[] = [
  { href: "/home", label: "Home", icon: IconHome },
  { href: "/practice", label: "Practice", icon: IconPractice },
  { href: "/profile", label: "Profile", icon: IconProfile },
];

export function AppNav() {
  const pathname = usePathname();
  const { profile } = useAppStore();

  if (!profile?.onboarding_complete) return null;
  if (pathname === "/" || pathname === "/auth" || pathname === "/onboarding") {
    return null;
  }

  return (
    <>
      {/* Desktop top bar — text-first, small icons */}
      <header className="sticky top-0 z-40 hidden border-b border-mist bg-bg-deep/80 backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link
            href="/home"
            className="font-display text-xl tracking-wide text-gold-soft"
          >
            ဗောဓိလမ်း
          </Link>
          <nav className="flex gap-0.5">
            {LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius)] px-3 py-2 text-sm transition ${
                    active
                      ? "bg-leaf/35 text-cream"
                      : "text-cream/65 hover:bg-mist hover:text-cream"
                  }`}
                >
                  <Icon className="nav-icon nav-icon--desktop opacity-80" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav — compact icons above English label */}
      <nav className="mobile-tab-nav safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-bg-deep/95 backdrop-blur-md md:hidden">
        <ul className="mx-auto flex max-w-lg justify-between px-1">
          {LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1 text-center text-[10px] tracking-wide ${
                    active ? "text-gold-soft" : "text-cream/50"
                  }`}
                >
                  <Icon
                    className={`nav-icon nav-icon--mobile ${
                      active ? "opacity-100" : "opacity-70"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
