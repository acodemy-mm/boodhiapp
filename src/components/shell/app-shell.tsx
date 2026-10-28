"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AppNav } from "@/components/shell/app-nav";
import { ArrowLeftIcon } from "@/components/ui/icons";

const TAB_ROOTS = new Set([
  "/",
  "/auth",
  "/onboarding",
  "/home",
  "/learn",
  "/practice",
  "/event",
  "/profile",
]);

export function isDetailPath(pathname: string) {
  return !TAB_ROOTS.has(pathname);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const detail = isDetailPath(pathname);

  return (
    <>
      {detail ? <DetailBack /> : <AppNav />}
      <main
        className={`app-shell mx-auto min-h-dvh w-full px-4 ${
          detail
            ? "is-detail pb-10 pt-2 md:pb-10"
            : "pb-36 pt-6 md:pb-10 md:pt-8"
        }`}
      >
        {children}
      </main>
    </>
  );
}

function DetailBack() {
  const router = useRouter();
  const pathname = usePathname();
  const prayerDetail = /^\/prayers\/.+/.test(pathname);

  return (
    <div className="detail-topbar app-shell mx-auto w-full">
      <button
        type="button"
        className="detail-back"
        aria-label="Back"
        onClick={() => {
          if (prayerDetail) router.push("/prayers");
          else if (pathname === "/prayers") router.push("/home");
          else if (pathname === "/worship-play") router.push("/home");
          else router.back();
        }}
      >
        <ArrowLeftIcon />
      </button>
    </div>
  );
}
