"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { isNativeApp } from "@/lib/native";

const PUBLIC = new Set(["/", "/auth"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, profile } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const isPublic = PUBLIC.has(pathname);

    // In the Capacitor shell, skip the marketing landing and enter the app flow.
    if (isNativeApp() && pathname === "/") {
      router.replace(
        profile
          ? profile.onboarding_complete
            ? "/home"
            : "/onboarding"
          : "/auth",
      );
      return;
    }

    if (!profile && !isPublic) {
      router.replace("/auth");
      return;
    }

    if (profile && pathname === "/auth") {
      router.replace(
        profile.onboarding_complete ? "/home" : "/onboarding",
      );
      return;
    }

    if (
      profile &&
      !profile.onboarding_complete &&
      pathname !== "/onboarding" &&
      !isPublic
    ) {
      router.replace("/onboarding");
      return;
    }

    if (profile?.onboarding_complete && pathname === "/onboarding") {
      router.replace("/home");
    }
  }, [ready, profile, pathname, router]);

  if (!ready) {
    return (
      <div className="app-shell flex min-h-dvh items-center justify-center px-4">
        <div className="gamify-surface w-full p-5 text-center text-sm text-accent-merit-soft">
          ဗောဓိလမ်း တင်နေသည်…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
