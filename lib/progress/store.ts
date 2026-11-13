"use client";

/**
 * ETM progress store — the only module components talk to.
 *
 * Storage layout (all keys live in localStorage on the device):
 *   etm-progress-v2          JSON ProgressFile { version: 2, events, settings }
 *   etm-progress-v2-migrated ISO timestamp of the one-time legacy import
 *   etm-english-notes-v1     JSON map videoId -> { text, updatedAt } (Phase 4)
 *   etm-cs50x-notes-v1       JSON map lectureId -> { text, updatedAt }
 *   etm-cs50x-certificate-v1 JSON { done: string[], updatedAt: string }
 *   etm-linux-notes-v1       JSON map videoId -> { text, updatedAt } (Linux)
 *
 * Legacy keys (etm-progress-v1, etm-progress-<uid>, etm-activity-days,
 * etm-focus-log) are READ ONCE during migration and never written again or
 * deleted, so the migration is reversible by hand.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_DAILY_GOAL_MINUTES,
  activityGrid,
  accuracyTrend,
  deriveProgress,
  emptyProgressFile,
  localDayKey,
  migrateLegacy,
  mergeEvents,
  parseProgressFile,
  serializeProgressFile,
  type DerivedProgress,
  type EventType,
  type ProgressEvent,
  type ProgressFile,
  type Track,
} from "./core";
import {
  ENGLISH_NOTES_KEY,
  deleteEnglishNotes,
  importEnglishNotes,
  loadEnglishNotes,
} from "../english-notes";
import {
  CS50X_NOTES_KEY,
  CS50X_CERT_KEY,
  deleteCs50xNotes,
  deleteCs50xCertificate,
  importCs50xNotes,
  loadCs50xNotes,
} from "../cs50x-notes";
import {
  LINUX_NOTES_KEY,
  deleteLinuxNotes,
  importLinuxNotes,
  loadLinuxNotes,
} from "../linux-notes";

const V2_KEY = "etm-progress-v2";
const MIGRATED_KEY = "etm-progress-v2-migrated";
const LEGACY_KEY = "etm-progress-v1";
const LEGACY_ACTIVITY_KEY = "etm-activity-days";
const LEGACY_FOCUS_KEY = "etm-focus-log";
const SESSION_KEY = "etm-auth-session-v1";
const USER_PREFIX = "etm-progress-";
const LASTSYNC_PREFIX = "etm-lastsync-";
const AUTH_CHANGE_EVENT = "etm-auth-change";
export const PROGRESS_CHANGE_EVENT = "etm-progress-change";

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStringArray(key: string): string[] {
  const v = readJson(key);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function readBooleanMap(key: string): Record<string, boolean> {
  const v = readJson(key);
  if (!v || typeof v !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (val === true) out[k] = true;
  }
  return out;
}

function currentUserId(): string | null {
  const v = readJson(SESSION_KEY) as { id?: unknown } | null;
  return v && typeof v.id === "string" && v.id ? v.id : null;
}

/** Merge every legacy boolean map we can find (guest + per-user copies). */
function legacyCombinedMap(): Record<string, boolean> {
  const combined: Record<string, boolean> = {};
  Object.assign(combined, readBooleanMap(LEGACY_KEY));
  const uid = currentUserId();
  if (uid) Object.assign(combined, readBooleanMap(`${USER_PREFIX}${uid}`));
  // Belt and braces: merge any other per-user map present on this device.
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(USER_PREFIX) && k !== `${USER_PREFIX}v1` && k !== `${USER_PREFIX}v2`) {
        Object.assign(combined, readBooleanMap(k));
      }
    }
  } catch {
    /* storage may be blocked */
  }
  return combined;
}

function readLegacyFocusLog(): Record<string, number> {
  const v = readJson(LEGACY_FOCUS_KEY);
  if (!v || typeof v !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    const n = Number(val);
    if (Number.isFinite(n) && n > 0) out[k] = n;
  }
  return out;
}

export function loadProgressFile(): ProgressFile {
  if (typeof window === "undefined") return emptyProgressFile();

  const rawV2 = (() => {
    try {
      return window.localStorage.getItem(V2_KEY);
    } catch {
      return null;
    }
  })();

  if (rawV2) {
    try {
      return parseProgressFile(JSON.parse(rawV2));
    } catch {
      // Never destroy data: park the unreadable file next to the live key.
      try {
        window.localStorage.setItem(`${V2_KEY}-corrupt-${Date.now()}`, rawV2);
      } catch {
        /* ignore */
      }
    }
  }

  // One-time migration from the pre-Phase-3 layout. Legacy keys are left
  // untouched so anyone can roll back by clearing etm-progress-v2.
  const events = migrateLegacy({
    map: legacyCombinedMap(),
    activityDays: readStringArray(LEGACY_ACTIVITY_KEY),
    focusLog: readLegacyFocusLog(),
  });
  const file: ProgressFile = {
    version: 2,
    events,
    settings: { dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES },
  };
  try {
    window.localStorage.setItem(V2_KEY, serializeProgressFile(file));
    window.localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
  } catch {
    /* storage may be blocked — the in-memory copy still works */
  }
  return file;
}

