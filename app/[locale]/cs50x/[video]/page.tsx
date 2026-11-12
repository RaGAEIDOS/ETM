import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  ExternalLink,
  FileText,
  Wrench,
} from "lucide-react";
import {
  CS50X_LECTURES,
  findCs50xLecture,
  cs50xLectureIndex,
  shortDuration,
} from "@/lib/cs50x";
import Cs50xVideoFacade from "@/components/cs50x/Cs50xVideoFacade";
import Cs50xCompletionBar from "@/components/cs50x/Cs50xCompletionBar";
import Cs50xLessonPanel from "@/components/cs50x/Cs50xLessonPanel";
import Cs50xCredit from "@/components/cs50x/Cs50xCredit";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "المحاضرة غير موجودة",
    metaTitle: (n: number, title: string) => `المحاضرة ${formatNumber(n)}: ${title}`,
    breadcrumb: "مسار CS50x",
    lectureBadge: (n: number) => `محاضرة ${formatNumber(n)}`,
    watch: "شاهد على YouTube",
    playlist: "قائمة التشغيل الرسمية",
    previous: "المحاضرة السابقة",
    next: "المحاضرة التالية",
    ended: "أنهيت كل محاضرات CS50x! قدّم طلب الشهادة من صفحة المسار.",
    week: "صفحة الأسبوع على الموقع الرسمي",
    pset: "التكليف على الموقع الرسمي",
    notes: "ملاحظات الأسبوع الرسمية",
    creditVideo: "شاهد المحاضرة الأصلية",
    creditPlaylist: "قائمة المحاضرات الرسمية",
  },
  en: {
    metaNotFound: "Lecture not found",
    metaTitle: (n: number, title: string) => `Lecture ${n}: ${title}`,
    breadcrumb: "CS50x track",
    lectureBadge: (n: number) => `Lecture ${n}`,
    watch: "Watch on YouTube",
    playlist: "Official playlist",
    previous: "Previous lecture",
    next: "Next lecture",
    ended: "You finished every CS50x lecture! Claim the certificate from the track page.",
    week: "Week page on the official site",
    pset: "Problem set on the official site",
    notes: "Official week notes",
    creditVideo: "Watch the original lecture",
    creditPlaylist: "Official lecture playlist",
  },
} as const;

export function generateStaticParams() {
  return CS50X_LECTURES.map((lecture) => ({ video: lecture.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const lecture = findCs50xLecture(params.video);
  if (!lecture) return { title: COPY[locale].metaNotFound };
  return pageMetadata({
    locale,
    path: `/cs50x/${lecture.id}`,
    title: COPY[locale].metaTitle(lecture.number, lecture.title),
    description: lecture.summary,
  });
}

export default function Cs50xLecturePage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const lecture = findCs50xLecture(params.video);
  if (!lecture) notFound();

  const idx = cs50xLectureIndex(lecture.id);
  const prev = idx > 0 ? CS50X_LECTURES[idx - 1] : null;
  const next = idx >= 0 && idx < CS50X_LECTURES.length - 1 ? CS50X_LECTURES[idx + 1] : null;
  const durationMinutes = Math.max(1, Math.round(lecture.durationSeconds / 60));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/cs50x")}
          className="transition-colors hover:text-rose-300"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="text-slate-300">{c.lectureBadge(lecture.number)}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full bg-gradient-to-l from-rose-400 to-orange-500 px-3 py-1 text-xs font-black text-ink-950"
            dir="auto"
          >
            {lecture.week}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
            {isArBadge(locale, lecture.number)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400" dir="ltr">
            {shortDuration(lecture.durationSeconds)}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl" dir="auto">
          {lecture.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={lecture.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-5 w-5 text-rose-400" />
            {c.watch}
          </a>
          <a
            href={lecture.weekUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
          >
            {c.week}
            <ExternalLink className="h-4 w-4" />
          </a>
          {lecture.psetUrl && (
            <a
              href={lecture.psetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <Wrench className="h-4 w-4 text-rose-400" />
              {c.pset}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {lecture.notesUrl && (
            <a
              href={lecture.notesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <FileText className="h-4 w-4 text-rose-400" />
              {c.notes}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>

      {/* Player */}
      <div className="mt-6">
        <Cs50xVideoFacade
          youtubeId={lecture.youtubeId}
          title={lecture.title}
          videoId={lecture.id}
          courseId="cs50x"
          playlistUrl={lecture.youtube}
        />
        <p className="mt-2 text-right font-mono text-[11px] text-slate-600">
          {formatNumber(durationMinutes)} min · CS50x — Harvard University
        </p>
      </div>

      {/* Completion bar */}
      <div className="mt-4">
        <Cs50xCompletionBar videoId={lecture.id} courseId="cs50x" />
      </div>

      {/* Interactive panel */}
      <Cs50xLessonPanel lecture={lecture} />

      {/* Prev / next */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={localePath(locale, `/cs50x/${prev.id}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            {c.previous}
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={localePath(locale, `/cs50x/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-rose-300 ring-1 ring-rose-500/25 transition-colors hover:bg-white/10"
          >
            {c.next}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        ) : (
          <span className="text-sm text-slate-500">{c.ended}</span>
        )}
      </div>

      <Cs50xCredit
        videoUrl={lecture.youtube}
        videoLabel={c.creditVideo}
        playlistLabel={c.creditPlaylist}
      />
    </div>
  );
}

function isArBadge(
  locale: string,
  n: number,
): string {
  return locale === "ar" ? `المحاضرة ${formatNumber(n)} من ١٣` : `Lecture ${n} of 13`;
}
