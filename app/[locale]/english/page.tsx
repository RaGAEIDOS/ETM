import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  PlayCircle,
  Sprout,
  Mic,
  Volume2,
  MessagesSquare,
  ListChecks,
  Layers,
  NotebookPen,
  ArrowLeft,
  ExternalLink,
  CloudOff,
  Route,
  CheckCircle2,
} from "lucide-react";
import {
  englishCourses,
  englishVideosOfCourse,
  suggestedPath,
  ETM_ENGLISH_CHANNEL,
} from "@/lib/english-videos";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber, localePath } from "@/lib/i18n/config";
import ResumeCard from "@/components/ResumeCard";
import EnglishCourseProgress from "@/components/english/EnglishCourseProgress";
import EnglishReviewDueCard from "@/components/english/EnglishReviewDueCard";
import EnglishCredit from "@/components/english/EnglishCredit";

const COPY = {
  ar: {
    metaTitle: "قسم الإنجليزية — تعلم الإنجليزية مجانًا",
    metaDescription:
      "دورات كاملة من قناة @ZAmericanEnglish مجانًا: من الصفر، القواعد، الأصوات، الاستماع والمحادثة — مع ملخصات عربية وفلاش كارد وتدريب على النطق وحفظ الموضع تلقائيًا.",
    eyebrow: "الإنجليزية مجانًا · من محتوى @ZAmericanEnglish",
    titleLead: "قسم",
    titleAccent: "الإنجليزية",
    intro:
      "كل فيديو من قناة @ZAmericanEnglish المجانية — مدمج هنا داخل المنصة مع ملخص عربي، مصطلحات وفلاش كارد، تمارين متنوعة وتدريب على النطق. شاهد بالسرعة التي تناسبك، وسيُحفظ موضعك تلقائيًا.",
    channel: "القناة على YouTube",
    syncPending:
      "يتم الآن مزامنة الفيديوهات من القناة — ستظهر الدورات والدروس هنا فور وصولها. يمكنك استكشاف مسارات القناة بالضغط على روابط القوائم بالأسفل.",
    whatToDo: ["ملخص عربي لكل فيديو", "مصطلحات + فلاش كارد", "تمارين ومحادثة", "تتبع تقدمك وحفظ الموضع"],
    coursesTitle: "الدورات من القناة",
    lessonsTitle: "دروس هذه الدورة",
    videoCount: (n: number) => `${formatNumber(n)} فيديو`,
    openPlaylist: "افتح القائمة على YouTube",
    pathTitle: "المسار المقترح — ترتيب القناة الرسمي",
    pathNow: "متاح الآن",
    pathSoon: "قادم قريبًا",
    continueTitle: "أكمل من حيث توقفت",
  },
  en: {
    metaTitle: "English section — learn English for free",
    metaDescription:
      "Complete @ZAmericanEnglish courses for free: from zero, grammar, phonetics, listening and conversation — with Arabic summaries, flashcards, speaking drills and automatic resume.",
    eyebrow: "Free English · powered by @ZAmericanEnglish",
    titleLead: "English",
    titleAccent: "Section",
    intro:
      "Every video comes from the free @ZAmericanEnglish channel — embedded right here with an Arabic summary, key-term flashcards, mixed practice drills and a pronunciation tab. Watch at your own pace; your position is saved automatically.",
    channel: "The channel on YouTube",
    syncPending:
      "We're syncing the videos from the channel right now — courses and lessons will appear here as soon as they land. Explore the channel playlists via the links below in the meantime.",
    whatToDo: ["Arabic summary per video", "Key terms + flashcards", "Drills & conversation", "Progress tracking & resume"],
    coursesTitle: "Courses from the channel",
    lessonsTitle: "Lessons in this course",
    videoCount: (n: number) => `${formatNumber(n)} videos`,
    openPlaylist: "Open the playlist on YouTube",
    pathTitle: "Suggested path — the channel's own order",
    pathNow: "Available now",
    pathSoon: "Coming soon",
    continueTitle: "Continue where you left off",
  },
} as const;

const COURSE_ICONS = {
  sprout: Sprout,
  graduation: GraduationCap,
  mic: Mic,
  volume: Volume2,
  messages: MessagesSquare,
} as const;

