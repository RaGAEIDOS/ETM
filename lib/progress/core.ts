/**
 * ETM progress core — pure, dependency-free logic for the Phase 3
 * unified progress/stats system. No imports on purpose: the unit tests
 * (node:test + --experimental-strip-types) and both client stores rely
 * on this module being importable in isolation.
 *
 * Everything here is a pure function over plain data so it can run on
 * the server, in the browser, and in tests.
 */

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export type Track = "cpp" | "elzero" | "english" | "elzero-web" | "projects" | "playground" | "books";

export type EventType =
  | "lesson_started"
  | "lesson_completed"
  | "lesson_uncompleted"
  | "video_progress" // payload: { seconds?: number, percent?: number }
  | "quiz_attempt" // payload: { score, total, perQuestion: boolean[], topic? }
  | "exercise_run" // payload: { success: boolean, exerciseId?: string }
  | "term_review" // payload: { term: string, known: boolean }
  | "book_status" // payload: { status: "want" | "reading" | "read" }
  | "focus_session" // payload: { minutes: number }
  | "activity"; // generic "learner was here" heartbeat

export interface ProgressEvent {
  /** Unique event id (crypto.randomUUID when available). */
  id: string;
  /** Schema version of the file that produced/contains this event. */
  v: 2;
  track: Track;
  type: EventType;
  /** Lesson id, video id ("001"), book slug, or exercise id, depending on track/type. */
  itemId?: string;
  /** Coarse topic for stats: course id (cpp) or section id (elzero). */
  topic?: string;
  payload?: Record<string, unknown>;
  /** ISO 8601 timestamp. */
  at: string;
  /** True when synthesized from the pre-Phase-3 storage layout. */
  migrated?: boolean;
}

export interface ProgressSettings {
  /** Minutes of focused learning per day that mark a day gold for the streak. */
  dailyGoalMinutes: number;
}

export interface ProgressFile {
  version: 2;
  events: ProgressEvent[];
  settings: ProgressSettings;
}

export const PROGRESS_VERSION = 2 as const;
export const DEFAULT_DAILY_GOAL_MINUTES = 15;

export function emptyProgressFile(): ProgressFile {
  return {
    version: PROGRESS_VERSION,
    events: [],
    settings: { dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES },
  };
}

// ---------------------------------------------------------------------------
// Local-day helpers (streaks are computed on the learner's local day, not UTC)
// ---------------------------------------------------------------------------

export function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dayKeyOf(iso: string): string | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : localDayKey(d);
}

/** Whole days from `a` to `b` (b - a), both "YYYY-MM-DD" local day keys. */
export function diffDayKeys(a: string, b: string): number {
  const pa = a.split("-").map(Number);
  const pb = b.split("-").map(Number);
  const da = new Date(pa[0], pa[1] - 1, pa[2]);
  const db = new Date(pb[0], pb[1] - 1, pb[2]);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

// ---------------------------------------------------------------------------
// UTC-naive legacy key (pre-Phase-3 code sliced toISOString; only used for
// migration so old streaks keep counting on the same days they used to).
// ---------------------------------------------------------------------------

function legacyUtcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Migration from the legacy v1 layout (etm-progress-v1, etm-progress-<uid>,
// etm-activity-days, etm-focus-log). Pure: callers read localStorage.
// ---------------------------------------------------------------------------

export interface LegacyInput {
  /** Merged boolean map from etm-progress-v1 ∪ etm-progress-<uid>. */
  map?: Record<string, boolean>;
  /** UTC day keys from etm-activity-days ("YYYY-MM-DD", UTC-sliced). */
  activityDays?: string[];
  /** UTC day key -> focus minutes from etm-focus-log. */
  focusLog?: Record<string, number>;
}

function middayUtcIso(dayKey: string): string {
  // Noon UTC so the event lands on a stable, unambiguous instant; the local
  // day derivation may shift ±1 for extreme timezones, which is acceptable
  // for synthesized history and keeps the event sortable.
  return `${dayKey}T12:00:00.000Z`;
}

/** Synthesize v2 events from legacy storage. Idempotency is handled by the caller (only runs when v2 is absent). */
export function migrateLegacy(input: LegacyInput, now: Date = new Date()): ProgressEvent[] {
  const events: ProgressEvent[] = [];
  const push = (track: Track, type: EventType, itemId: string | undefined, atIso: string, extra?: Partial<ProgressEvent>) => {
    events.push({
      id: `migrated-${track}-${type}-${itemId ?? "none"}-${events.length}`,
      v: 2,
      track,
      type,
      itemId,
      at: atIso,
      migrated: true,
      ...extra,
    });
  };

  const map = input.map ?? {};
  const migratedAt = now.toISOString();
  for (const [key, done] of Object.entries(map)) {
    if (!done) continue;
    if (key.startsWith("elzero-")) {
      push("elzero", "lesson_completed", key.slice("elzero-".length), migratedAt);
    } else {
      push("cpp", "lesson_completed", key, migratedAt);
    }
  }

  for (const day of input.activityDays ?? []) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      push("cpp", "activity", undefined, middayUtcIso(day), { topic: "migrated" });
    }
  }

  for (const [day, minutes] of Object.entries(input.focusLog ?? {})) {
    const mins = Number(minutes);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(mins) && mins > 0) {
      push("playground", "focus_session", undefined, middayUtcIso(day), {
        payload: { minutes: mins },
      });
    }
  }

  return events;
}

