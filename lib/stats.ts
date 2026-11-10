import type { Lesson, Stage } from "./types";

const ACTIVITY_KEY = "etm-activity-days";
const FOCUS_KEY = "etm-focus-log";

export interface NextLesson {
  stage: Stage;
  courseId: string;
  courseTitle: string;
  lesson: Lesson;
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function loadActivityDays(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function recordActivityDay() {
  if (typeof window === "undefined") return;
  try {
    const days = new Set(loadActivityDays());
    days.add(todayKey());
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(Array.from(days)));
  } catch {}
}

export function currentStreak(): number {
  const days = new Set(loadActivityDays());
  if (days.size === 0) return 0;
  let streak = 0;
  const d = new Date();
  // If today has no activity yet, start counting from yesterday.
  if (!days.has(todayKey(d))) {
    d.setDate(d.getDate() - 1);
  }
  while (days.has(todayKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function loadFocusLog(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function addFocusSession(minutes: number) {
  if (typeof window === "undefined") return;
  try {
    const log = loadFocusLog();
    const k = todayKey();
    log[k] = (log[k] || 0) + minutes;
    localStorage.setItem(FOCUS_KEY, JSON.stringify(log));
    recordActivityDay();
  } catch {}
}

export function focusMinutesToday(): number {
  return loadFocusLog()[todayKey()] || 0;
}

export function focusMinutesOn(date: Date): number {
  return loadFocusLog()[todayKey(date)] || 0;
}

export function findNextLesson(
  map: Record<string, boolean>,
  stages: Stage[]
): NextLesson | null {
  for (const stage of stages) {
    for (const course of stage.courses) {
      for (const lesson of course.lessons) {
        if (!map[lesson.id]) {
          return {
            stage,
            courseId: course.id,
            courseTitle: course.title,
            lesson,
          };
        }
      }
    }
  }
  return null;
}

export function nextLessons(
  map: Record<string, boolean>,
  stages: Stage[],
  count = 5
): NextLesson[] {
  const out: NextLesson[] = [];
  for (const stage of stages) {
    for (const course of stage.courses) {
      for (const lesson of course.lessons) {
        if (!map[lesson.id]) {
          out.push({
            stage,
            courseId: course.id,
            courseTitle: course.title,
            lesson,
          });
          if (out.length >= count) return out;
        }
      }
    }
  }
  return out;
}

export function elzeroProgress(map: Record<string, boolean>, total = 78) {
  const done = Object.keys(map).filter((k) => k.startsWith("elzero-")).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
