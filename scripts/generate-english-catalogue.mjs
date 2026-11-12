/**
 * Generate lib/english-videos-bulk.ts from out/english-course-playlists.json.
 *
 * Real channel metadata only: video ids, titles, durations and playlist ids
 * come straight from the Invidious playlist API (YouTube is unreachable from
 * this environment). Every generated lesson is `reviewed: false` and has NO
 * invented terms/practice — the UI shows honest empty states until a human
 * reviews the video.
 *
 * Run: node scripts/generate-english-catalogue.mjs
 */
import fs from "node:fs";

const playlists = JSON.parse(fs.readFileSync("out/english-course-playlists.json", "utf8"));
const existingSource = fs.readFileSync("lib/english-videos.ts", "utf8");
const existingYoutubeIds = new Set(
  [...existingSource.matchAll(/youtubeId:\s*"([^"]+)"/g)].map((m) => m[1])
);

const COLORS = [
  "from-emerald-400 to-cyan-500",
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-fuchsia-500",
  "from-amber-400 to-rose-500",
  "from-cyan-400 to-violet-500",
  "from-lime-400 to-emerald-500",
  "from-rose-400 to-orange-500",
  "from-sky-400 to-indigo-500",
  "from-fuchsia-400 to-pink-500",
  "from-teal-400 to-cyan-500",
];

/**
 * `existing: true` means the course object already exists in
 * lib/english-videos.ts; only its videos are generated here (deduped).
 */
