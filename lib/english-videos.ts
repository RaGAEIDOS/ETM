/**
 * English-track data (Phase 4): videos from the @ZAmericanEnglish channel,
 * embedded (never re-hosted) and summarized in Arabic.
 *
 * HOW THIS GETS POPULATED
 * -----------------------
 * The video list is NOT written by hand. It is produced from the channel's
 * playlists by `scripts/fetch-playlists.mjs`:
 *
 *   YOUTUBE_API_KEY=AIza... node scripts/fetch-playlists.mjs
 *   # or, without a key: yt-dlp --flat-playlist -J <playlist-url>
 *
 * into `out/english-courses.json`, and then each entry is transcribed into
 * `englishVideos` below with a conservative Arabic summary written from the
 * video's title/description. Anything not verified against captions/
 * transcript MUST be committed with `reviewed: false`.
 *
 * NEVER invent video ids, titles or durations. Until the fetch has run,
 * `englishVideos` stays empty and every English route renders its
 * "content sync pending" state instead of fabricated content.
 */

export interface EnglishKeyTerm {
  en: string;
  ar: string;
  example?: { en: string; ar: string };
}

/** Practice items, matched to the course type. Exactly one correct answer each. */
export type EnglishPracticeItem =
  /** Grammar / vocabulary: choose the correct option. */
  | { type: "mcq"; prompt: string; options: string[]; answer: number; explanation?: string }
  /** Vocabulary / grammar: typed fill-in-the-blank. `accept` lists normalized acceptable answers; the first is canonical. */
  | { type: "fill"; prompt: string; answer: string; accept?: string[]; explanation?: string }
  /** Listening: text is read aloud (speechSynthesis, en-US); learner types what they hear. */
  | { type: "dictation"; say: string; answer: string; accept?: string[]; explanation?: string }
  /** Word order: `words` is the display (shuffled) order; `answer` is the correct sentence. */
  | { type: "order"; prompt: string; words: string[]; answer: string; explanation?: string }
  /** Matching pairs, scored as one item (all pairs must match). */
  | { type: "match"; prompt?: string; pairs: { left: string; right: string }[]; explanation?: string };

export interface EnglishVideo {
  /** ETM sequential id ("001", "002", …), stable across course additions. */
  id: string;
  /** Same as id, numeric. */
  number: number;
  /** Matches an EnglishCourse.id below. */
  courseId: string;
  /** The actual YouTube video id (embedded via youtube-nocookie). */
  youtubeId: string;
  /** Arabic title. */
  title: string;
  /** Original English title from the channel. */
  titleEn: string;
  /** Arabic section label. */
  section: string;
  /** English section label. */
  sectionEn: string;
  /** Full watch URL incl. &list= for "watch on YouTube" links. */
  youtube: string;
  /** ISO 8601 duration (e.g. "PT5M47S"), when fetched. */
  duration?: string;
  /** 2-4 sentences, Arabic, own words. Conservative when reviewed: false. */
  summary: string;
  /** 1-5 key terms. */
  terms: EnglishKeyTerm[];
  /** 3-5 practice items. */
  practice: EnglishPracticeItem[];
  /** False when the summary is inferred from title/description only. */
  reviewed: boolean;
}

export interface EnglishCourse {
  id: string;
  /** Arabic title. */
  title: string;
  /** Original channel title. */
  titleEn: string;
  description: string;
  playlistId: string;
  playlistUrl: string;
  color: string;
  icon: "sprout" | "graduation" | "mic" | "volume" | "messages";
}

