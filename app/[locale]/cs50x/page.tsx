import type { Metadata } from "next";
import {
  GraduationCap,
  ExternalLink,
  ListVideo,
  Sparkles,
  Route,
  CheckCircle2,
  Globe,
  MessageSquare,
} from "lucide-react";
import {
  CS50X_LECTURES,
  CS50X_TOTAL_SECONDS,
  CS50X_OFFICIAL_SITE,
  CS50X_PLAYLIST_URL,
  CS50X_CHANNEL,
  CS50X_CHANNEL_HANDLE,
  CS50X_EDX_URL,
} from "@/lib/cs50x";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber } from "@/lib/i18n/config";
import ResumeCard from "@/components/ResumeCard";
import Cs50xCourseProgress from "@/components/cs50x/Cs50xCourseProgress";
import Cs50xLectureList from "@/components/cs50x/Cs50xLectureList";
import Cs50xCertificateCard from "@/components/cs50x/Cs50xCertificateCard";
import Cs50xCredit from "@/components/cs50x/Cs50xCredit";

const COPY = {
  ar: {
    metaTitle: "CS50x — مقدمة علوم الحاسوب من Harvard (مجاني)",
    metaDescription:
      "مسار CS50x الكامل على ETM: كل محاضرات Harvard الرسمية (13 محاضرة) مدمجة من القناة الرسمية، مع ملخص عربي لكل محاضرة، بطاقات مصطلحات، وتمرين تدريبي، ومسار متابعة نحو شهادة CS50 المجانية.",
    eyebrow: "Harvard CS50x — مجاني بالكامل",
    titleLead: "CS50x",
    titleAccent: "Introduction to Computer Science",
    intro:
      "الدورة الأشهر في العالم — من Scratch و C إلى Python و SQL والويب و الذكاء الاصطناعي. كل محاضرة مدمجة هنا من القناة الرسمية لـ CS50، مع ملخص عربي ومصطلحات أساسية وتمرين فهم — شاهد بوقتك وتتبع تقدمك تلقائيًا.",
    catalogue: (videos: number, hours: number) =>
      `${formatNumber(videos)} محاضرات رسمية · ~${formatNumber(hours)} ساعة فيديو`,
    hoursLabel: "ساعة",
    whatToDo: [
      "ملخص عربي أصلي لكل محاضرة",
      "مصطلحات + بطاقات مراجعة",
      "تمرين MCQ/Fill لكل محاضرة",
      "متابعة التقدم والاستئناف التلقائي",
    ],
    official: "الموقع الرسمي للدورة",
    playlist: "قائمة التشغيل الرسمية",
    lecturesTitle: "المحاضرات — بترتيب المقرر الرسمي",
    continueTitle: "أكمل من حيث توقفت",
    certificateTitle: "شهادة CS50x المجانية",
    certificateIntro:
      "كل ما تحتاجه للشهادة مجاني تمامًا. أكمل 10 تكاليف (Problem Sets) والمشروع النهائي بدرجة ≥ ٧٠٪ في كل منها، ثم قدّم طلب الشهادة. لن تأخذ ETM أي خطوة نيابة عنك — هذه متابعة شخصية لك.",
    notesTitle: "متى تستخدم CS50x ومتى تكتفي بالفيديوهات هنا؟",
    notesIntro:
      "الشهادات والتقدير الرسمي تمرّ حصرًا عبر منصة الدورة على edX وبيئة cs50.dev. فيديوهاتنا وملخصاتنا وأدوات التدريب هنا للمذاكرة والفهم؛ التكليفات تُسلّم وتُقيّم هناك.",
    free: "مجاني 100% — بلا بطاقة ائتمان",
  },
  en: {
    metaTitle: "CS50x — Harvard's Introduction to Computer Science (free)",
    metaDescription:
      "The complete CS50x path on ETM: every official Harvard lecture (13 in total) embedded from the official CS50 channel, with Arabic summaries, key-term flashcards, practice drills and a tracker toward the free CS50 Certificate.",
    eyebrow: "Harvard CS50x — completely free",
    titleLead: "CS50x",
    titleAccent: "Introduction to Computer Science",
    intro:
      "The world's most famous intro to computer science — from Scratch and C to Python, SQL, the web and AI. Every lecture is embedded from the official CS50 channel, with an original Arabic summary, key terms and a comprehension drill; your progress is tracked automatically.",
    catalogue: (videos: number, hours: number) =>
      `${formatNumber(videos)} official lectures · ~${formatNumber(hours)} hours of video`,
    hoursLabel: "hours",
    whatToDo: [
      "Original Arabic summary per lecture",
      "Key terms + SRS flashcards",
      "MCQ / fill-in drill per lecture",
      "Automatic progress tracking & resume",
    ],
    official: "The official course site",
    playlist: "Official playlist",
    lecturesTitle: "The lectures — in the official syllabus order",
    continueTitle: "Continue where you left off",
    certificateTitle: "The free CS50 Certificate",
    certificateIntro:
      "Everything you need for the certificate is 100% free. Complete 10 problem sets and the final project with ≥ 70% in each, then claim the certificate. ETM takes no step on your behalf — this is a personal tracker for you.",
    notesTitle: "When to use edX instead of these videos",
    notesIntro:
      "Official grading and the certificate happen exclusively on the course's edX page and cs50.dev. Our videos, summaries and drills are for learning and revision; assignments are submitted and graded there.",
    free: "100% free — no credit card",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/cs50x",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function Cs50xHubPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const hours = Math.round(CS50X_TOTAL_SECONDS / 3600);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm font-bold text-rose-300">
          <GraduationCap className="h-4 w-4" />
          {c.eyebrow}
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-black text-white leading-tight">
          {c.titleLead}{" "}
          <span className="gradient-text">{c.titleAccent}</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">{c.intro}</p>
        <p className="mt-3 font-mono text-sm font-bold text-rose-300">
          {c.catalogue(CS50X_LECTURES.length, hours)}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          {c.free}
        </div>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          {c.whatToDo.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-rose-400" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a
            href={CS50X_OFFICIAL_SITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10"
          >
            <Globe className="h-5 w-5 text-rose-400" />
            {c.official}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={CS50X_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10"
          >
            <ListVideo className="h-5 w-5 text-rose-400" />
            {c.playlist}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={CS50X_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-300"
          >
            {CS50X_CHANNEL_HANDLE}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Continue where you left off */}
      <div className="mb-8">
        <ResumeCard variant="cs50x" />
      </div>

      {/* Overall progress */}
      <div className="mb-12 max-w-3xl">
        <Cs50xCourseProgress videoIds={CS50X_LECTURES.map((l) => l.id)} />
      </div>

      {/* Lecture list */}
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-black text-white">
        <Route className="h-6 w-6 text-rose-400" />
        {c.lecturesTitle}
      </h2>
      <Cs50xLectureList />

      {/* Certificate path */}
      <div className="mt-14">
        <h2 className="mb-3 flex items-center gap-2 text-2xl font-black text-white">
          <GraduationCap className="h-7 w-7 text-rose-400" />
          {c.certificateTitle}
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-7 text-slate-400">{c.certificateIntro}</p>
        <Cs50xCertificateCard />
      </div>

      {/* Note on edX */}
      <div className="mt-10 max-w-3xl">
        <h3 className="flex items-center gap-2 text-lg font-black text-white">
          <MessageSquare className="h-5 w-5 text-rose-400" />
          {c.notesTitle}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">{c.notesIntro}</p>
      </div>

      <Cs50xCredit />
    </div>
  );
}
