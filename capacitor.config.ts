import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor loads the hosted Next.js app in WKWebView.
 * Set CAPACITOR_SERVER_URL or NEXT_PUBLIC_APP_URL to your deployed HTTPS origin.
 * For local device testing against `next dev`, use http://YOUR_LAN_IP:3000
 * and keep cleartext enabled only in that case.
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  "https://bodhi-path.vercel.app";

const isHttp = serverUrl.startsWith("http://");

const config: CapacitorConfig = {
  appId: "com.bodhipath.app",
  appName: "Bodhi Path",
  webDir: "capacitor-www",
  backgroundColor: "#1a2418",
  server: {
    ...(serverUrl
      ? {
          url: serverUrl,
          cleartext: isHttp,
        }
      : {}),
    allowNavigation: [
      "*.supabase.co",
      "*.youtube.com",
      "*.youtu.be",
      "*.googlevideo.com",
      "youtube.com",
      "youtu.be",
    ],
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Bodhi Path",
    backgroundColor: "#1a2418",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#1a2418",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1a2418",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_bodhi",
      iconColor: "#c4a35a",
    },
  },
};

export default config;
