"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Surface } from "@/components/ui/gamification-ui";
import { useAppStore } from "@/lib/store";

export default function AuthPage() {
  const { signIn, signUp, authConfigured } = useAppStore();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || password.length < 6) {
      setError("အီးမေးလ်နှင့် စကားဝှက် (အနည်းဆုံး ၆ လုံး) လိုအပ်သည်။");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password, name);
        router.push("/onboarding");
      } else {
        await signIn(email, password);
        router.push("/home");
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "ဝင်ရောက်မှု မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပါ။";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gamify-page animate-grow-in">
      <Link href="/" className="gamify-button gamify-button--quiet w-fit">
        ← ဗောဓိလမ်း
      </Link>
      <PageHeader
        title={mode === "signup" ? "အကောင့်ဖွင့်ရန်" : "ဝင်ရောက်ရန်"}
        description={
          authConfigured
            ? "Email and password · synced with Supabase Auth."
            : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable cloud auth. Local browser auth is active until then."
        }
      />

      <Surface className="p-4">
        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === "signup" && (
            <label className="grid gap-1.5 text-sm">
              <span className="text-text-secondary">အမည် · Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="gamify-input"
                placeholder="ယောဂီ"
              />
            </label>
          )}
          <label className="grid gap-1.5 text-sm">
            <span className="text-text-secondary">အီးမေးလ်</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="gamify-input"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-text-secondary">စကားဝှက်</span>
            <input
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gamify-input"
              minLength={6}
              required
            />
          </label>

          {error && <p className="text-sm text-accent-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="gamify-button gamify-button--primary w-full"
          >
            {loading
              ? "…"
              : mode === "signup"
                ? "ဖွင့်မည် · Sign up"
                : "ဝင်မည် · Sign in"}
          </button>
        </form>
      </Surface>

      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="gamify-button gamify-button--quiet w-full"
      >
        {mode === "signup"
          ? "အကောင့်ရှိပြီးသားလား? ဝင်ရောက်ရန်"
          : "အကောင့်မရှိသေးဘူးလား? ဖွင့်ရန်"}
      </button>
    </section>
  );
}
