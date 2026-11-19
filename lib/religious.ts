/**
 * Islamic Studies track — two courses requested by the platform owner:
 *
 *   1. «ما لا يسع المسلم جهله» — د. سامح الجنداوي
 *   2. «سلسلة تأسيس وعي المسلم المعاصر» — د. أيمن عبد الرحيم
 *
 * HARD CONTENT RULES
 * - No videos, links, durations or lesson bodies are invented here. Until a
 *   verified official source is supplied, `modules` stays empty and the UI
 *   renders an honest "content is being prepared" state.
 * - The moment real modules exist, every consumer below picks them up:
 *   course page, lesson route, progress, sitemap, search and the home band.
 *
 * HOW TO ADD CONTENT LATER
 * 1. Add a module to `modules` with a stable `id` (e.g. "module-1").
 * 2. Add lessons with ids following `${courseId}-01`, `-02`, … so progress
 *    stays stable across renames.
 * 3. Only fill `youtubeId` / `resources` with official, verified URLs.
 * 4. Keep the Arabic title exactly as published; `titleEn` is our translation.
 */

export type ReligiousCourseId = "islam-essentials" | "contemporary-awareness";

export type ReligiousCategoryId = "foundations" | "contemporary";

export interface ReligiousCategory {
  id: ReligiousCategoryId;
  label: string;
  labelEn: string;
}

export interface ReligiousLesson {
  /** Stable ETM id: `${courseId}-01`, `${courseId}-02`, … */
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  /** Only a verified official YouTube id; omitted until one exists. */
  youtubeId?: string;
  /** ISO-8601 duration, when the official video publishes one. */
  duration?: string;
  /** Official links only (author page, playlist, PDF). */
  resources?: { label: string; url: string }[];
}

export interface ReligiousModule {
  id: string;
  title: string;
  titleEn: string;
  description?: string;
  descriptionEn?: string;
  lessons: ReligiousLesson[];
}

export interface ReligiousCourse {
  id: ReligiousCourseId;
  number: number;
  title: string;
  titleEn: string;
  instructor: string;
  instructorEn: string;
  description: string;
  descriptionEn: string;
  category: ReligiousCategoryId;
  tags: string[];
  tagsEn: string[];
  /** Replace the file at this path to change the cover — no code change. */
  cover: string;
  coverAlt: string;
  coverAltEn: string;
  color: string;
  icon: "book" | "compass";
  modules: ReligiousModule[];
}

export const RELIGIOUS_CATEGORIES: ReligiousCategory[] = [
  { id: "foundations", label: "أساسيات الدين", labelEn: "Faith foundations" },
  { id: "contemporary", label: "الوعي المعاصر", labelEn: "Contemporary awareness" },
];

export const religiousCourses: ReligiousCourse[] = [
  {
    id: "islam-essentials",
    number: 1,
    title: "ما لا يسع المسلم جهله",
    titleEn: "What a Muslim Cannot Afford to Ignore",
    instructor: "د. سامح الجنداوي",
    instructorEn: "Dr. Sameh El-Gendawy",
    description:
      "دورة تأسيسية تعرض ما لا يسع المسلم جهله من أصول دينه، بأسلوب مبسط ومنظم يناسب المبتدئ.",
    descriptionEn:
      "A foundational course covering the essential knowledge every Muslim needs, explained simply and structured for beginners.",
    category: "foundations",
    tags: ["أساسيات الدين", "المعرفة الإسلامية"],
    tagsEn: ["Faith foundations", "Islamic knowledge"],
    cover: "/courses/islam-essentials.svg",
    coverAlt: "غلاف دورة ما لا يسع المسلم جهله — نمط هندسي إسلامي كحلي وذهبي",
    coverAltEn:
      "Cover for What a Muslim Cannot Afford to Ignore — navy and gold Islamic geometric pattern",
    color: "from-amber-400 to-orange-500",
    icon: "book",
    // Intentionally empty until verified official lessons are supplied.
    modules: [],
  },
  {
    id: "contemporary-awareness",
    number: 2,
    title: "سلسلة تأسيس وعي المسلم المعاصر",
    titleEn: "Building the Contemporary Muslim's Awareness",
    instructor: "د. أيمن عبد الرحيم",
    instructorEn: "Dr. Ayman Abdel-Rahman",
    description:
      "سلسلة تبني وعيًا إسلاميًا معاصرًا، وتربط بين أصول الدين وقضايا الواقع بلغة واضحة.",
    descriptionEn:
      "A series that builds contemporary Islamic awareness, connecting the foundations of the faith with today's realities in clear language.",
    category: "contemporary",
    tags: ["الوعي المعاصر", "الفكر الإسلامي"],
    tagsEn: ["Contemporary awareness", "Islamic thought"],
    cover: "/courses/contemporary-awareness.svg",
    coverAlt: "غلاف سلسلة تأسيس وعي المسلم المعاصر — قوس إسلامي ومصباح كحلي وذهبي",
    coverAltEn:
      "Cover for Building the Contemporary Muslim's Awareness — Islamic arch and lantern in navy and gold",
    color: "from-cyan-400 to-teal-500",
    icon: "compass",
    // Intentionally empty until verified official lessons are supplied.
    modules: [],
  },
];

export function findReligiousCourse(id: string): ReligiousCourse | null {
  return religiousCourses.find((course) => course.id === id) ?? null;
}

export function findReligiousCategory(id: string): ReligiousCategory | null {
  return RELIGIOUS_CATEGORIES.find((category) => category.id === id) ?? null;
}

export function religiousLessonsOfCourse(
  courseId: ReligiousCourseId | string
): ReligiousLesson[] {
  const course = findReligiousCourse(courseId);
  if (!course) return [];
  return course.modules.flatMap((module) => module.lessons);
}

export function religiousLessonIdsOfCourse(courseId: ReligiousCourseId | string): string[] {
  return religiousLessonsOfCourse(courseId).map((lesson) => lesson.id);
}

export function religiousLessonCount(course: ReligiousCourse): number {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

export function allReligiousLessons(): {
  course: ReligiousCourse;
  module: ReligiousModule;
  lesson: ReligiousLesson;
}[] {
  return religiousCourses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ course, module, lesson }))
    )
  );
}

export function findReligiousLesson(lessonId: string): {
  course: ReligiousCourse;
  module: ReligiousModule;
  lesson: ReligiousLesson;
} | null {
  return allReligiousLessons().find((entry) => entry.lesson.id === lessonId) ?? null;
}
