/**
 * Islamic Studies track — two courses requested by the platform owner:
 *
 *   1. «ما لا يسع المسلم جهله» — د. سامح الجنداوي
 *   2. «سلسلة تأسيس وعي المسلم المعاصر» — د. أيمن عبد الرحيم
 *
 * HARD CONTENT RULES
 * - No videos, links, durations or lesson bodies are invented here. Every
 *   `youtubeId`, duration and resource below comes from the verified official
 *   playlist (or the instructor's verified channel) and was checked before
 *   being committed.
 * - Lesson titles stay honest and generic (`المحاضرة الأولى` …): the published
 *   videos do not expose individual topic titles, so we do not invent any.
 * - The moment modules exist, every consumer below picks them up: course page,
 *   lesson route, progress, sitemap, search and the home band.
 *
 * CONVENTIONS
 * 1. Modules have stable ids (`lectures`, `level-1`, `level-2`).
 * 2. Lessons use `${courseId}-01`, `-02`, … so progress stays stable across
 *    renames and never collides between the two courses.
 * 3. `duration` is ISO-8601, converted from YouTube's published length.
 * 4. Course-level `resources` hold the links; module-level `resources` hold the
 *    PDFs that belong to that level, so a lesson page can show exactly the
 *    material for its own module.
 */

export type ReligiousCourseId = "islam-essentials" | "contemporary-awareness";

export type ReligiousCategoryId = "foundations" | "contemporary";

export interface ReligiousCategory {
  id: ReligiousCategoryId;
  label: string;
  labelEn: string;
}

export interface ReligiousResource {
  label: string;
  labelEn: string;
  url: string;
  kind: "pdf" | "link";
  note?: string;
  noteEn?: string;
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
  /** Playlist that contains this module's lectures. */
  playlistUrl?: string;
  /** PDFs and links that belong to this level/module only. */
  resources?: ReligiousResource[];
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
  /** Full verified playlist for the course (module playlists win when set). */
  playlistUrl?: string;
  /** Verified instructor/channel page. */
  channelUrl?: string;
  /** Course-wide links: playlists, channels, official pages. */
  resources?: ReligiousResource[];
  modules: ReligiousModule[];
}

export const RELIGIOUS_CATEGORIES: ReligiousCategory[] = [
  { id: "foundations", label: "أساسيات الدين", labelEn: "Faith foundations" },
  { id: "contemporary", label: "الوعي المعاصر", labelEn: "Contemporary awareness" },
];

const SAMEH_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLiICC_-DcP0QZ1hBiSqtW_u9OnKyD6w7i";
const SAMEH_CHANNEL = "https://www.youtube.com/c/SamehElgendawey";
const SAMEH_TELEGRAM = "https://t.me/samehelgendawey";
const SAMEH_BOOK = "https://t.me/samehelgendawey/1196";

const AYMAN_LEVEL1_PLAYLIST =
  "https://www.youtube.com/playlist?list=PL9hkk6GeaGBfx5sWy5wWOAdJTEfHnxhGk";
const AYMAN_LEVEL2_PLAYLIST =
  "https://www.youtube.com/playlist?list=PL9hkk6GeaGBeMbSVTmPIKsEmrDKNU49cK";

const ARABIC_ORDINALS = [
  "الأولى",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
  "العاشرة",
  "الحادية عشرة",
  "الثانية عشرة",
  "الثالثة عشرة",
  "الرابعة عشرة",
  "الخامسة عشرة",
  "السادسة عشرة",
  "السابعة عشرة",
] as const;

const SAMEH_LECTURE_TITLES = ARABIC_ORDINALS.map((ordinal) => `المحاضرة ${ordinal}`);

/**
 * Verified order, ids and durations from the complete «ما لا يسع المسلم جهله»
 * playlist. Titles published by the instructor expose lecture numbers only, so
 * the lesson titles below mirror them exactly.
 */
