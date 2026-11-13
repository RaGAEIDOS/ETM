/**
 * Programming Advices track (pilot): two free courses by Dr. Mohammed
 * Abu-Hadhoud on the official "Programming Advices" YouTube channel.
 *
 * Legal boundaries (hard rules for this file and every PA component):
 * - Videos are only ever embedded through YouTube or linked; never downloaded,
 *   re-hosted, mirrored or transcribed-and-published here.
 * - Every summary / term / practice item below is ORIGINAL ETM content written
 *   in our own words. No author slides, PDFs, exam questions or activity
 *   solutions are copied. Official PDFs are linked only from the official page.
 * - Nothing behind the author's platform login/enrolment is touched.
 * - Video ids, titles, durations and playlist ids are REAL metadata fetched
 *   from the public playlists (`out/programmingadvices/playlists.json`).
 *   Titles keep the author's published spelling (including typos) on purpose.
 *
 * The pilot ships the infrastructure + the first 10 course-1 videos. Course 2
 * is represented by its verified card now and gets lesson batches only after
 * the pilot is approved. Content is `reviewed: false` because the public
 * videos have no captions; summaries are conservative title/description-based
 * paraphrases.
 */

import { PA_COURSE1_VIDEOS } from "./programmingadvices-course1.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PACourseId = "pa-foundations" | "pa-algorithms";

export interface PAKeyTerm {
  /** English term (kept LTR in the UI). */
  en: string;
  /** Arabic meaning. */
  ar: string;
  example?: { en: string; ar: string };
}

export interface PAMatchPair {
  left: string;
  right: string;
  /** English wording of the right-hand side, when it differs (locale "en"). */
  rightEn?: string;
}

interface PAPracticeBase {
  explanation: string;
  explanationEn: string;
  /** Authored hint shown by Miku BEFORE the learner answers. Never the answer. */
  hint: string;
  hintEn: string;
}

export type PAPracticeItem =
  | (PAPracticeBase & {
      type: "mcq";
      prompt: string;
      promptEn: string;
      /** Optional LTR snippet (pseudocode, number, term) shown above options. */
      code?: string;
      options: string[];
      optionsEn?: string[];
      answer: number;
    })
  | (PAPracticeBase & {
      type: "fill";
      prompt: string;
      promptEn: string;
      code?: string;
      placeholder?: string;
      /** Canonical accepted answer. */
      answer: string;
      /** Extra accepted spellings/notations; compared normalized. */
      accept?: string[];
    })
  | (PAPracticeBase & {
      /** Dry-run / trace question over a short pseudocode snippet. */
      type: "trace" | "pseudocode";
      prompt: string;
      promptEn: string;
      code: string;
      answer: string;
      accept?: string[];
    })
  | (PAPracticeBase & {
      type: "match";
      prompt?: string;
      promptEn?: string;
      pairs: PAMatchPair[];
    })
  | (PAPracticeBase & {
      type: "order";
      prompt: string;
      promptEn: string;
      /** Correct order, first step first. The UI shuffles the display. */
      steps: string[];
      stepsEn?: string[];
    });

export interface PAVideo {
  /** Stable ETM id: pa1-01 … pa1-20, pa2-01 … pa2-50. */
  id: string;
  number: number;
  courseId: PACourseId;
  youtubeId: string;
  /** Original Arabic title exactly as published on the channel. */
  title: string;
  /** Our English rendering (translation aid, not author copy). */
  titleEn: string;
  section: string;
  sectionEn: string;
  /** Full watch URL including the playlist id, for the official link. */
  youtube: string;
  /** ISO-8601 duration from the public playlist metadata. */
  duration: string;
  /** 2–4 sentence original Arabic summary. */
  summary: string;
  summaryEn: string;
  terms: PAKeyTerm[];
  practice: PAPracticeItem[];
  /** False when derived from title/description only (no captions available). */
  reviewed: boolean;
  /** Defaults to true. False = render the "Watch on YouTube" lesson fallback. */
  embeddable?: boolean;
}

export interface PACourse {
  id: PACourseId;
  /** Position in the recommended path (1, 2). */
  number: 1 | 2;
  /** Full original playlist title. */
  title: string;
  titleEn: string;
  /** Short card label (our words). */
  shortTitle: string;
  shortTitleEn: string;
  description: string;
  descriptionEn: string;
  playlistId: string;
  playlistUrl: string;
  officialPageUrl: string;
  /** Total videos in the official playlist (20 / 50). */
  videoCount: number;
  color: string;
  icon: "foundations" | "algorithms";
}

// ---------------------------------------------------------------------------
// Verification + credit constants
// ---------------------------------------------------------------------------

export const ETM_PA_CHANNEL = "https://www.youtube.com/c/ProgrammingAdvices";
export const ETM_PA_ROADMAP = "https://programmingadvices.com/courses";
export const ETM_PA_TERMS = "https://programmingadvices.com/p/terms";

