"use client";

import { Surface } from "@/components/ui/gamification-ui";
import {
  DHAMMA_PLAYLIST,
  dhammaPlaylistWatchUrl,
} from "@/lib/dhamma-playlist";
import { openExternalUrl } from "@/lib/native";

/** Opens Dhamma audio externally — avoids fragile YouTube iframes in WKWebView. */
export function DhammaAudioCard() {
  return (
    <Surface className="mt-4 grid gap-3 p-4">
      <div>
        <h2 className="font-display text-xl text-cream">
          {DHAMMA_PLAYLIST.title_mm} · {DHAMMA_PLAYLIST.title}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {DHAMMA_PLAYLIST.description}
        </p>
      </div>
      <button
        type="button"
        className="gamify-button gamify-button--primary w-full"
        onClick={() => {
          void openExternalUrl(dhammaPlaylistWatchUrl());
        }}
      >
        YouTube တွင် နားဆင်ရန် · Open audio
      </button>
      <p className="text-xs text-text-tertiary">
        Audio opens in YouTube / Safari so practice stays reliable on iOS.
      </p>
    </Surface>
  );
}
