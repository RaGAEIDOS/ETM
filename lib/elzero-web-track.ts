/**
 * Small shared helpers for the ElZero Web track pages/components.
 * Kept dependency-free so unit tests and server/client components can use it.
 */

/** Bulk video-id prefix per course (ids look like "html-001", "js-001" ...). */
const COURSE_ID_PREFIX: Record<string, string> = {
  html: "html-",
  css: "css-",
  javascript: "js-",
  typescript: "ts-",
  sass: "sass-",
  gitgithub: "git-",
};

export function webIdPrefix(courseId: string): string {
  return COURSE_ID_PREFIX[courseId] ?? `${courseId}-`;
}

/** How many completed video ids belong to one course. */
export function countDoneForCourse(courseId: string, doneIds: string[]): number {
  const prefix = webIdPrefix(courseId);
  let n = 0;
  for (const id of doneIds) if (id.startsWith(prefix)) n += 1;
  return n;
}

/** "PT11M5S" -> "11:05" · "PT1H2M3S" -> "1:02:03" · "PT40S" -> "0:40" */
export function formatDuration(iso: string): string {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return iso;
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${ss}`;
  return `${min}:${ss}`;
}
