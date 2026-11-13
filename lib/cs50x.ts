/**
 * CS50x track — Harvard University's CS50x (CS50's Introduction to Computer Science),
 * presented on the platform as a guided path up to the free CS50 Certificate.
 *
 * Sources (all official):
 * - Course: https://cs50.harvard.edu/x/ (weeks 0-10 + Artificial Intelligence + Final Project)
 * - Videos: the official CS50 YouTube channel, "CS50x Lectures" playlist
 *   (PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6). Every lecture is embedded, never downloaded/re-hosted.
 * - License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)
 *   https://cs50.harvard.edu/x/license/ . Attribution is given; lecture content is UNCHANGED.
 *   All summaries/terms/practice on this platform are ORIGINAL text (our own words).
 * - Certificate path (https://cs50.harvard.edu/x/certificate/): submit ≥ 10 problem sets
 *   and the final project with ≥ 70% each via the course on edX (cs50.edx.org);
 *   the free CS50 Certificate is then claimable at cs50.harvard.edu/certificates.
 *
 * This platform is NOT affiliated with Harvard University or CS50.
 */

export const CS50X_CHANNEL = "https://www.youtube.com/@cs50";
export const CS50X_CHANNEL_HANDLE = "@cs50";
export const CS50X_OFFICIAL_SITE = "https://cs50.harvard.edu/x/";
export const CS50X_LICENSE_URL = "https://cs50.harvard.edu/x/license/";
export const CS50X_CC_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";
export const CS50X_PLAYLIST_ID = "PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6";
export const CS50X_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6";
export const CS50X_EDX_URL = "https://cs50.edx.org/";
export const CS50X_GRADEBOOK_URL = "https://cs50.me/cs50x";
export const CS50X_CERTIFICATE_URL = "https://cs50.harvard.edu/certificates";
export const CS50X_CERTIFICATE_INFO_URL = "https://cs50.harvard.edu/x/certificate/";
export const CS50X_PSETS_URL = "https://cs50.harvard.edu/x/psets/";
export const CS50X_PROJECT_URL = "https://cs50.harvard.edu/x/project/";
export const CS50X_GALLERY_URL = "https://cs50.harvard.edu/x/gallery/";
/** The official CS50 Shorts playlist. CS50 publishes shorts as topic pages per week (no per-week playlist). */
export const CS50X_SHORTS_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLhQjrBD2T381k8ul4WQ8SQ165XqY149WW";
export const CS50X_SHORTS_URL = "https://cs50.harvard.edu/x/shorts/";
export const CS50X_CREDIT =
  "CS50x by Harvard University / David J. Malan. Licensed CC BY-NC-SA 4.0. This platform is not affiliated with Harvard or CS50.";

export interface Cs50xKeyTerm {
  en: string;
  ar: string;
  example?: { en: string; ar: string };
}

/** Practice items for the CS50x track. Exactly one correct answer each. */
export type Cs50xPracticeItem =
  | {
      type: "mcq";
      prompt: string;
      options: string[];
      answer: number;
      explanation: string;
    }
  | { type: "fill"; prompt: string; answer: string; accept?: string[]; explanation: string };

export interface Cs50xLecture {
  /** Stable id ("intro", "week-0" … "ai", "week-10"). */
  id: string;
  /** 1-based order in the official playlist. */
  number: number;
  youtubeId: string;
  /** Title as published on the channel. */
  title: string;
  /** Duration in seconds (from the official playlist metadata). */
  durationSeconds: number;
  /** Full watch URL incl. &list= for "watch on YouTube" links. */
  youtube: string;
  /** Week label as used on cs50.harvard.edu/x. */
  week: string;
  /** Link to the week's official page (all sources for that week). */
  weekUrl: string;
  /** Link to the official notes page for the week (if any). */
  notesUrl?: string;
  /** Link to the official problem set (if any). */
  psetUrl?: string;
  /** Link to the official section video page (if any). */
  sectionUrl?: string;
  /** 2-4 sentences, Arabic, ORIGINAL. reviewed:false until watched by a human. */
  summary: string;
  terms: Cs50xKeyTerm[];
  practice: Cs50xPracticeItem[];
  reviewed: boolean;
}

