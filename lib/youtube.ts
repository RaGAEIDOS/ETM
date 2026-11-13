/**
 * YouTube URL helpers shared by server and client components.
 *
 * Thumbnails always use the public i.ytimg.com pattern (hqdefault, then
 * mqdefault as a fallback) — images are never re-hosted. This module has no
 * client hooks on purpose, so server components can call the helpers at render
 * time (functions exported from a "use client" module are client references).
 */

export const YOUTUBE_THUMBNAIL_BASE = "https://i.ytimg.com/vi";

/** hqdefault, then mqdefault when the HQ frame is missing. */
export function youtubeThumbnailUrl(youtubeId: string, quality: "hq" | "mq" = "hq"): string {
  return `${YOUTUBE_THUMBNAIL_BASE}/${youtubeId}/${quality}default.jpg`;
}

/** Extracts the video id from a watch/embed URL, for data files that only keep the URL. */
export function youtubeIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}