/** Exact required credit line (English). */
export const ETM_PA_CREDIT =
  "Content by Dr. Mohammed Abu-Hadhoud / Programming Advices on YouTube. This platform is not affiliated with Programming Advices.";

export const ETM_PA_CREDIT_AR =
  "المحتوى من د. محمد أبو هدهود / Programming Advices على YouTube. هذه المنصة غير تابعة لـ Programming Advices.";

/**
 * The author's terms allow personal, non-commercial use only; ETM therefore
 * never marks external content as permission-granted. Keep this false.
 */
export const externalContent = {
  permissionGranted: false,
} as const;

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export const paCourses: PACourse[] = [
  {
    id: "pa-foundations",
    number: 1,
    title:
      "كورس رقم 1 - البداية من هنا: سلسة اساسيات مهمه لكل مبرمج - المستوى الاول",
    titleEn: "Course 1 — Start Here: Essential Foundations for Every Programmer (Level 1)",
    shortTitle: "كورس 1 — البداية من هنا",
    shortTitleEn: "Course 1 — Start Here",
    description:
      "المستوى الأول من سلسلة الأساسيات: معنى البيانات والمعلومات، مكونات الحاسوب، النظام الثنائي والست عشري والثماني، وحدات القياس، ولماذا يبدأ كل مبرمج من هنا. عشرون فيديو عامًا من قناة Programming Advices، مع ملخص وتمارين أصلية في ETM.",
    descriptionEn:
      "Level 1 of the foundations series: data and information, computer components, binary/hexadecimal/octal, measurement units, and why every programmer starts here. Twenty public videos from the Programming Advices channel, with original ETM summaries and drills.",
    playlistId: "PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj",
    officialPageUrl: "https://programmingadvices.com/p/00316b",
    videoCount: 20,
    color: "from-amber-400 to-orange-500",
    icon: "foundations",
  },
  {
    id: "pa-algorithms",
    number: 2,
    title: "كورس رقم 2 - سلسة الخوارزميات وحل المشاكل المستوى الاول",
    titleEn: "Course 2 — Algorithms & Problem Solving (Level 1)",
    shortTitle: "كورس 2 — الخوارزميات وحل المشاكل",
    shortTitleEn: "Course 2 — Algorithms & Problem Solving",
    description:
      "المستوى الأول من سلسلة التفكير قبل الكتابة: تحليل المشكلة، تصميم الخوارزمية، التتبع اليدوي، وتقسيم الحل إلى خطوات واضحة. خمسون فيديو عامًا من قناة Programming Advices — تُضاف دروسه على دفعات بعد اعتماد المرحلة التجريبية.",
    descriptionEn:
      "Level 1 of thinking-before-coding: problem analysis, algorithm design, dry-running, and breaking a solution into clear steps. Fifty public videos from the Programming Advices channel — lessons are added in batches after the pilot is approved.",
    playlistId: "PL3X--QIIK-OEUIwbQU79V76RHelBUQKiz",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PL3X--QIIK-OEUIwbQU79V76RHelBUQKiz",
    officialPageUrl: "https://programmingadvices.com/p/00316b1",
    videoCount: 50,
    color: "from-cyan-400 to-violet-500",
    icon: "algorithms",
  },
];

// ---------------------------------------------------------------------------
// Videos (pilot: course 1, first 10)
// ---------------------------------------------------------------------------

export const paVideos: PAVideo[] = [...PA_COURSE1_VIDEOS];

export function findPACourse(id: string): PACourse | undefined {
  return paCourses.find((course) => course.id === id);
}

export function paVideosOfCourse(courseId: string): PAVideo[] {
  return paVideos
    .filter((video) => video.courseId === courseId)
    .sort((a, b) => a.number - b.number);
}

export function findPAVideo(id: string): PAVideo | undefined {
  return paVideos.find((video) => video.id === id);
}

/** Flat recommended order: course 1 then course 2, each by number. */
export function orderedPAVideos(): PAVideo[] {
  return paCourses
    .map((course) => paVideosOfCourse(course.id))
    .flat();
}

export function paVideoIndex(id: string): number {
  return orderedPAVideos().findIndex((video) => video.id === id);
}

/** "PT26M49S" -> "26:49" (display only; ISO stays the source of truth). */
export function formatPADuration(iso?: string): string {
  if (!iso) return "";
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return "";
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Normalize typed answers for auto-grading. Keeps letters/numbers in any
 * script, folds Arabic-Indic digits to Western digits, lowercases Latin and
 * strips punctuation/diacritics so "0x1A", "1a" and " 1A " all compare well.
 */
export function normalizePaAnswer(text: string): string {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function paAcceptedAnswers(answer: string, accept?: string[]): string[] {
  return [answer, ...(accept ?? [])].map(normalizePaAnswer);
}