const SAMEH_LECTURES: { youtubeId: string; duration: string }[] = [
  { youtubeId: "XT85mB1592E", duration: "PT23M34S" },
  { youtubeId: "LzUKueuMhcA", duration: "PT23M37S" },
  { youtubeId: "uzEpFJQrfrk", duration: "PT20M33S" },
  { youtubeId: "r1AlCibOdb0", duration: "PT27M24S" },
  { youtubeId: "pUzq6tZhdz8", duration: "PT24M21S" },
  { youtubeId: "0gdNacWsxp4", duration: "PT27M27S" },
  { youtubeId: "l8oKpVPn9f8", duration: "PT35M40S" },
  { youtubeId: "Sy_TwBquhRo", duration: "PT32M46S" },
  { youtubeId: "gWyPeE1R13A", duration: "PT35M46S" },
  { youtubeId: "qbongtExcyU", duration: "PT36M29S" },
  { youtubeId: "VdXkISZGvrU", duration: "PT55M7S" },
  { youtubeId: "MsiDveJBws4", duration: "PT34M30S" },
  { youtubeId: "fVxlUUOR60g", duration: "PT23M56S" },
  { youtubeId: "-F23TtPNjPA", duration: "PT38M47S" },
  { youtubeId: "cyPd0ADaY0c", duration: "PT32M37S" },
  { youtubeId: "ubzSOafPNKA", duration: "PT47M48S" },
  { youtubeId: "IarxW0IyDkU", duration: "PT36M45S" },
];

const AYMAN_LEVEL1_LECTURES: { youtubeId: string; duration: string }[] = [
  { youtubeId: "ei9FVKHZxxM", duration: "PT2H2M22S" },
  { youtubeId: "lGZqHmcSn9Y", duration: "PT1H55M50S" },
  { youtubeId: "pmX51IzHgGI", duration: "PT1H54M53S" },
  { youtubeId: "zZBZ0w2bHQg", duration: "PT1H26M32S" },
  { youtubeId: "IW4PQHB7Xc4", duration: "PT1H36M45S" },
  { youtubeId: "9Wia-bHixgM", duration: "PT1H48M1S" },
  { youtubeId: "NNKT9KqZTfY", duration: "PT1H31M8S" },
  { youtubeId: "XED86_mSFTg", duration: "PT1H49M58S" },
  { youtubeId: "dFvNQRdZ_RQ", duration: "PT2H10M30S" },
];

const AYMAN_LEVEL2_LECTURES: { youtubeId: string; duration: string }[] = [
  { youtubeId: "f_8omvN42K4", duration: "PT2H8M43S" },
  { youtubeId: "0dKYTshQolw", duration: "PT2H10M1S" },
  { youtubeId: "7zzCfrNK__g", duration: "PT1H42M15S" },
  { youtubeId: "u0ebuWN7tzc", duration: "PT2H8M42S" },
  { youtubeId: "S_Lh1-gq6MU", duration: "PT1H32M13S" },
  { youtubeId: "uQbY860_cRQ", duration: "PT1H58M11S" },
  { youtubeId: "197B3SlGI90", duration: "PT1H54M42S" },
  { youtubeId: "pXAm1odzavI", duration: "PT1H27M28S" },
];

function samehLessons(): ReligiousLesson[] {
  return SAMEH_LECTURES.map((lecture, index) => ({
    id: `islam-essentials-${String(index + 1).padStart(2, "0")}`,
    title: SAMEH_LECTURE_TITLES[index],
    titleEn: `Lecture ${index + 1}`,
    description: `المحاضرة رقم ${index + 1} من دورة «ما لا يسع المسلم جهله» للدكتور سامح الجنداوي.`,
    descriptionEn: `Lecture ${index + 1} of Dr. Sameh El-Gendawy's course What a Muslim Cannot Afford to Ignore.`,
    youtubeId: lecture.youtubeId,
    duration: lecture.duration,
  }));
}