const COURSES = [
  // ── Level 1 ────────────────────────────────────────────────────────────
  {
    id: "en-zero",
    playlistId: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ",
    existing: true,
    sectionAr: "الإنجليزية من الصفر",
    sectionEn: "English from Zero",
  },
  {
    id: "en-grammar-1",
    playlistId: "PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr",
    title: "قواعد اللغة الإنجليزية — المستوى الأول",
    titleEn: "Grammar — Level 1",
    description:
      "شرح قواعد اللغة الإنجليزية كاملة للمبتدئين: الأزمنة، أدوات التعريف، والتركيبات الأساسية بأمثلة من الأفلام.",
    sectionAr: "قواعد اللغة الإنجليزية — المستوى الأول",
    sectionEn: "Grammar — Level 1",
    group: "level1",
    icon: "graduation",
  },
  {
    id: "en-phonetics",
    playlistId: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc",
    existing: true,
    sectionAr: "الصوتيات والنطق",
    sectionEn: "Phonetics",
  },
  {
    id: "en-listening",
    playlistId: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ",
    existing: true,
    sectionAr: "الاستماع",
    sectionEn: "Listening",
  },
  {
    id: "en-reading-1",
    playlistId: "PLp22-4PivYmI4PahZ0eyFjcihT7_VAs79",
    title: "القراءة — المستوى الأول",
    titleEn: "Reading — Level 1",
    description:
      "تدريب على قراءة الإنجليزية من خلال قصص قصيرة، مع شرح النطق الصحيح وبناء المفردات.",
    sectionAr: "القراءة — المستوى الأول",
    sectionEn: "Reading — Level 1",
    group: "level1",
    icon: "sprout",
  },
  {
    id: "en-writing-1",
    playlistId: "PLp22-4PivYmL_FPWuMEJQ7_thNjF7JS0Y",
    title: "الكتابة — المستوى الأول",
    titleEn: "Writing — Level 1",
    description:
      "تعلم كتابة موضوع تعبير بالإنجليزية خطوة بخطوة: التخطيط، الجمل، والربط بين الأفكار.",
    sectionAr: "الكتابة — المستوى الأول",
    sectionEn: "Writing — Level 1",
    group: "level1",
    icon: "sprout",
  },
  {
    id: "en-conversation",
    playlistId: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN",
    existing: true,
    sectionAr: "المحادثة",
    sectionEn: "Conversation",
  },
  {
    id: "en-tips-1",
    playlistId: "PLp22-4PivYmIz6Nq_ZDMNQn-kpB65BNpx",
    title: "نصائح التعلم — المستوى الأول",
    titleEn: "Learning tips — Level 1",
    description:
      "نصائح عملية لاختصار طريق تعلم الإنجليزية وتطوير النفس في المستوى الأول.",
    sectionAr: "نصائح التعلم — المستوى الأول",
    sectionEn: "Learning tips — Level 1",
    group: "level1",
    icon: "messages",
  },
  // ── Level 2 ────────────────────────────────────────────────────────────
  {
    id: "en-grammar-2",
    playlistId: "PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk",
    title: "قواعد اللغة الإنجليزية — المستوى الثاني",
    titleEn: "Grammar — Level 2",
    description:
      "تكملة قواعد اللغة الإنجليزية للمستوى الثاني مع شرح أعمق للأزمنة والتركيبات.",
    sectionAr: "قواعد اللغة الإنجليزية — المستوى الثاني",
    sectionEn: "Grammar — Level 2",
    group: "level2",
    icon: "graduation",
  },
  {
    id: "en-phonetics-2",
    playlistId: "PLp22-4PivYmIlFAg2fuo--xVxScz9_6h2",
    title: "الصوتيات والنطق — المستوى الثاني",
    titleEn: "Phonetics — Level 2",
    description:
      "شرح الصوتيات البريطانية والأمريكية وتحسين النطق — المستوى الثاني.",
    sectionAr: "الصوتيات والنطق — المستوى الثاني",
    sectionEn: "Phonetics — Level 2",
    group: "level2",
    icon: "mic",
  },
  {
    id: "en-listening-2",
    playlistId: "PLp22-4PivYmLmnv85IWWhNL4PtzcqC5mS",
    title: "الاستماع — المستوى الثاني",
    titleEn: "Listening — Level 2",
    description: "تقوية مهارة الاستماع وفهم اللهجات المختلفة — المستوى الثاني.",
    sectionAr: "الاستماع — المستوى الثاني",
    sectionEn: "Listening — Level 2",
    group: "level2",
    icon: "volume",
  },
  {
    id: "en-conversation-2",
    playlistId: "PLp22-4PivYmJl_sWnCTwL1yNFhq0AM7yk",
    title: "المحادثة اليومية — المستوى الثاني",
    titleEn: "Daily conversation — Level 2",
    description:
      "محادثات المواقف اليومية بالإنجليزية الأمريكية — المستوى الثاني.",
    sectionAr: "المحادثة اليومية — المستوى الثاني",
    sectionEn: "Daily conversation — Level 2",
    group: "level2",
    icon: "messages",
  },
  {
    id: "en-westerners-2",
    playlistId: "PLp22-4PivYmIgc6vCBbX4aLOiQ6oCoyvN",
    title: "الإنجليزية كما يتعلمها الغرب — المستوى الثاني",
    titleEn: "Learn like Westerners — Level 2",
    description:
      "تعلم الإنجليزية كما يتعلمها الغرب: التفكير والشرح بالإنجليزية — المستوى الثاني.",
    sectionAr: "الإنجليزية كما يتعلمها الغرب — المستوى الثاني",
    sectionEn: "Learn like Westerners — Level 2",
    group: "level2",
    icon: "graduation",
  },
  {
    id: "en-thinking-2",
    playlistId: "PLp22-4PivYmIsGY5eUPt67tnd2ZBfQpIw",
    title: "التفكير بالإنجليزية — المستوى الثاني",
    titleEn: "Thinking in English — Level 2",
    description:
      "تعلم أهم الكلمات والمصطلحات للتفكير باللغة الإنجليزية — المستوى الثاني.",
    sectionAr: "التفكير بالإنجليزية — المستوى الثاني",
    sectionEn: "Thinking in English — Level 2",
    group: "level2",
    icon: "messages",
  },
  {
    id: "en-stories-2",
    playlistId: "PLp22-4PivYmJV4nIwcfSzQpG0jkqn1jci",
    title: "الإنجليزية من خلال قصة — المستوى الثاني",
    titleEn: "English through a story — Level 2",
    description:
      "تعلم الإنجليزية من خلال قصة قصيرة، بشرح كامل باللغة الإنجليزية — المستوى الثاني.",
    sectionAr: "الإنجليزية من خلال قصة — المستوى الثاني",
    sectionEn: "English through a story — Level 2",
    group: "level2",
    icon: "sprout",
  },
  {
    id: "en-news-2",
    playlistId: "PLp22-4PivYmIZtXNNriSBxmSeCK7juwS_",
    title: "الأخبار الإنجليزية — المستوى الثاني",
    titleEn: "English news — Level 2",
    description: "نشرة أخبار إنجليزية مترجمة لبناء مفردات الأخبار — المستوى الثاني.",
    sectionAr: "الأخبار الإنجليزية — المستوى الثاني",
    sectionEn: "English news — Level 2",
    group: "level2",
    icon: "volume",
  },
  // ── Level 3 / 4 ────────────────────────────────────────────────────────
  {
    id: "en-grammar-3",
    playlistId: "PLp22-4PivYmJSejQkuui_SrYWObQW7pWt",
    title: "القواعد مشروحة بالإنجليزية — المستوى الثالث",
    titleEn: "Grammar in English — Level 3",
    description: "شرح قواعد اللغة الإنجليزية باللغة الإنجليزية — المستوى الثالث.",
    sectionAr: "القواعد مشروحة بالإنجليزية — المستوى الثالث",
    sectionEn: "Grammar in English — Level 3",
    group: "level3",
    icon: "graduation",
  },
  {
    id: "en-stories-3",
    playlistId: "PLp22-4PivYmKw-mErNjoEWnyic9U7k_NM",
    title: "التعلم من خلال القصص — المستوى الثالث",
    titleEn: "Stories — Level 3",
    description: "تعلم القراءة والمفردات من خلال قصص إنجليزية — المستوى الثالث.",
    sectionAr: "التعلم من خلال القصص — المستوى الثالث",
    sectionEn: "Stories — Level 3",
    group: "level3",
    icon: "sprout",
  },
  {
    id: "en-reading-4",
    playlistId: "PLp22-4PivYmKzTfbSx_nm0oCFSQ9-IpgL",
    title: "القراءة — المستوى الرابع",
    titleEn: "Reading — Level 4",
    description: "كورس القراءة والمفردات وطريقة النطق الصحيح — المستوى الرابع.",
    sectionAr: "القراءة — المستوى الرابع",
    sectionEn: "Reading — Level 4",
    group: "level3",
    icon: "sprout",
  },
  // ── Specialised / evergreen ────────────────────────────────────────────
  {
    id: "en-grammar",
    playlistId: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G",
    existing: true,
    sectionAr: "القواعد والأزمنة",
    sectionEn: "Grammar & tenses",
  },
  {
    id: "en-translation-pro",
    playlistId: "PLp22-4PivYmJfGUFUJUR2IQlv8oI735hE",
    title: "الترجمة الإنجليزية الاحترافية",
    titleEn: "Professional translation",
    description:
      "كورس الترجمة الإنجليزية الاحترافية: أدوات الترجمة وصياغة النصوص.",
    sectionAr: "الترجمة الإنجليزية الاحترافية",
    sectionEn: "Professional translation",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-translation",
    playlistId: "PLp22-4PivYmISOyAhaSfLqrwDSpN6GDpG",
    title: "كورس الترجمة",
    titleEn: "Translation",
    description:
      "كورس الترجمة من الإنجليزية إلى العربية والعكس مع تدريبات عملية.",
    sectionAr: "كورس الترجمة",
    sectionEn: "Translation",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-wordsmith",
    playlistId: "PLp22-4PivYmKcPVkKIQ1fj4TBhFSkQ40C",
    title: "الروايات الأمريكية — Wordsmith",
    titleEn: "Wordsmith — American novels",
    description: "تعلم الإنجليزية من خلال روايات أمريكية — Wordsmith.",
    sectionAr: "الروايات الأمريكية — Wordsmith",
    sectionEn: "Wordsmith — American novels",
    group: "special",
    icon: "sprout",
  },
  {
    id: "en-dialect",
    playlistId: "PLp22-4PivYmIPxfMzIpbB766dcSrbdCug",
    title: "اللهجة الأمريكية والبريطانية",
    titleEn: "American & British dialect",
    description: "تعلم اللهجة الأمريكية والبريطانية والنطق الصحيح للكلمات.",
    sectionAr: "اللهجة الأمريكية والبريطانية",
    sectionEn: "American & British dialect",
    group: "special",
    icon: "mic",
  },
  {
    id: "en-slango",
    playlistId: "PLp22-4PivYmKsvZbvnVJo-oF4fJKVyUeV",
    title: "Slango — لغة الشارع",
    titleEn: "Slango — street English",
    description: "مفردات وتعبيرات عامية أمريكية من الشارع — Slango.",
    sectionAr: "Slango — لغة الشارع",
    sectionEn: "Slango — street English",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-cartoon",
    playlistId: "PLp22-4PivYmLp7sQVkZ_yHyZHQOXlZvOt",
    title: "الإنجليزية في قصة كرتونية",
    titleEn: "English in a cartoon story",
    description: "تعلم الإنجليزية من خلال قصة كرتونية قصيرة.",
    sectionAr: "الإنجليزية في قصة كرتونية",
    sectionEn: "English in a cartoon story",
    group: "special",
    icon: "sprout",
  },
  {
    id: "en-highschool",
    playlistId: "PLp22-4PivYmJxp3KmAFNyt2pkrU_5Apln",
    title: "منهج الثانوية العامة — إنجليزي",
    titleEn: "High-school English",
    description: "شرح منهج الثانوية العامة إنجليزي للصف الثالث الثانوي كاملًا.",
    sectionAr: "منهج الثانوية العامة — إنجليزي",
    sectionEn: "High-school English",
    group: "special",
    icon: "graduation",
  },
  {
    id: "en-phrase-it-up",
    playlistId: "PLp22-4PivYmJPNgoOumAWL1Hmsq_e6uUj",
    title: "Phrase it up",
    titleEn: "Phrase it up",
    description: "تعبيرات وأفعال مركبة إنجليزية — Phrase it up.",
    sectionAr: "Phrase it up",
    sectionEn: "Phrase it up",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-ask-joe",
    playlistId: "PLp22-4PivYmK1a3vHEw_bL_TclQUwpZsS",
    title: "Ask Joe",
    titleEn: "Ask Joe",
    description: "إجابات أسئلة المتعلمين حول اللغة الإنجليزية — Ask Joe.",
    sectionAr: "Ask Joe",
    sectionEn: "Ask Joe",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-pronunciation",
    playlistId: "PLp22-4PivYmLo5pyYSib-I69t2ktZjqcQ",
    title: "النطق الصحيح للكلمات",
    titleEn: "Pronunciation",
    description: "كيفية نطق الكلمات الإنجليزية بطريقة صحيحة.",
    sectionAr: "النطق الصحيح للكلمات",
    sectionEn: "Pronunciation",
    group: "special",
    icon: "mic",
  },
  {
    id: "en-bookworm",
    playlistId: "PLp22-4PivYmIsCOWJ0D8lXBsbKfcyc3So",
    title: "Bookworm — دودة الكتب",
    titleEn: "Bookworm",
    description: "دودة الكتب: قراءة ومراجعة كتب إنجليزية لبناء المفردات.",
    sectionAr: "Bookworm — دودة الكتب",
    sectionEn: "Bookworm",
    group: "special",
    icon: "sprout",
  },
  {
    id: "en-american-talk",
    playlistId: "PLp22-4PivYmLS0lJv05C0jDG3B7kO2uo7",
    title: "كلام أمريكاني",
    titleEn: "American talk",
    description: "تعبيرات ومفردات من الحياة اليومية الأمريكية.",
    sectionAr: "كلام أمريكاني",
    sectionEn: "American talk",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-ielts",
    playlistId: "PLp22-4PivYmL2wmHCHXvbbZWcQaTXIBTV",
    title: "IELTS — الكورس الاحترافي",
    titleEn: "IELTS",
    description: "كورس IELTS التحضيري من البداية: المهارات الأربع واستراتيجيات الاختبار.",
    sectionAr: "IELTS — الكورس الاحترافي",
    sectionEn: "IELTS",
    group: "special",
    icon: "graduation",
  },
  {
    id: "en-i-know",
    playlistId: "PLp22-4PivYmKTVrmFxV2EYpzzPaFs0M9F",
    title: "سلسلة I Know",
    titleEn: "I Know",
    description: "سلسلة I Know: إجابات سريعة عن أسئلة اللغة الإنجليزية.",
    sectionAr: "سلسلة I Know",
    sectionEn: "I Know",
    group: "special",
    icon: "messages",
  },
  {
    id: "en-english-bits",
    playlistId: "PLp22-4PivYmKFJFUO3JHaIAh7_Yq7Ka1_",
    title: "English Bits — دروس متنوعة",
    titleEn: "English Bits",
    description: "دروس قصيرة ومتنوعة في اللغة الإنجليزية — English Bits.",
    sectionAr: "English Bits — دروس متنوعة",
    sectionEn: "English Bits",
    group: "special",
    icon: "graduation",
  },
  {
    id: "en-qa",
    playlistId: "PLp22-4PivYmJhfUAwja19p7pQzn1wyTZA",
    title: "أسئلة المتابعين",
    titleEn: "Followers' Q&A",
    description: "أسئلة المتابعين وإجاباتها — لكل المستويات.",
    sectionAr: "أسئلة المتابعين",
    sectionEn: "Followers' Q&A",
    group: "special",
    icon: "messages",
  },
];

