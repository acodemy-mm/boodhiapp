"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  configureNativeChrome,
  isNativeApp,
} from "@/lib/native";
import {
  listenForNativeNotificationTaps,
  syncNativeWorshipReminders,
} from "@/lib/native/notifications";

/** Boots Capacitor chrome + local notification sync when running in the iOS shell. */
export function NativeRuntime() {
  const router = useRouter();
  const { ready, worshipPlans } = useAppStore();

  useEffect(() => {
    void configureNativeChrome();
  }, []);

  useEffect(() => {
    if (!ready || !isNativeApp()) return;
    void syncNativeWorshipReminders(worshipPlans);
  }, [ready, worshipPlans]);

  useEffect(() => {
    let dispose: () => void = () => {};
    void listenForNativeNotificationTaps((href) => {
      router.push(href);
    }).then((cleanup) => {
      dispose = cleanup;
    });
    return () => dispose();
  }, [router]);

  return null;
}