// ---------------------------------------------------------------------------
// Merge (union by event id; replay order is handled by sorting in derive()).
// ---------------------------------------------------------------------------

export function mergeEvents(a: ProgressEvent[], b: ProgressEvent[]): ProgressEvent[] {
  const seen = new Set<string>();
  const out: ProgressEvent[] = [];
  for (const list of [a, b]) {
    for (const e of list) {
      if (!e || typeof e.id !== "string" || typeof e.at !== "string") continue;
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push(e);
    }
  }
  out.sort((x, y) => (x.at === y.at ? x.id.localeCompare(y.id) : x.at.localeCompare(y.at)));
  return out;
}

export function parseProgressFile(raw: unknown): ProgressFile {
  // Strict-ish validation for JSON import: unknown shapes are rejected.
  if (!raw || typeof raw !== "object") throw new Error("not-an-object");
  const f = raw as Partial<ProgressFile>;
  if (f.version !== 2 || !Array.isArray(f.events)) throw new Error("unsupported-version");
  const events: ProgressEvent[] = [];
  for (const e of f.events) {
    if (
      e &&
      typeof e === "object" &&
      typeof (e as ProgressEvent).id === "string" &&
      typeof (e as ProgressEvent).at === "string" &&
      typeof (e as ProgressEvent).track === "string" &&
      typeof (e as ProgressEvent).type === "string"
    ) {
      events.push({ ...(e as ProgressEvent), v: 2 });
    }
  }
  const settings = (f.settings ?? {}) as Partial<ProgressSettings>;
  const dailyGoalMinutes =
    Number.isFinite(settings.dailyGoalMinutes) && (settings.dailyGoalMinutes as number) > 0
      ? Math.round(settings.dailyGoalMinutes as number)
      : DEFAULT_DAILY_GOAL_MINUTES;
  return { version: 2, events, settings: { dailyGoalMinutes } };
}

export function serializeProgressFile(file: ProgressFile): string {
  return JSON.stringify({ version: 2, events: mergeEvents(file.events, []), settings: file.settings });
}

// ---------------------------------------------------------------------------
// XP / levels
// ---------------------------------------------------------------------------

export const XP = {
  lessonCompleted: 10,
  quizPass: 10,
  quizPerfectBonus: 5,
  quizAttempt: 2,
  exerciseSuccess: 5,
  focusMinute: 1,
} as const;