const missing = COURSES.filter((c) => !playlists[c.playlistId]);
if (missing.length > 0) {
  throw new Error(`Missing playlist data: ${missing.map((c) => c.playlistId).join(", ")}`);
}

function toIso(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
}

const curatedYoutubeIds = new Set(existingYoutubeIds);
const bulkCourses = [];
const bulkVideos = [];
let number = 21;
let colorIndex = 0;
let skippedCurated = 0;

for (const course of COURSES) {
  const p = playlists[course.playlistId];
  if (!course.existing) {
    bulkCourses.push({
      id: course.id,
      title: course.title,
      titleEn: course.titleEn,
      description: course.description,
      playlistId: course.playlistId,
      playlistUrl: `https://www.youtube.com/playlist?list=${course.playlistId}`,
      color: COLORS[colorIndex++ % COLORS.length],
      icon: course.icon,
      group: course.group,
    });
  }

  let order = 0;
  let added = 0;
  const courseSeen = new Set();
  for (const v of p.videos ?? []) {
    order++;
    // The 20 hand-curated lessons already exist in english-videos.ts.
    if (curatedYoutubeIds.has(v.videoId)) {
      skippedCurated++;
      continue;
    }
    // Keep each course complete: a video shared by two playlists appears in
    // both course lists (with its own ETM id). Only skip exact duplicates
    // inside the same playlist.
    if (courseSeen.has(v.videoId)) continue;
    courseSeen.add(v.videoId);
    bulkVideos.push({
      id: String(number).padStart(3, "0"),
      number,
      courseId: course.id,
      youtubeId: v.videoId,
      title: String(v.title ?? "").trim(),
      titleEn: String(v.title ?? "").trim(),
      section: course.sectionAr,
      sectionEn: course.sectionEn,
      youtube: `https://youtu.be/${v.videoId}?list=${course.playlistId}`,
      duration: toIso(v.lengthSeconds),
      summary: `الحلقة ${order} من سلسلة «${course.sectionAr}» على قناة @ZAmericanEnglish. هذا الوصف مبني على عنوان الفيديو فقط ولم تتم مراجعته مقابل محتوى الفيديو بعد؛ شاهد الفيديو للتفاصيل الكاملة.`,
      terms: [],
      practice: [],
      reviewed: false,
    });
    number++;
    added++;
  }
  console.log(
    `${course.id.padEnd(20)} playlist=${String(p.videos?.length ?? 0).padStart(3)} added=${String(added).padStart(3)} total=${bulkVideos.length}`
  );
}