export function saveProgressFile(file: ProgressFile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(V2_KEY, serializeProgressFile(file));
  } catch {
    /* quota / blocked storage — keep the session running */
  }
  try {
    window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
  } catch {
    /* non-browser context */
  }
}

function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function trackEvent(
  track: Track,
  type: EventType,
  opts: {
    itemId?: string;
    topic?: string;
    payload?: Record<string, unknown>;
    at?: string;
  } = {}
): ProgressEvent | null {
  if (typeof window === "undefined") return null;
  const file = loadProgressFile();
  const event: ProgressEvent = {
    id: newEventId(),
    v: 2,
    track,
    type,
    at: opts.at ?? new Date().toISOString(),
    ...(opts.itemId !== undefined ? { itemId: opts.itemId } : {}),
    ...(opts.topic !== undefined ? { topic: opts.topic } : {}),
    ...(opts.payload !== undefined ? { payload: opts.payload } : {}),
  };
  file.events.push(event);
  saveProgressFile(file);
  return event;
}

/**
 * Upsert the latest video_progress event for (track, itemId). Playback
 * positions are saved every few seconds while watching; appending would
 * bury the log in near-identical rows. The event keeps its id, so merge
 * semantics stay "latest wins" and import/export remain idempotent.
 */
export function saveVideoProgress(
  track: Track,
  itemId: string,
  topic: string | undefined,
  payload: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const file = loadProgressFile();
  let found: ProgressEvent | undefined;
  for (let i = file.events.length - 1; i >= 0; i -= 1) {
    const e = file.events[i];
    if (e.track === track && e.type === "video_progress" && e.itemId === itemId) {
      found = e;
      break;
    }
  }
  const at = new Date().toISOString();
  if (found) {
    found.payload = payload;
    found.at = at;
    if (found.topic === undefined && topic) found.topic = topic;
  } else {
    file.events.push({
      id: newEventId(),
      v: 2,
      track,
      type: "video_progress",
      itemId,
      ...(topic !== undefined ? { topic } : {}),
      payload,
      at,
    });
  }
  saveProgressFile(file);
}

export function toggleCompletion(track: Track, itemId: string, topic?: string): boolean {
  if (typeof window === "undefined") return false;
  const file = loadProgressFile();
  const stats = deriveProgress(file.events);
  const done =
    track === "elzero"
      ? stats.doneVideoIds.includes(itemId)
      : track === "english"
        ? stats.doneEnglishVideoIds.includes(itemId)
        : track === "cs50x"
          ? stats.doneCs50xVideoIds.includes(itemId)
          : track === "linux"
            ? stats.doneLinuxVideoIds.includes(itemId)
            : stats.doneLessonIds.includes(itemId);
  trackEvent(track, done ? "lesson_uncompleted" : "lesson_completed", { itemId, topic });
  return !done;
}

export function isItemDone(file: ProgressFile, track: Track, itemId: string): boolean {
  const stats = deriveProgress(file.events);
  if (track === "elzero") return stats.doneVideoIds.includes(itemId);
  if (track === "english") return stats.doneEnglishVideoIds.includes(itemId);
  if (track === "cs50x") return stats.doneCs50xVideoIds.includes(itemId);
  if (track === "linux") return stats.doneLinuxVideoIds.includes(itemId);
  return stats.doneLessonIds.includes(itemId);
}

export function setDailyGoalMinutes(minutes: number): void {
  const file = loadProgressFile();
  const safe = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : DEFAULT_DAILY_GOAL_MINUTES;
  saveProgressFile({ ...file, settings: { dailyGoalMinutes: safe } });
}

// ---------------------------------------------------------------------------
// Privacy: export / import / delete
// ---------------------------------------------------------------------------

export function exportMyData(): string {
  const file = loadProgressFile();
  return JSON.stringify(
    {
      app: "etm",
      exportedAt: new Date().toISOString(),
      ...file,
      englishNotes: loadEnglishNotes(),
      cs50xNotes: loadCs50xNotes(),
      linuxNotes: loadLinuxNotes(),
    },
    null,
    2,
  );
}

export function importMyData(json: string): { ok: boolean; mergedEvents: number; error?: string } {
  try {
    const raw = JSON.parse(json) as unknown;
    // English + Linux notes ride along as optional extra sections.
    const notes = (raw as { englishNotes?: unknown } | null)?.englishNotes;
    if (notes && typeof notes === "object") importEnglishNotes(notes);
    // CS50x notes ride along the same way.
    const cs50xNotes = (raw as { cs50xNotes?: unknown } | null)?.cs50xNotes;
    if (cs50xNotes && typeof cs50xNotes === "object") importCs50xNotes(cs50xNotes);
    const linuxNotes = (raw as { linuxNotes?: unknown } | null)?.linuxNotes;
    if (linuxNotes && typeof linuxNotes === "object") importLinuxNotes(linuxNotes);
    const parsed = parseProgressFile(raw);
    const current = loadProgressFile();
    const merged = mergeEvents(current.events, parsed.events);
    const settings =
      parsed.settings.dailyGoalMinutes && parsed.settings.dailyGoalMinutes > 0
        ? parsed.settings
        : current.settings;
    saveProgressFile({ version: 2, events: merged, settings });
    return { ok: true, mergedEvents: merged.length - current.events.length };
  } catch {
    return { ok: false, mergedEvents: 0, error: "invalid-file" };
  }
}