export function isoDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}${sec > 0 || (h === 0 && m === 0) ? `${sec}S` : ""}`;
}

/** Short "2h 30m" label for UI. */
export function shortDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

// ---------------------------------------------------------------------------
// Catalogue: lectures (playlist order), certificate path
// ---------------------------------------------------------------------------

import { CS50X_LECTURES_1_7 } from "./cs50x-lectures-1.ts";
import { CS50X_LECTURES_8_13 } from "./cs50x-lectures-2.ts";

/** All 13 official CS50x lecture videos, in official playlist order. */
export const CS50X_LECTURES: Cs50xLecture[] = [...CS50X_LECTURES_1_7, ...CS50X_LECTURES_8_13];

/**
 * The 12 CS50x weeks in official syllabus order (week 0 through week 10 + AI).
 * The opening "Introduction" video is a welcome lecture, not a week, so it is
 * not part of this list. Each week's workflow is: lecture → section → shorts →
 * problem set, all on official CS50 properties.
 */
export interface Cs50xWeek {
  /** Matches the lecture id for the week ("week-0" … "week-10", "ai"). */
  id: string;
  /** Display label ("Week 0" / "AI"). */
  label: string;
  /** Week topic, as on cs50.harvard.edu/x. */
  title: string;
  lectureId: string;
  weekUrl: string;
  sectionUrl?: string;
  psetUrl?: string;
}

const CS50X_WEEK_DEFS = [
  ["week-0", "Week 0", "Scratch"],
  ["week-1", "Week 1", "C"],
  ["week-2", "Week 2", "Arrays"],
  ["week-3", "Week 3", "Algorithms"],
  ["week-4", "Week 4", "Memory"],
  ["week-5", "Week 5", "Data Structures"],
  ["week-6", "Week 6", "Python"],
  ["week-7", "Week 7", "SQL"],
  ["ai", "AI", "Artificial Intelligence"],
  ["week-8", "Week 8", "HTML, CSS, JavaScript"],
  ["week-9", "Week 9", "Flask"],
  ["week-10", "Week 10", "The End"],
] as const;

export const CS50X_WEEKS: Cs50xWeek[] = CS50X_WEEK_DEFS.map(([id, label, title]) => {
  const lecture = CS50X_LECTURES.find((l) => l.id === id);
  return {
    id,
    label,
    title,
    lectureId: id,
    weekUrl: lecture?.weekUrl ?? CS50X_OFFICIAL_SITE,
    // CS50 has no section page for week 0; the workflow falls back to the week page.
    sectionUrl: id === "week-0" ? undefined : lecture?.sectionUrl,
    psetUrl: lecture?.psetUrl ?? CS50X_PSETS_URL,
  };
});

/** The final project closes the track after week 10. */
export const CS50X_FINAL_PROJECT = {
  id: "final-project",
  label: "Final Project",
  title: "Final Project",
  projectUrl: CS50X_PROJECT_URL,
  galleryUrl: CS50X_GALLERY_URL,
} as const;

export function cs50xWeekForLecture(lectureId: string): Cs50xWeek | undefined {
  return CS50X_WEEKS.find((w) => w.lectureId === lectureId);
}

/** The pilot release covers week 0 and week 1 end-to-end. */
export const CS50X_PILOT_WEEKS = ["week-0", "week-1"] as const;

export function isCs50xPilotWeek(id: string): boolean {
  return (CS50X_PILOT_WEEKS as readonly string[]).includes(id);
}

/** The ten problem sets + final project on the official psets page. */
export const CS50X_PSETS = [
  { id: "pset-0", title: "Problem Set 0 — Scratch", url: "https://cs50.harvard.edu/x/psets/0/" },
  { id: "pset-1", title: "Problem Set 1 — C", url: "https://cs50.harvard.edu/x/psets/1/" },
  { id: "pset-2", title: "Problem Set 2 — Arrays", url: "https://cs50.harvard.edu/x/psets/2/" },
  { id: "pset-3", title: "Problem Set 3 — Algorithms", url: "https://cs50.harvard.edu/x/psets/3/" },
  { id: "pset-4", title: "Problem Set 4 — Memory", url: "https://cs50.harvard.edu/x/psets/4/" },
  { id: "pset-5", title: "Problem Set 5 — Data Structures", url: "https://cs50.harvard.edu/x/psets/5/" },
  { id: "pset-6", title: "Problem Set 6 — Python", url: "https://cs50.harvard.edu/x/psets/6/" },
  { id: "pset-7", title: "Problem Set 7 — SQL", url: "https://cs50.harvard.edu/x/psets/7/" },
  { id: "pset-8", title: "Problem Set 8 — Web", url: "https://cs50.harvard.edu/x/psets/8/" },
  { id: "pset-9", title: "Problem Set 9 — Flask", url: "https://cs50.harvard.edu/x/psets/9/" },
  { id: "final-project", title: "Final Project", url: "https://cs50.harvard.edu/x/project/" },
] as const;

export type Cs50xPset = (typeof CS50X_PSETS)[number];

export function findCs50xLecture(id: string): Cs50xLecture | undefined {
  return CS50X_LECTURES.find((l) => l.id === id);
}

export function cs50xLectureIndex(id: string): number {
  return CS50X_LECTURES.findIndex((l) => l.id === id);
}

export const CS50X_TOTAL_SECONDS = CS50X_LECTURES.reduce((sum, l) => sum + l.durationSeconds, 0);

/** Normalizes a typed answer for lenient comparison (fill items). */
export function normalizeCs50xAnswer(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[ً-ٟ]/g, "")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Catalogue integrity problems (empty array = OK). Checked by unit tests + validator. */
export function cs50xCatalogueProblems(): string[] {
  const problems: string[] = [];
  if (CS50X_LECTURES.length !== 13) problems.push(`expected 13 lectures, got ${CS50X_LECTURES.length}`);
  const ids = new Set<string>();
  for (let i = 0; i < CS50X_LECTURES.length; i += 1) {
    const l = CS50X_LECTURES[i];
    if (ids.has(l.id)) problems.push(`duplicate id ${l.id}`);
    ids.add(l.id);
    if (l.number !== i + 1) problems.push(`${l.id}: number ${l.number} != playlist position ${i + 1}`);
    if (!/^[\w-]{11}$/.test(l.youtubeId)) problems.push(`${l.id}: bad youtubeId ${l.youtubeId}`);
    if (!l.youtube.includes(`v=${l.youtubeId}`) || !l.youtube.includes("list=")) problems.push(`${l.id}: bad watch url`);
    if (l.durationSeconds <= 0 || l.durationSeconds > 4 * 3600) problems.push(`${l.id}: bad duration ${l.durationSeconds}`);
    if (!l.weekUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${l.id}: bad week url ${l.weekUrl}`);
    if (l.notesUrl && !l.notesUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${l.id}: bad notes url`);
    if (l.psetUrl && !l.psetUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${l.id}: bad pset url`);
    if (l.sectionUrl && !l.sectionUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${l.id}: bad section url`);
    if ((l.terms.length > 0) !== (l.practice.length > 0)) problems.push(`${l.id}: terms/practice present but not both`);
    for (const item of l.practice) {
      if (item.type === "mcq") {
        if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) {
          problems.push(`${l.id}: mcq answer out of range`);
        }
        if (item.options.length < 2) problems.push(`${l.id}: mcq needs >= 2 options`);
      } else if (item.type === "fill") {
        if (!item.answer.trim()) problems.push(`${l.id}: fill answer empty`);
      }
    }
    if (l.reviewed) problems.push(`${l.id}: reviewed=true but nothing has been human-reviewed yet`);
  }
  if ((CS50X_PSETS as readonly { id: string }[]).length !== 11) problems.push("expected 10 psets + final project");
  if (CS50X_WEEKS.length !== 12) problems.push(`expected 12 weeks, got ${CS50X_WEEKS.length}`);
  const weekIds = new Set<string>();
  for (const w of CS50X_WEEKS) {
    if (weekIds.has(w.id)) problems.push(`duplicate week id ${w.id}`);
    weekIds.add(w.id);
    if (!CS50X_LECTURES.some((l) => l.id === w.lectureId)) problems.push(`${w.id}: no matching lecture`);
    if (!w.weekUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${w.id}: bad official week url`);
    if (w.psetUrl && !w.psetUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${w.id}: bad pset url`);
    if (w.sectionUrl && !w.sectionUrl.startsWith("https://cs50.harvard.edu/x/")) problems.push(`${w.id}: bad section url`);
  }
  return problems;
}