export function xpForEvent(e: ProgressEvent): number {
  switch (e.type) {
    case "lesson_completed":
      return XP.lessonCompleted;
    case "quiz_attempt": {
      const total = Number(e.payload?.total ?? 0);
      const score = Number(e.payload?.score ?? 0);
      if (total <= 0) return 0;
      const pct = score / total;
      return XP.quizAttempt + (pct >= 0.6 ? XP.quizPass : 0) + (pct >= 1 ? XP.quizPerfectBonus : 0);
    }
    case "exercise_run":
      return e.payload?.success ? XP.exerciseSuccess : 0;
    case "focus_session": {
      const mins = Number(e.payload?.minutes ?? 0);
      return Number.isFinite(mins) ? Math.max(0, Math.round(mins)) * XP.focusMinute : 0;
    }
    default:
      return 0;
  }
}

export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / 100) + 1;
}

// ---------------------------------------------------------------------------
// Derivation — replay the event log into stats.
// ---------------------------------------------------------------------------

export interface TopicAccuracy {
  attempts: number;
  correct: number;
  total: number;
  accuracy: number; // 0..100, 0 when no answers yet
}

export interface DerivedProgress {
  /** Legacy-compatible boolean map: lessonId -> true, "elzero-<id>" -> true. */
  map: Record<string, true>;
  doneLessonIds: string[];
  doneVideoIds: string[];
  /** English (zAmericanEnglish) video ids completed, Phase 4 track. */
  doneEnglishVideoIds: string[];
  /** ElZero Web track (HTML/CSS/JS/TS/SASS/Git) lesson ids completed. */
  doneElzeroWebVideoIds: string[];
  /** cpp lessons + elzero videos + english + elzero-web lessons completed. */
  totalCompletions: number;
  minutesByDay: Record<string, number>;
  totalFocusMinutes: number;
  minutesThisWeek: number;
  eventsThisWeek: number;
  /** Sorted local day keys with at least one logged learning event. */
  activityDays: string[];
  currentStreak: number;
  longestStreak: number;
  xp: number;
  xpThisWeek: number;
  level: number;
  quiz: {
    attempts: number;
    correct: number;
    total: number;
    accuracy: number;
    perTopic: Record<string, TopicAccuracy>;
  };
  /** Topics ranked by lowest accuracy (attempts >= 2), worst first. */
  weakTopics: { topic: string; accuracy: number; attempts: number }[];
  /** Number of questions answered incorrectly in each item's LATEST quiz attempt. */
  reviewDue: number;
  lastActivityByTrack: Record<Track, string | null>;
  /** ISO timestamp of the most recent event overall. */
  lastActivityAt: string | null;
}

const TRACKS: Track[] = ["cpp", "elzero", "english", "elzero-web", "projects", "playground", "books"];

export interface DeriveOptions {
  /** Local day key for "today"; injectable for tests/timezones. */
  todayKey?: string;
}

