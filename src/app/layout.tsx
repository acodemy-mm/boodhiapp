import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";
import { AppStoreProvider } from "@/lib/store";
import { AuthGate } from "@/components/shell/auth-gate";
import { AppShell } from "@/components/shell/app-shell";
import { NativeRuntime } from "@/components/shell/native-runtime";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  weight: ["400", "500", "700"],
  subsets: ["myanmar"],
  variable: "--font-myanmar",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ဗောဓိလမ်း · Bodhi Path",
  description:
    "Gamified Dhamma learning — Vipassana, Abhidhamma, daily practice, and Bodhi Tree growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="my"
      className={`${fraunces.variable} ${notoSans.variable} ${notoMyanmar.variable}`}
    >
      <body className="font-body antialiased">
        <AppStoreProvider>
          <NativeRuntime />
          <AuthGate>
            <AppShell>{children}</AppShell>
          </AuthGate>
        </AppStoreProvider>
      </body>
    </html>
  );
}
