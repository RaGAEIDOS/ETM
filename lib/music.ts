/**
 * Lofi music layer: sources, storage and shared constants.
 *
 * Three sources only:
 * - `lofi`    — the official Lofi Girl live stream (privacy-enhanced
 *               youtube-nocookie.com embed controlled through postMessage,
 *               click-to-load facade, no requests before the click).
 * - `spotify` — the official study playlist, compact 80px embed.
 * - `off`     — no music (ambient sounds are a separate layer).
 *
 * Per-theme volume: the slider value is stored per theme, with a sensible
 * default for each palette (cozy is a little louder, terminal quieter).
 */

import type { ThemeId } from "./theme";

export type MusicSource = "off" | "lofi" | "spotify";

export const MUSIC_SOURCES: readonly MusicSource[] = [
  "off",
  "lofi",
  "spotify",
] as const;

export const MUSIC_SOURCE_KEY = "etm-music-source-v1";
export const MUSIC_VOLUME_KEY = "etm-music-volume-v1";
export const MUSIC_QUIZ_MUTE_KEY = "etm-music-quiz-mute-v1";
export const COZY_TIP_KEY = "etm-cozy-lofi-tip-v1";

/**
 * Official Lofi Girl live streams, all verified embeddable. The first entry is
 * the primary study stream; the rest are the channel's other official radios,
 * used only when the primary is offline or the embed reports an error.
 *
 * A live stream eventually ends when its broadcast stops, so this list is a
 * resilience chain rather than a permanent guarantee: refresh it from
 * https://www.lofigirl.com when the channel rotates its streams.
 */
export const LOFI_LIVE_VIDEO_ID = "rFZHOHl-L8A";
export const LOFI_FALLBACK_VIDEO_IDS = [
  "JD-kMIpDfnY", // sleep radio
  "E2vONfzoyRI", // jazz radio
  "4xDzrJKXOOY", // synthwave radio
  "3PFJ9SETS4M", // house radio
  "4t4AQ15yj1M", // christmas radio
] as const;
export const LOFI_LIVE_VIDEO_IDS = [
  LOFI_LIVE_VIDEO_ID,
  ...LOFI_FALLBACK_VIDEO_IDS,
] as const;
export const LOFI_CHANNEL_URL = "https://www.youtube.com/@LofiGirl";
export const LOFI_LIVE_URL = `https://www.youtube.com/watch?v=${LOFI_LIVE_VIDEO_ID}`;

/**
 * Privacy-enhanced embed URL for the postMessage player API.
 *
 * `enablejsapi=1` makes the embed answer `listening` handshakes, and `origin`
 * lets it validate messages from this site.
 *
 * `autoplay` is deliberately 0: an unmuted autoplay request makes YouTube
 * withhold the player API handshake until the browser grants playback, which
 * looks like a hang and breaks the timer-follow logic. The facade click mounts
 * this embed, then playback starts with a `playVideo` command once the player
 * reports `onReady`.
 */
export function lofiEmbedUrl(videoId: string, origin?: string): string {
  const params = new URLSearchParams({
    enablejsapi: "1",
    autoplay: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    controls: "1",
  });
  if (origin) params.set("origin", origin);
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
export const LOFI_UPLOADS_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=UUSJ4gkVC6NrvII8umztf0Ow";
export const LOFI_RADIOS_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PL6NdkXsPL07Il2hEQGcLI4dg_LTg7xA2L";

export const SPOTIFY_PLAYLIST_ID = "2lbGxqs4WSMxVmMuIsolNr";
export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
export const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator`;

export type MusicVolumes = Partial<Record<ThemeId, number>>;

export const DEFAULT_MUSIC_VOLUME = 30;

const THEME_DEFAULT_VOLUME: Record<ThemeId, number> = {
  light: 30,
  dark: 30,
  terminal: 25,
  cozy: 40,
};

export function isMusicSource(value: unknown): value is MusicSource {
  return (
    typeof value === "string" &&
    (MUSIC_SOURCES as readonly string[]).includes(value)
  );
}

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_MUSIC_VOLUME;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function defaultVolumeFor(theme: ThemeId): number {
  return THEME_DEFAULT_VOLUME[theme] ?? DEFAULT_MUSIC_VOLUME;
}

/** Stored source, or null when the visitor has never picked one. */
export function readStoredSource(): MusicSource | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MUSIC_SOURCE_KEY);
    return isMusicSource(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function persistSource(source: MusicSource): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUSIC_SOURCE_KEY, source);
  } catch {
    /* storage blocked */
  }
}

export function readStoredVolumes(): MusicVolumes {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MUSIC_VOLUME_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: MusicVolumes = {};
    (["light", "dark", "terminal", "cozy"] as const).forEach((theme) => {
      const value = parsed?.[theme];
      if (typeof value === "number" && Number.isFinite(value)) {
        out[theme] = clampVolume(value);
      }
    });
    return out;
  } catch {
    return {};
  }
}

export function persistVolumes(volumes: MusicVolumes): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUSIC_VOLUME_KEY, JSON.stringify(volumes));
  } catch {
    /* storage blocked */
  }
}

export function volumeForTheme(
  theme: ThemeId,
  volumes: MusicVolumes
): number {
  const stored = volumes[theme];
  return typeof stored === "number" ? clampVolume(stored) : defaultVolumeFor(theme);
}

/** Mute during quizzes defaults to on — it is the least surprising choice. */
export function readQuizMute(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(MUSIC_QUIZ_MUTE_KEY);
    return raw === null ? true : raw === "1";
  } catch {
    return true;
  }
}

export function persistQuizMute(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUSIC_QUIZ_MUTE_KEY, value ? "1" : "0");
  } catch {
    /* storage blocked */
  }
}

export function readCozyTipSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(COZY_TIP_KEY) === "1";
  } catch {
    return true;
  }
}

export function markCozyTipSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COZY_TIP_KEY, "1");
  } catch {
    /* storage blocked */
  }
}

/** mm:ss (clamped at zero). */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
