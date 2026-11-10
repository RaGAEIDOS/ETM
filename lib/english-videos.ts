import type { QuizQuestion } from "./types";

// English-track videos: same shape as ElZero videos, but extended with a
// `courseId` so multiple playlists live alongside each other.
// Video contents are generated from the official @ZAmericanEnglish channel
// only — never from paraphrasing or invented transcripts. Every video has
// `reviewed: true` (checked against the captions/transcript or fetched
// metadata) or `reviewed: false` (conservative summary from title/description).

export interface EnglishVideo {
  id: string;              // "001", "002"…
  number: number;         // numeric order (stable across courses)
  courseId: string;       // matches EnglishCourse.id
  title: string;          // Arabic title
  titleEn: string;        // original English title from the channel
  section: string;        // section label (Arabic)
  sectionEn: string;      // section label (English)
  youtube: string;        // full watch URL incl. &list=
  duration?: string;       // ISO 8601 (e.g. "PT5M47S"), when fetched
  summary: string;
  terms: { en: string; ar: string; example?: { en: string; ar: string } }[];
  quiz: QuizQuestion[];    // ≥2 questions, exactly one correct each
  reviewed: boolean;
}

export interface EnglishCourse {
  id: string;
  title: string;          // Arabic title
  titleEn: string;
  description: string;
  playlistId: string;
  videoCount: number;
  color: string;
  icon: string;
  /** urls below are original channel URLs — re-checked on each release */
  playlistUrl: string;
}

export const englishCourses: EnglishCourse[] = [
  {
    id: "en-zero",
    title: "English from zero — the complete beginner course",
    titleEn: "English from Zero",
    description:
      "Full beginner path from the @ZAmericanEnglish channel: essentials, greetings, numbers, alphabet, core grammar and daily vocabulary — sequenced to match the channel's order.",
    playlistId: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    videoCount: 0,
    color: "from-emerald-400 to-cyan-500",
    icon: "sprout",
  },
  {
    id: "en-grammar",
    title: "Grammar — master of English grammar",
    titleEn: "Grammar",
    description:
      "Complete grammar playlist — tenses, questions, articles, verbs, modals, and everything that gives your sentences structure. Covered lesson by lesson with exercises and quizzes.",
    playlistId: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    videoCount: 0,
    color: "from-cyan-400 to-blue-500",
    icon: "graduation",
  },
  {
    id: "en-phonetics",
    title: "Phonetics — spelling & pronunciation",
    titleEn: "Phonetics",
    description:
      "Phonetics playlist: international phonetic alphabet, vowel and consonant sounds, stress, and minimal pairs — essential for every spoken English skill.",
    playlistId: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    videoCount: 0,
    color: "from-violet-400 to-fuchsia-500",
    icon: "mic",
  },
  {
    id: "en-listening",
    title: "Listening — comprehension training",
    titleEn: "Listening",
    description:
      "Listening playlist: spoken dialogues, news clips and songs — the antidote to 'I understand reading but not listening'.",
    playlistId: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    videoCount: 0,
    color: "from-amber-400 to-rose-500",
    icon: "volume",
  },
  {
    id: "en-conversation",
    title: "Conversation — daily expressions & fluency",
    titleEn: "Conversation",
    description:
      "Conversation playlist: daily phrases, essential dialogues, and functional English for shops, travel, work and small-talk.",
    playlistId: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    videoCount: 0,
    color: "from-cyan-400 to-violet-500",
    icon: "messages",
  },
];

/** Suggested ordered path based on the channel's own study playlist. */
export const suggestedPath = [
  { course: "en-zero", label: "Beginner course" },
  { course: "en-grammar", label: "Grammar in parallel" },
  { course: "en-reading", label: "Reading (soon)" },
  { course: "en-listening", label: "Listening" },
  { course: "en-conversation", label: "Conversation" },
  { course: "en-phonetics", label: "Phonetics" },
];

export const englishVideos: EnglishVideo[] = [
  // populated in Phase 1 from the fetched playlist metadata
];

export const englishSectionsList = [
  { ar: "English from zero — Foundations", en: "Foundations", range: "Level 1 · Videos 001–…" },
  { ar: "Grammar", en: "Grammar", range: "Level 1 · Videos 001–…" },
  { ar: "Phonetics", en: "Phonetics", range: "Level 1 · Videos 001–…" },
  { ar: "Listening", en: "Listening", range: "Level 1 · Videos 001–…" },
  { ar: "Conversation", en: "Conversation", range: "Level 1 · Videos 001–…" },
];

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

export const ETM_ENGLISH_CREDIT =
  'The English content on this page mirrors public playlists on the @ZAmericanEnglish channel. ETM is not affiliated with or endorsed by that channel — it references them so you can watch the real thing for free. All credit goes to the channel.';
