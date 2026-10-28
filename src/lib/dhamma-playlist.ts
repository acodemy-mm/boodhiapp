/**
 * Dhamma audio (YouTube).
 * Opens externally in the Capacitor iOS shell via Browser plugin.
 * Source: https://youtu.be/KgO4igk6XzQ
 */
export const DHAMMA_PLAYLIST = {
  title: "Dhamma Audio",
  title_mm: "တရားနာရန်",
  description:
    "Open Dhamma audio in YouTube while you sit. The meditation timer stays in-app as the primary practice.",
  videoId: "KgO4igk6XzQ",
  url: "https://youtu.be/KgO4igk6XzQ",
} as const;

export function dhammaPlaylistWatchUrl(videoId = DHAMMA_PLAYLIST.videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