export function deriveProgress(events: ProgressEvent[], opts: DeriveOptions = {}): DerivedProgress {
  const today = opts.todayKey ?? localDayKey(new Date());
  const sorted = [...events].sort((a, b) =>
    a.at === b.at ? a.id.localeCompare(b.id) : a.at.localeCompare(b.at)
  );

  const doneCpp = new Set<string>();
  const doneElzero = new Set<string>();
  const doneEnglish = new Set<string>();
  const doneElzeroWeb = new Set<string>();
  const minutesByDay: Record<string, number> = {};
  const dayHadActivity: Record<string, boolean> = {};
  const perTopic: Record<string, TopicAccuracy> = {};
  const lastQuizPerItem = new Map<string, ProgressEvent>();
  const lastActivityByTrack = Object.fromEntries(TRACKS.map((t) => [t, null])) as Record<Track, string | null>;
  let xp = 0;
  let xpThisWeek = 0;
  let minutesThisWeek = 0;
  let eventsThisWeek = 0;
  let quizAttempts = 0;
  let quizCorrect = 0;
  let quizTotal = 0;
  let lastActivityAt: string | null = null;

  const weekAgoDayKey = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - 6); // inclusive 7-day window ending today
    return localDayKey(d);
  })();

  for (const e of sorted) {
    const dayKey = dayKeyOf(e.at);
    const inThisWeek = dayKey !== null && dayKey >= weekAgoDayKey && dayKey <= today;

    if (dayKey) dayHadActivity[dayKey] = true;
    if (inThisWeek) eventsThisWeek += 1;
    xp += xpForEvent(e);
    if (inThisWeek) xpThisWeek += xpForEvent(e);
    lastActivityAt = e.at;
    if (e.track in lastActivityByTrack) lastActivityByTrack[e.track] = e.at;

    switch (e.type) {
      case "lesson_completed": {
        if (!e.itemId) break;
        if (e.track === "elzero") doneElzero.add(e.itemId);
        else if (e.track === "english") doneEnglish.add(e.itemId);
        else if (e.track === "elzero-web") doneElzeroWeb.add(e.itemId);
        else doneCpp.add(e.itemId); // cpp + projects-style completions both count as lesson ids
        break;
      }
      case "lesson_uncompleted": {
        if (!e.itemId) break;
        if (e.track === "elzero") doneElzero.delete(e.itemId);
        else if (e.track === "english") doneEnglish.delete(e.itemId);
        else if (e.track === "elzero-web") doneElzeroWeb.delete(e.itemId);
        else doneCpp.delete(e.itemId);
        break;
      }
      case "focus_session": {
        const mins = Number(e.payload?.minutes ?? 0);
        if (dayKey && Number.isFinite(mins) && mins > 0) {
          minutesByDay[dayKey] = (minutesByDay[dayKey] ?? 0) + mins;
          if (inThisWeek) minutesThisWeek += mins;
        }
        break;
      }
      case "quiz_attempt": {
        quizAttempts += 1;
        const total = Number(e.payload?.total ?? 0);
        const score = Number(e.payload?.score ?? 0);
        if (Number.isFinite(total) && total > 0) {
          quizTotal += total;
          quizCorrect += Math.max(0, Math.min(score, total));
        }
        const topic = e.topic ?? (e.itemId ? `item:${e.itemId}` : "general");
        const per = perTopic[topic] ?? { attempts: 0, correct: 0, total: 0, accuracy: 0 };
        per.attempts += 1;
        per.correct += Math.max(0, Math.min(score, total || 0));
        per.total += Math.max(0, total || 0);
        per.accuracy = per.total > 0 ? Math.round((per.correct / per.total) * 100) : 0;
        perTopic[topic] = per;
        if (e.itemId) lastQuizPerItem.set(`${e.track}:${e.itemId}`, e);
        break;
      }
      default:
        break;
    }
  }

  const totalFocusMinutes = Object.values(minutesByDay).reduce((a, b) => a + b, 0);

  // A local day counts toward the streak when the learner logged ANY event
  // that day (completions, quizzes, focus minutes, heartbeats, migrated
  // legacy activity). The configurable daily goal governs the focus-minutes
  // ring in the UI; keeping the streak tied to any-learning-day preserves
  // pre-migration users' streaks exactly.
  const streakDays = new Set(Object.keys(dayHadActivity));
  for (const day of Object.keys(minutesByDay)) streakDays.add(day);

  const { currentStreak, longestStreak } = streaks(streakDays, today);

  const map: Record<string, true> = {};
  for (const id of Array.from(doneCpp)) map[id] = true;
  for (const id of Array.from(doneElzero)) map[`elzero-${id}`] = true;

  const weakTopics = Object.entries(perTopic)
    .filter(([, t]) => t.attempts >= 2 && t.total > 0)
    .map(([topic, t]) => ({ topic, accuracy: t.accuracy, attempts: t.attempts }))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

  let reviewDue = 0;
  for (const attempt of Array.from(lastQuizPerItem.values())) {
    const perQ = Array.isArray(attempt.payload?.perQuestion)
      ? (attempt.payload.perQuestion as unknown[])
      : null;
    if (perQ) {
      reviewDue += perQ.filter((r) => r === false).length;
    } else {
      const total = Number(attempt.payload?.total ?? 0);
      const score = Number(attempt.payload?.score ?? 0);
      if (Number.isFinite(total) && Number.isFinite(score)) {
        reviewDue += Math.max(0, total - score);
      }
    }
  }

  return {
    map,
    doneLessonIds: Array.from(doneCpp),
    doneVideoIds: Array.from(doneElzero),
    doneEnglishVideoIds: Array.from(doneEnglish),
    doneElzeroWebVideoIds: Array.from(doneElzeroWeb),
    totalCompletions: doneCpp.size + doneElzero.size + doneEnglish.size + doneElzeroWeb.size,
    minutesByDay,
    totalFocusMinutes,
    minutesThisWeek,
    eventsThisWeek,
    activityDays: Array.from(streakDays).sort(),
    currentStreak,
    longestStreak,
    xp,
    xpThisWeek,
    level: levelForXp(xp),
    quiz: {
      attempts: quizAttempts,
      correct: quizCorrect,
      total: quizTotal,
      accuracy: quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0,
      perTopic,
    },
    weakTopics,
    reviewDue,
    lastActivityByTrack,
    lastActivityAt,
  };
}

