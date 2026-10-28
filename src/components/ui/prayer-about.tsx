"use client";

import { useState } from "react";
import { StoryIcon } from "@/components/ui/icons";

export function PrayerAbout({ about }: { about: string }) {
  const [open, setOpen] = useState(false);
  if (!about.trim()) return null;

  return (
    <div className={`prayer-about ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="prayer-about__trigger"
        aria-expanded={open}
        aria-controls="prayer-about-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <StoryIcon />
        <span>Story</span>
      </button>
      {open ? (
        <div className="prayer-about__panel" id="prayer-about-panel">
          <p>{about}</p>
        </div>
      ) : null}
    </div>
  );
}
