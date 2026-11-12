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
export const CS50X_CREDIT =
  "CS50's Introduction to Computer Science (CS50x) by Harvard University and the CS50 staff, licensed under CC BY-NC-SA 4.0. Lecture videos are embedded unmodified from the official CS50 YouTube channel. This platform is not affiliated with Harvard University or CS50.";

export interface Cs50xKeyTerm {
  en: string;
  ar: string;
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
  return problems;
}
