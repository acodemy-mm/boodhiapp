"use client";

import { Capacitor } from "@capacitor/core";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function nativePlatform() {
  return Capacitor.getPlatform();
}

export async function configureNativeChrome() {
  if (!isNativeApp()) return;

  if (typeof document !== "undefined") {
    document.documentElement.classList.add("capacitor-native");
  }

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#1a2418" });
  } catch {
    /* plugin unavailable in browser */
  }

  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    /* ignore */
  }
}

export async function nativeHapticLight() {
  if (!isNativeApp()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* ignore */
  }
}

export async function nativeHapticSuccess() {
  if (!isNativeApp()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    /* ignore */
  }
}

export async function openExternalUrl(url: string) {
  if (isNativeApp()) {
    try {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url });
      return;
    } catch {
      /* fall through */
    }
  }
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