export function streaks(streakDays: Set<string>, todayKey: string): { currentStreak: number; longestStreak: number } {
  if (streakDays.size === 0) return { currentStreak: 0, longestStreak: 0 };
  const sorted = Array.from(streakDays).sort();

  // Longest run of consecutive days.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    if (diffDayKeys(sorted[i - 1], sorted[i]) === 1) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }

  // Current streak: today, or yesterday if today has no activity yet.
  let current = 0;
  let cursor = todayKey;
  if (!streakDays.has(cursor)) {
    cursor = shiftDayKey(cursor, -1);
  }
  while (streakDays.has(cursor)) {
    current += 1;
    cursor = shiftDayKey(cursor, -1);
  }

  return { currentStreak: current, longestStreak: longest };
}

export function shiftDayKey(dayKey: string, delta: number): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return localDayKey(date);
}

/** 12-week (84 day) activity grid ending today, oldest first. 0=none, 1=goal met. */
export function activityGrid(activityDays: string[], today: string, weeks = 12): { key: string; count: number }[] {
  const set = new Set(activityDays);
  const out: { key: string; count: number }[] = [];
  const total = weeks * 7;
  for (let i = total - 1; i >= 0; i -= 1) {
    const key = shiftDayKey(today, -i);
    out.push({ key, count: set.has(key) ? 1 : 0 });
  }
  return out;
}

/** Last `weeks` weekly accuracy buckets for the trend chart (oldest first). */
export function accuracyTrend(events: ProgressEvent[], today: string, weeks = 8): { weekStart: string; accuracy: number | null }[] {
  const out: { weekStart: string; accuracy: number | null }[] = [];
  for (let w = weeks - 1; w >= 0; w -= 1) {
    const end = shiftDayKey(today, -w * 7);
    const start = shiftDayKey(end, -6);
    let correct = 0;
    let total = 0;
    for (const e of events) {
      if (e.type !== "quiz_attempt") continue;
      const day = dayKeyOf(e.at);
      if (!day || day < start || day > end) continue;
      const t = Number(e.payload?.total ?? 0) || 0;
      total += t;
      correct += Math.max(0, Math.min(Number(e.payload?.score ?? 0) || 0, t));
    }
    out.push({ weekStart: start, accuracy: total > 0 ? Math.round((correct / total) * 100) : null });
  }
  return out;
}

/** Last event for a track, for "resume" affordances. */
export function lastEventFor(events: ProgressEvent[], track: Track): ProgressEvent | null {
  let best: ProgressEvent | null = null;
  for (const e of events) {
    if (e.track !== track) continue;
    if (!best || e.at > best.at || (e.at === best.at && e.id > best.id)) best = e;
  }
  return best;
}

/** Last event overall across all tracks. */
export function lastEvent(events: ProgressEvent[]): ProgressEvent | null {
  let best: ProgressEvent | null = null;
  for (const e of events) {
    if (!best || e.at > best.at || (e.at === best.at && e.id > best.id)) best = e;
  }
  return best;
}