function aymanLessons(
  lectures: { youtubeId: string; duration: string }[],
  level: 1 | 2,
  startIndex: number
): ReligiousLesson[] {
  return lectures.map((lecture, index) => {
    const number = index + 1;
    const id = `contemporary-awareness-${String(startIndex + index).padStart(2, "0")}`;
    return {
      id,
      title: `المحاضرة ${ARABIC_ORDINALS[index]}`,
      titleEn: `Lecture ${number}`,
      description: `المحاضرة رقم ${number} من المستوى ${level === 1 ? "الأول" : "الثاني"} في سلسلة «تأسيس وعي المسلم المعاصر» للدكتور أيمن عبد الرحيم.`,
      descriptionEn: `Lecture ${number} of Level ${level} in Dr. Ayman Abdel-Rahman's series Building the Contemporary Muslim's Awareness.`,
      youtubeId: lecture.youtubeId,
      duration: lecture.duration,
    };
  });
}

export const religiousCourses: ReligiousCourse[] = [
  {
    id: "islam-essentials",
    number: 1,
    title: "ما لا يسع المسلم جهله",
    titleEn: "What a Muslim Cannot Afford to Ignore",
    instructor: "د. سامح الجنداوي",
    instructorEn: "Dr. Sameh El-Gendawy",
    description:
      "دورة تأسيسية كاملة في سبع عشرة محاضرة، تعرض ما لا يسع المسلم جهله من أصول دينه، بأسلوب مبسط ومنظم يناسب المبتدئ.",
    descriptionEn:
      "A complete seventeen-lecture foundational course covering the essential knowledge every Muslim needs, explained simply and structured for beginners.",
    category: "foundations",
    tags: ["أساسيات الدين", "المعرفة الإسلامية"],
    tagsEn: ["Faith foundations", "Islamic knowledge"],
    cover: "/courses/islam-essentials.svg",
    coverAlt: "غلاف دورة ما لا يسع المسلم جهله — نمط هندسي إسلامي كحلي وذهبي",
    coverAltEn:
      "Cover for What a Muslim Cannot Afford to Ignore — navy and gold Islamic geometric pattern",
    color: "from-amber-400 to-orange-500",
    icon: "book",
    playlistUrl: SAMEH_PLAYLIST,
    channelUrl: SAMEH_CHANNEL,
    resources: [
      {
        label: "قائمة المحاضرات الكاملة على YouTube",
        labelEn: "Complete lecture playlist on YouTube",
        url: SAMEH_PLAYLIST,
        kind: "link",
      },
      {
        label: "القناة الرسمية على YouTube",
        labelEn: "Official YouTube channel",
        url: SAMEH_CHANNEL,
        kind: "link",
      },
      {
        label: "القناة الرسمية على تيليجرام",
        labelEn: "Official Telegram channel",
        url: SAMEH_TELEGRAM,
        kind: "link",
      },
    ],
    modules: [
      {
        id: "lectures",
        title: "المحاضرات",
        titleEn: "Lectures",
        description:
          "المحاضرات السبع عشرة كاملة، بترتيب نشرها الرسمي، وكتاب الدورة من القناة الرسمية.",
        descriptionEn:
          "All seventeen lectures in their official published order, plus the course book from the official channel.",
        playlistUrl: SAMEH_PLAYLIST,
        resources: [
          {
            label: "كتاب الدورة «ما لا يسع المسلم جهله» (PDF)",
            labelEn: "Course book “What a Muslim Cannot Afford to Ignore” (PDF)",
            url: SAMEH_BOOK,
            kind: "pdf",
            note: "منشور القناة الرسمية على تيليجرام · ٢.٧ ميجابايت",
            noteEn: "Official Telegram channel post · 2.7 MB",
          },
        ],
        lessons: samehLessons(),
      },
    ],
  },
  {
    id: "contemporary-awareness",
    number: 2,
    title: "سلسلة تأسيس وعي المسلم المعاصر",
    titleEn: "Building the Contemporary Muslim's Awareness",
    instructor: "د. أيمن عبد الرحيم",
    instructorEn: "Dr. Ayman Abdel-Rahman",
    description:
      "سلسلة كاملة في سبع عشرة محاضرة موزعة على مستويين، تبني وعيًا إسلاميًا معاصرًا وتربط بين أصول الدين وقضايا الواقع بلغة واضحة.",
    descriptionEn:
      "A complete seventeen-lecture series across two levels that builds contemporary Islamic awareness, connecting the foundations of the faith with today's realities in clear language.",
    category: "contemporary",
    tags: ["الوعي المعاصر", "الفكر الإسلامي"],
    tagsEn: ["Contemporary awareness", "Islamic thought"],
    cover: "/courses/contemporary-awareness.svg",
    coverAlt: "غلاف سلسلة تأسيس وعي المسلم المعاصر — قوس إسلامي ومصباح كحلي وذهبي",
    coverAltEn:
      "Cover for Building the Contemporary Muslim's Awareness — Islamic arch and lantern in navy and gold",
    color: "from-cyan-400 to-teal-500",
    icon: "compass",
    playlistUrl: AYMAN_LEVEL1_PLAYLIST,
    resources: [
      {
        label: "المستوى الأول على YouTube — القائمة الكاملة",
        labelEn: "Level 1 on YouTube — complete playlist",
        url: AYMAN_LEVEL1_PLAYLIST,
        kind: "link",
      },
      {
        label: "المستوى الثاني على YouTube — القائمة الكاملة",
        labelEn: "Level 2 on YouTube — complete playlist",
        url: AYMAN_LEVEL2_PLAYLIST,
        kind: "link",
      },
    ],
    modules: [
      {
        id: "level-1",
        title: "المستوى الأول",
        titleEn: "Level 1",
        description: "تسع محاضرات في المستوى الأول من السلسلة.",
        descriptionEn: "Nine lectures from the first level of the series.",
        playlistUrl: AYMAN_LEVEL1_PLAYLIST,
        resources: [
          {
            label: "تلخيص المستوى الأول (PDF)",
            labelEn: "Level 1 summary (PDF)",
            url: "/religious/contemporary-awareness-level1-summary.pdf",
            kind: "pdf",
            note: "١٢ صفحة · إعداد باسل محمد مؤنس",
            noteEn: "12 pages · prepared by Basel Mohamed Moenes",
          },
          {
            label: "مصطلحات الدورة (PDF)",
            labelEn: "Course terminology (PDF)",
            url: "/religious/contemporary-awareness-terms.pdf",
            kind: "pdf",
            note: "٥ صفحات",
            noteEn: "5 pages",
          },
        ],
        lessons: aymanLessons(AYMAN_LEVEL1_LECTURES, 1, 1),
      },
      {
        id: "level-2",
        title: "المستوى الثاني",
        titleEn: "Level 2",
        description: "ثماني محاضرات في المستوى الثاني من السلسلة.",
        descriptionEn: "Eight lectures from the second level of the series.",
        playlistUrl: AYMAN_LEVEL2_PLAYLIST,
        resources: [
          {
            label: "ملخص المستوى الثاني (PDF)",
            labelEn: "Level 2 summary (PDF)",
            url: "/religious/contemporary-awareness-level2-summary.pdf",
            kind: "pdf",
            note: "٣٨ صفحة",
            noteEn: "38 pages",
          },
        ],
        lessons: aymanLessons(AYMAN_LEVEL2_LECTURES, 2, 10),
      },
    ],
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

/** Convert an ISO-8601 duration ("PT1H55M50S") to the track's clock format. */
export function formatReligiousDuration(iso?: string): string {
  if (!iso) return "";
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return "";
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** All PDFs attached to a module, falling back to the course-level PDFs. */
export function religiousResourcesOfModule(
  course: ReligiousCourse,
  module: ReligiousModule
): ReligiousResource[] {
  const moduleResources = module.resources ?? [];
  const coursePdfs = (course.resources ?? []).filter((resource) => resource.kind === "pdf");
  const seen = new Set<string>();
  return [...moduleResources, ...coursePdfs].filter((resource) => {
    if (seen.has(resource.url)) return false;
    seen.add(resource.url);
    return true;
  });
}

/** Every unique resource attached to a course: course links + module PDFs. */
export function religiousResourcesOfCourse(course: ReligiousCourse): ReligiousResource[] {
  const seen = new Set<string>();
  const all = [
    ...(course.resources ?? []),
    ...course.modules.flatMap((module) => module.resources ?? []),
  ];
  return all.filter((resource) => {
    if (seen.has(resource.url)) return false;
    seen.add(resource.url);
    return true;
  });
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
