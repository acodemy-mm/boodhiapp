"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  EmptyState,
  PageHeader,
  SectionHeading,
  StreakCard,
  Surface,
  StatCard,
} from "@/components/ui/gamification-ui";
import { useAppStore } from "@/lib/store";

function goalLabel(goal: string | null) {
  if (goal === "meditation") return "တရားထိုင်ခြင်း · Meditation";
  if (goal === "both") return "နေ့စဉ် လေ့ကျင့်မှု · Daily practice";
  if (goal === "exam") return "စာမေးပွဲ";
  return "—";
}

function sessionLabel(session: {
  type: string;
  worship_plan_name?: string;
}) {
  if (session.type === "meditate") return "တရားထိုင် · Meditate";
  if (session.type === "worship")
    return session.worship_plan_name || "Worship";
  return "Practice";
}

export default function ProfilePage() {
  const {
    profile,
    sessions,
    signOut,
    updateDisplayName,
  } = useAppStore();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(profile?.display_name ?? "");
  }, [profile?.display_name]);

  if (!profile) return null;

  const practiceSessions = sessions
    .filter((session) => session.type === "meditate" || session.type === "worship")
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const recent = practiceSessions.slice(0, 12);
  const meditateCount = practiceSessions.filter((s) => s.type === "meditate").length;
  const worshipCount = practiceSessions.filter((s) => s.type === "worship").length;

  async function onSaveName(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateDisplayName(name);
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save name");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="gamify-page section-page animate-grow-in">
      <PageHeader
        title="ပရိုဖိုင် · Profile"
        description="Account information · Tracker & History"
      />

      <Surface strong className="grid gap-4 p-5">
        <div>
          <p className="text-xl text-cream">{profile.display_name}</p>
          <p className="text-sm text-text-tertiary">{profile.email}</p>
          <p className="mt-1 text-sm text-accent-merit-soft">
            ရည်မှန်းချက်: {goalLabel(profile.goal)}
          </p>
        </div>

        <form onSubmit={onSaveName} className="grid gap-2">
          <label className="grid gap-1.5 text-sm">
            <span className="text-text-secondary">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="gamify-input"
              maxLength={48}
            />
          </label>
          {error ? <p className="text-sm text-accent-danger">{error}</p> : null}
          {message ? (
            <p className="text-sm text-accent-merit-soft">{message}</p>
          ) : null}
          <button
            type="submit"
            disabled={saving || name.trim() === profile.display_name}
            className="gamify-button gamify-button--secondary w-fit"
          >
            {saving ? "…" : "Update name"}
          </button>
        </form>
      </Surface>

      <div className="gamify-stat-grid">
        <StatCard label="Streak" value={profile.streak_current} />
        <StatCard label="Meditate" value={meditateCount} />
        <StatCard label="Worship" value={worshipCount} />
      </div>

      <StreakCard
        current={profile.streak_current}
        longest={profile.streak_longest}
        week={Array.from({ length: 7 }, (_, index) => {
          const today = new Date().getDay();
          return {
            key: String(index),
            label: ["S", "M", "T", "W", "T", "F", "S"][index] ?? "",
            date: index + 1,
            active: index < Math.min(7, profile.streak_current),
            today: index === today,
          };
        })}
      />

      <section id="history" className="grid scroll-mt-24 gap-3">
        <SectionHeading>မှတ်တမ်း · History</SectionHeading>
        {recent.length === 0 ? (
          <EmptyState>
            မရှိသေးပါ — တရားထိုင်ခြင်း သို့မဟုတ် worship ပြီးဆုံးပါ။
          </EmptyState>
        ) : (
          <div className="grid gap-2">
            {recent.map((session) => (
              <Surface
                key={session.id}
                muted
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <span className="text-sm text-cream">
                  {sessionLabel(session)}
                </span>
                <span className="text-right text-xs text-text-tertiary">
                  <span className="block">
                    {session.type === "worship"
                      ? "Completed"
                      : session.duration_sec
                        ? `${Math.round(session.duration_sec / 60)} min`
                        : `+${session.merit_awarded} merit`}
                  </span>
                  <span className="block">
                    {new Date(session.created_at).toLocaleString()}
                  </span>
                </span>
              </Surface>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2 pt-2">
        <Link href="/home" className="gamify-button gamify-button--secondary">
          အိမ်သို့
        </Link>
        <button
          type="button"
          onClick={() => {
            void signOut().then(() => {
              window.location.href = "/";
            });
          }}
          className="gamify-button gamify-button--quiet"
        >
          ထွက်ရန် · Sign out
        </button>
      </div>
    </section>
  );
}