/** Playlist ids come from the channel's own descriptions (see MASTER_PROMPT Phase 4). */
export const englishCourses: EnglishCourse[] = [
  {
    id: "en-zero",
    title: "الإنجليزية من الصفر — الدورة الكاملة للمبتدئين",
    titleEn: "English from Zero",
    description:
      "المسار الكامل للمبتدئ المطلق من قناة @ZAmericanEnglish: الأساسيات، التحية، الأرقام، الأبجدية، قواعد أساسية ومفردات يومية — مرتبة حسب ترتيب القناة الرسمي.",
    playlistId: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    color: "from-emerald-400 to-cyan-500",
    icon: "sprout",
  },
  {
    id: "en-grammar",
    title: "القواعد — أتقن قواعد اللغة الإنجليزية",
    titleEn: "Grammar",
    description:
      "قائمة القواعد الكاملة: الأزمنة، الأسئلة، الأدوات، الأفعال، الأفعال الناقصة وكل ما يمنح جملك بنية كاملة — درسًا درسًا مع تمارين.",
    playlistId: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    color: "from-cyan-400 to-blue-500",
    icon: "graduation",
  },
  {
    id: "en-phonetics",
    title: "الأصوات — النطق والأبجدية الصوتية",
    titleEn: "Phonetics",
    description:
      "قائمة الأصوات: الأبجدية الصوتية الدولية، أصوات العلة والساكنة، النبر، والأزواج المتشابهة — أساسية لكل مهارة تحدث بالإنجليزية.",
    playlistId: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    color: "from-violet-400 to-fuchsia-500",
    icon: "mic",
  },
  {
    id: "en-listening",
    title: "الاستماع — تدريب فهم المسموع",
    titleEn: "Listening",
    description:
      "قائمة الاستماع: حوارات مسموعة، مقاطع إخبارية وأغاني — الترياق لحاجز «أفهم القراءة لكن لا أفهم السماع».",
    playlistId: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    color: "from-amber-400 to-rose-500",
    icon: "volume",
  },
  {
    id: "en-conversation",
    title: "المحادثة — عبارات يومية وطلاقة",
    titleEn: "Conversation",
    description:
      "قائمة المحادثة: عبارات يومية، حوارات أساسية، وإنجليزية وظيفية للمحال والسفر والعمل والحديث القصير.",
    playlistId: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    playlistUrl: "https://www.youtube.com/playlist?list=PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    color: "from-cyan-400 to-violet-500",
    icon: "messages",
  },
];

/**
 * Suggested study path, following the order the channel itself recommends
 * (see the channel's study-order video https://youtu.be/9cDYq1cun8o):
 * the beginner course + reading in parallel, then listening + conversation,
 * one grammar lesson per day, then level 2.
 * `en-reading` and `en-listening-2` playlists exist on the channel but are
 * not collected yet — they show as "coming soon" and carry NO invented ids.
 */
export interface EnglishPathStep {
  courseId: string | null;
  title: string;
  titleEn: string;
  description: string;
  /** "now" = available today, "soon" = announced but not collected yet */
  status: "now" | "soon";
}

export const suggestedPath: EnglishPathStep[] = [
  {
    courseId: "en-zero",
    title: "١. دورة المبتدئين — البداية",
    titleEn: "1. English from Zero",
    description: "ابدأ هنا ولا تقفز: كل درس يبني على السابق بالترتيب.",
    status: "now",
  },
  {
    courseId: null,
    title: "٢. القراءة — بالتوازي مع دورة المبتدئين",
    titleEn: "2. Reading (in parallel)",
    description: "نصوص قصيرة كل يوم بالتوازي مع الدورة، لا بعدها. — قائمة القراءة لم تُضف بعد.",
    status: "soon",
  },
  {
    courseId: "en-grammar",
    title: "٣. القواعد — درس واحد يوميًا",
    titleEn: "3. Grammar - one lesson a day",
    description: "ليس درسًا في اليوم الواحد فقط، لكن لا تُكثر: درس واحد ثابت يوميًا.",
    status: "now",
  },
  {
    courseId: "en-listening",
    title: "٤. الاستماع — بعد أساسيات المبتدئين",
    titleEn: "4. Listening",
    description: "ابدأ الاستماع الفعلي بعد أول أسابيع من الدورة الأساسية.",
    status: "now",
  },
  {
    courseId: "en-conversation",
    title: "٥. المحادثة — بالتوازي مع الاستماع",
    titleEn: "5. Conversation (in parallel)",
    description: "استخدم ما تسمعه فورًا في حوارات يومية قصيرة.",
    status: "now",
  },
  {
    courseId: null,
    title: "٦. المستوى الثاني — استماع 2",
    titleEn: "6. Level 2 - Listening 2",
    description: "بعد إنهاء المستوى الأول من الاستماع والمحادثة. — لم تُضف بعد.",
    status: "soon",
  },
];

/**
 * THE VIDEO LIST IS EMPTY ON PURPOSE until `scripts/fetch-playlists.mjs`
 * has been run and each video transcribed with a verified (or flagged
 * `reviewed: false`) conservative summary. Do not add hand-written entries.
 */
export const englishVideos: EnglishVideo[] = [];

export function findEnglishCourse(id: string) {
  return englishCourses.find((c) => c.id === id);
}

export function englishVideosOfCourse(courseId: string) {
  return englishVideos.filter((v) => v.courseId === courseId);
}

export function findEnglishVideo(id: string) {
  return englishVideos.find((v) => v.id === id);
}

export function englishVideoIndex(id: string) {
  return englishVideos.findIndex((v) => v.id === id);
}

export function normalizePracticeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const ETM_ENGLISH_CREDIT =
  "Content by zAmericanEnglish on YouTube. This platform is not affiliated with the channel.";

export const ETM_ENGLISH_CHANNEL = "https://www.youtube.com/@ZAmericanEnglish";
