"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  PageHeader,
  Surface,
  EmptyState,
} from "@/components/ui/gamification-ui";
import {
  BellIcon,
  FireIcon,
  LeafIcon,
  TrophyIcon,
} from "@/components/ui/icons";
import {
  buildLaunchNotifications,
  type NotificationIconType,
} from "@/lib/notifications";
import { useAppStore } from "@/lib/store";

function NotificationIcon({ type }: { type: NotificationIconType }) {
  if (type === "streak") return <FireIcon />;
  if (type === "level") return <LeafIcon />;
  if (type === "event") return <TrophyIcon />;
  return <BellIcon />;
}

export default function NotificationsPage() {
  const {
    profile,
    worshipPlans,
    readNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  const items = useMemo(
    () =>
      buildLaunchNotifications({
        worshipPlans,
        lastPracticeDate: profile?.last_practice_date,
      }),
    [worshipPlans, profile?.last_practice_date],
  );

  const openedRead = useRef(readNotificationIds);
  const [openUnread, setOpenUnread] = useState(
    () =>
      new Set(
        items
          .filter((item) => !openedRead.current.includes(item.id))
          .map((item) => item.id),
      ),
  );

  useEffect(() => {
    setOpenUnread(
      new Set(
        items
          .filter((item) => !openedRead.current.includes(item.id))
          .map((item) => item.id),
      ),
    );
  }, [items]);

  useEffect(() => {
    markAllNotificationsRead(items.map((item) => item.id));
  }, [items, markAllNotificationsRead]);

  if (!profile) return null;

  const openCount = openUnread.size;

  return (
    <section className="gamify-page animate-grow-in">
      <PageHeader
        title="Reminders"
        description={
          openCount
            ? `${openCount} in-app reminder${openCount === 1 ? "" : "s"}`
            : "You’re all caught up · in-app only"
        }
      />

      <p className="mb-3 text-sm text-text-secondary">
        Worship reminders appear here from your plan time. Browser push
        notifications are not enabled in this launch.
      </p>

      {items.length === 0 ? (
        <EmptyState>
          No reminders yet. Add a worship plan with notify minutes to see them
          here.
        </EmptyState>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            const unread = openUnread.has(item.id);
            const content = (
              <Surface
                strong={unread}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-tree/20 text-accent-merit">
                  <NotificationIcon type={item.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-cream">
                      {item.title}
                    </p>
                    {unread ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-danger" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                  <p className="mt-2 text-xs text-text-tertiary">{item.time}</p>
                </div>
              </Surface>
            );

            return item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className="notification-item"
                onClick={() => {
                  markNotificationRead(item.id);
                  setOpenUnread((prev) => {
                    if (!prev.has(item.id)) return prev;
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                  });
                }}
              >
                {content}
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                className="notification-item"
                onClick={() => {
                  markNotificationRead(item.id);
                  setOpenUnread((prev) => {
                    if (!prev.has(item.id)) return prev;
                    const next = new Set(prev);
                    next.delete(item.id);
                    return next;
                  });
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