const header = `/**
 * AUTO-GENERATED by scripts/generate-english-catalogue.mjs — do not hand-edit.
 *
 * Source: the @ZAmericanEnglish channel's own playlists, fetched through the
 * Invidious API on 2026-11-12 (out/english-course-playlists.json). Video ids,
 * titles, durations and playlist ids are REAL channel metadata; nothing is
 * invented. A video shared by two playlists stays in both courses so each
 * course list is complete (only exact duplicates inside one playlist are
 * dropped).
 *
 * Every lesson here is \`reviewed: false\` and has empty terms/practice on
 * purpose: the summary is inferred from the title only. A human must verify a
 * video before flipping \`reviewed\` or adding learning aids.
 */

import type { EnglishCourse, EnglishVideo } from "./english-videos";

export const englishCoursesBulk: EnglishCourse[] = `;

const out = `${header}${JSON.stringify(bulkCourses, null, 2)};\n\nexport const englishVideosBulk: EnglishVideo[] = ${JSON.stringify(
  bulkVideos,
  null,
  2
)};\n`;

fs.writeFileSync("lib/english-videos-bulk.ts", out);
console.log(
  `\nWROTE lib/english-videos-bulk.ts — ${bulkCourses.length} new courses, ${bulkVideos.length} new videos (${skippedCurated} curated skipped)`
);

const expected = Object.values(playlists).reduce((n, p) => n + (p.videos?.length ?? 0), 0) - skippedCurated;
if (bulkVideos.length !== expected) {
  throw new Error(`Expected ${expected} bulk videos, wrote ${bulkVideos.length}`);
}