/** "PT8M36S" -> "8:36" (display only; the ISO string stays the source of truth). */
function formatDuration(iso?: string): string {
  if (!iso) return "";
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return "";
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${min}:${String(s).padStart(2, "0")}`;
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/english",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function EnglishHubPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const totalVideos = englishCourses.reduce((sum, course) => sum + englishVideosOfCourse(course.id).length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-300">
          <GraduationCap className="h-4 w-4" />
          {c.eyebrow}
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-black text-white leading-tight">
          {c.titleLead}{" "}
          <span className="gradient-text">{c.titleAccent}</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">{c.intro}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          {c.whatToDo.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <a
            href={ETM_ENGLISH_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10"
          >
            <PlayCircle className="h-5 w-5 text-emerald-400" />
            {c.channel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Content-sync notice when videos have not been imported yet */}
      {totalVideos === 0 && (
        <div className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-5 text-sm leading-7 text-amber-200">
          <CloudOff className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
          {c.syncPending}
        </div>
      )}

      {/* Continue where you left off */}
      <div className="mb-10">
        <ResumeCard variant="english" />
      </div>

      {/* Review queue entry */}
      <div className="mb-10">
        <EnglishReviewDueCard />
      </div>

      {/* Course cards */}
      <h2 className="mb-5 text-2xl font-black text-white">{c.coursesTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {englishCourses.map((course) => {
          const Icon = COURSE_ICONS[course.icon];
          const videos = englishVideosOfCourse(course.id);
          return (
            <div
              key={course.id}
              className="group flex flex-col rounded-2xl border border-white/10 bg-ink-900/60 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/25"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-black leading-7 text-white" dir="rtl">
                {course.title}
              </h3>
              <p dir="ltr" className="mt-0.5 text-xs font-bold uppercase tracking-wide text-emerald-400">
                {course.titleEn}
              </p>
              <p dir="rtl" className="mt-2 flex-1 text-sm leading-7 text-slate-400">
                {course.description}
              </p>
              <EnglishCourseProgress videoIds={videos.map((v) => v.id)} />
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <ListChecks className="h-4 w-4 text-emerald-400" />
                  {c.videoCount(videos.length)}
                </span>
                <a
                  href={course.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-300 hover:text-emerald-200"
                >
                  {c.openPlaylist}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson lists — only for courses with imported videos */}
      {englishCourses.map((course) => {
        const videos = englishVideosOfCourse(course.id);
        if (videos.length === 0) return null;
        return (
          <section key={course.id} className="mt-12">
            <h2 className="mb-4 flex flex-wrap items-center gap-2 text-2xl font-black text-white">
              <ListChecks className="h-6 w-6 text-emerald-400" />
              {c.lessonsTitle}
              <span dir="auto" className="text-sm font-bold text-slate-500">
                — {isAr ? course.title : course.titleEn}
              </span>
            </h2>
            <ol className="grid gap-2 sm:grid-cols-2">
              {videos.map((v) => (
                <li key={v.id}>
                  <Link
                    href={localePath(locale, `/english/${v.id}`)}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-xs font-bold text-emerald-300">
                      {v.id}
                    </span>
                    <span
                      dir="auto"
                      className="flex-1 truncate text-sm font-semibold text-slate-200 group-hover:text-white"
                    >
                      {isAr ? v.title : v.titleEn}
                    </span>
                    {v.duration && (
                      <span className="shrink-0 font-mono text-xs text-slate-500" dir="ltr">
                        {formatDuration(v.duration)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {/* Suggested path */}
      <div className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-black text-white">
          <Route className="h-6 w-6 text-emerald-400" />
          {c.pathTitle}
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestedPath.map((step, i) => {
            const isNow = step.status === "now";
            return (
              <li
                key={i}
                className={`rounded-2xl border p-5 ${
                  isNow
                    ? "border-emerald-500/20 bg-emerald-500/[0.05]"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span dir="auto" className="font-bold text-white">
                    {isAr ? step.title : step.titleEn}
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                      isNow
                        ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                        : "border-white/10 bg-white/5 text-slate-500"
                    }`}
                  >
                    {isNow ? c.pathNow : c.pathSoon}
                  </span>
                </div>
                <p dir="rtl" className="mt-2 text-xs leading-6 text-slate-400">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <EnglishCredit />
    </div>
  );
}
