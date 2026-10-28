"use client";

import { useState } from "react";
import { PageHeader, Surface } from "@/components/ui/gamification-ui";
import { BellIcon } from "@/components/ui/icons";
import { PRAYER_DOCUMENTS, PRESET_HABIT_PRAYER_IDS } from "@/lib/prayers";
import { useAppStore } from "@/lib/store";
import type { WorshipPlan } from "@/lib/types";

const PLAN_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;

function formatClock(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function PlanCard({
  plan,
  applied,
  onApply,
  onEdit,
  onDelete,
}: {
  plan: WorshipPlan;
  applied?: boolean;
  onApply?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className={`worship-plan-card ${applied ? "is-active" : ""}`}>
      <button
        type="button"
        className="worship-plan-card__main"
        onClick={onApply}
        disabled={!onApply}
      >
        <div className="worship-plan-summary__top">
          <span className="worship-plan-time">{formatClock(plan.time)}</span>
          <span className="worship-plan-card__days">
            {PLAN_DAYS.filter((_, day) => plan.weekdays.includes(day)).join(" ")}
          </span>
        </div>
        <strong>{plan.name}</strong>
        <small>
          Remind in-app {plan.notifyMinutes} min before ·{" "}
          {plan.prayerIds.length} prayers
          {applied ? " · Applied plan" : ""}
        </small>
      </button>
      <div className="worship-plan-actions">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="is-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default function WorshipPlansPage() {
  const {
    profile,
    worshipPlans,
    activeWorshipPlanId,
    createWorshipPlan,
    updateWorshipPlan,
    deleteWorshipPlan,
    setActiveWorshipPlan,
  } = useAppStore();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [time, setTime] = useState("06:30");
  const [notifyMinutes, setNotifyMinutes] = useState(5);
  const [weekdays, setWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [prayerIds, setPrayerIds] = useState<string[]>([
    ...PRESET_HABIT_PRAYER_IDS,
  ]);

  if (!profile) return null;

  const appliedPlan =
    worshipPlans.find((plan) => plan.id === activeWorshipPlanId) ?? null;
  const createdPlans = worshipPlans.filter((plan) => plan.id !== appliedPlan?.id);

  function toggleDay(day: number) {
    setWeekdays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  }

  function togglePrayer(prayerId: string) {
    setPrayerIds((current) =>
      current.includes(prayerId)
        ? current.filter((id) => id !== prayerId)
        : [...current, prayerId],
    );
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setTime("06:30");
    setNotifyMinutes(5);
    setWeekdays([0, 1, 2, 3, 4, 5, 6]);
    setPrayerIds([...PRESET_HABIT_PRAYER_IDS]);
  }

  function openCreate() {
    resetForm();
    setCreating(true);
  }

  function openEdit(plan: WorshipPlan) {
    setEditingId(plan.id);
    setName(plan.name);
    setTime(plan.time);
    setNotifyMinutes(plan.notifyMinutes);
    setWeekdays(plan.weekdays);
    setPrayerIds(plan.prayerIds);
    setCreating(true);
  }

  function savePlan() {
    if (!name.trim() || prayerIds.length === 0 || weekdays.length === 0) return;
    const input = { name, time, weekdays, notifyMinutes, prayerIds };
    if (editingId) updateWorshipPlan(editingId, input);
    else createWorshipPlan(input);
    setCreating(false);
    resetForm();
  }

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Worship plans"
        description="Create a plan and follow it in your habit tracker"
      />

      <div className="grid gap-2">
        <p className="worship-plan-label">Applied plan</p>
        {appliedPlan ? (
          <PlanCard
            plan={appliedPlan}
            applied
            onEdit={() => openEdit(appliedPlan)}
            onDelete={() => deleteWorshipPlan(appliedPlan.id)}
          />
        ) : (
          <Surface muted className="p-4 text-sm text-text-secondary">
            No plan is applied yet. Choose one from your created plans.
          </Surface>
        )}
      </div>

      <button
        type="button"
        className="gamify-button gamify-button--primary"
        onClick={() => (creating ? (setCreating(false), resetForm()) : openCreate())}
      >
        {creating ? "Close form" : "Create plan"}
      </button>

      {creating ? (
        <Surface className="grid gap-4 p-4">
          <label className="grid gap-1.5 text-sm">
            Plan name
            <input
              className="gamify-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Morning practice"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-sm">
              Time
              <input
                className="gamify-input"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              Remind in-app
              <select
                className="gamify-input"
                value={notifyMinutes}
                onChange={(event) => setNotifyMinutes(Number(event.target.value))}
              >
                {[0, 5, 10, 15, 30].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} min before
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="reference-habit-days" role="group" aria-label="Plan days">
            {PLAN_DAYS.map((label, day) => (
              <button
                key={label}
                type="button"
                className={weekdays.includes(day) ? "is-active" : ""}
                aria-pressed={weekdays.includes(day)}
                onClick={() => toggleDay(day)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            <p className="text-sm text-cream">Prayer documents</p>
            {PRAYER_DOCUMENTS.map((prayer) => (
              <label key={prayer.id} className="reference-habit-pick">
                <input
                  type="checkbox"
                  checked={prayerIds.includes(prayer.id)}
                  onChange={() => togglePrayer(prayer.id)}
                />
                <span>
                  <strong>{prayer.title_mm}</strong>
                  <small>{prayer.title_en}</small>
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            className="gamify-button gamify-button--primary"
            onClick={savePlan}
            disabled={!name.trim() || prayerIds.length === 0 || weekdays.length === 0}
          >
            {editingId ? "Save changes" : "Save plan"}
          </button>
        </Surface>
      ) : null}

      <div className="grid gap-2">
        <p className="worship-plan-label">Created plans</p>
        {createdPlans.length === 0 ? (
          <Surface muted className="p-4 text-sm text-text-secondary">
            Plans you create will show here. Apply one to use it on Home.
          </Surface>
        ) : (
          createdPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onApply={() => setActiveWorshipPlan(plan.id)}
              onEdit={() => openEdit(plan)}
              onDelete={() => deleteWorshipPlan(plan.id)}
            />
          ))
        )}
      </div>

      <p className="inline-flex items-center gap-2 text-xs text-text-tertiary">
        <BellIcon /> The applied plan is the checklist on Home.
      </p>
    </section>
  );
}