/** Remove every learning-data key for this device. Keeps identity/UI prefs. */
export function deleteMyData(): void {
  if (typeof window === "undefined") return;
  const doomed: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (
        k &&
        (k === V2_KEY ||
          k === MIGRATED_KEY ||
          k === LEGACY_KEY ||
          k === LEGACY_ACTIVITY_KEY ||
          k === LEGACY_FOCUS_KEY ||
          k === ENGLISH_NOTES_KEY ||
          k === CS50X_NOTES_KEY ||
          k === CS50X_CERT_KEY ||
          k.startsWith(`${ENGLISH_NOTES_KEY}-corrupt-`) ||
          k.startsWith(`${CS50X_NOTES_KEY}-corrupt-`) ||
          k === LINUX_NOTES_KEY ||
          k.startsWith(`${LINUX_NOTES_KEY}-corrupt-`) ||
          k.startsWith(`${V2_KEY}-corrupt-`) ||
          k.startsWith(USER_PREFIX) ||
          k.startsWith(LASTSYNC_PREFIX))
      ) {
        doomed.push(k);
      }
    }
  } catch {
    /* storage blocked */
  }
  for (const k of doomed) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  }
  deleteEnglishNotes();
  deleteCs50xNotes();
  deleteCs50xCertificate();
  deleteLinuxNotes();
  try {
    window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

export interface ProgressStore {
  ready: boolean;
  file: ProgressFile;
  stats: DerivedProgress;
  todayKey: string;
  /** 12-week activity grid ending today. */
  grid: { key: string; count: number }[];
  /** 8-week accuracy trend (null = no quizzes that week). */
  trend: { weekStart: string; accuracy: number | null }[];
  isDone: (track: Track, itemId: string) => boolean;
  toggle: (track: Track, itemId: string, topic?: string) => void;
  track: typeof trackEvent;
  /** Upsert the latest video_progress row (see saveVideoProgress). */
  saveVideoProgress: typeof saveVideoProgress;
  setDailyGoal: (minutes: number) => void;
  exportData: () => void;
  importData: (json: string) => { ok: boolean; error?: string };
  deleteData: () => void;
}

export function useProgressStore(): ProgressStore {
  const [file, setFile] = useState<ProgressFile>(() => emptyProgressFile());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFile(loadProgressFile());
    setReady(true);
    const reload = () => setFile(loadProgressFile());
    window.addEventListener(PROGRESS_CHANGE_EVENT, reload);
    window.addEventListener("storage", reload);
    window.addEventListener(AUTH_CHANGE_EVENT, reload);
    return () => {
      window.removeEventListener(PROGRESS_CHANGE_EVENT, reload);
      window.removeEventListener("storage", reload);
      window.removeEventListener(AUTH_CHANGE_EVENT, reload);
    };
  }, []);

  const todayKey = localDayKey(new Date());
  const stats = useMemo(() => deriveProgress(file.events, { todayKey }), [file, todayKey]);
  const grid = useMemo(
    () => activityGrid(stats.activityDays, todayKey, 12),
    [stats.activityDays, todayKey]
  );
  const trend = useMemo(() => accuracyTrend(file.events, todayKey, 8), [file.events, todayKey]);

  const isDone = useCallback(
    (track: Track, itemId: string) =>
      track === "elzero"
        ? stats.doneVideoIds.includes(itemId)
        : track === "english"
          ? stats.doneEnglishVideoIds.includes(itemId)
          : track === "linux"
            ? stats.doneLinuxVideoIds.includes(itemId)
            : stats.doneLessonIds.includes(itemId),
    [stats]
  );

  const toggle = useCallback((track: Track, itemId: string, topic?: string) => {
    toggleCompletion(track, itemId, topic);
  }, []);

  const setDailyGoal = useCallback((minutes: number) => {
    setDailyGoalMinutes(minutes);
  }, []);

  const importData = useCallback((json: string) => {
    const result = importMyData(json);
    return { ok: result.ok, error: result.error };
  }, []);

  const exportData = useCallback(() => {
    if (typeof document === "undefined") return;
    const blob = new Blob([exportMyData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `etm-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const deleteData = useCallback(() => {
    deleteMyData();
  }, []);

  return {
    ready,
    file,
    stats,
    todayKey,
    grid,
    trend,
    isDone,
    toggle,
    track: trackEvent,
    saveVideoProgress,
    setDailyGoal,
    exportData,
    importData,
    deleteData,
  };
}
