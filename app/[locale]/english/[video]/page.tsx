import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import {
  englishCourses,
  englishVideos,
  findEnglishCourse,
  findEnglishVideo,
} from "@/lib/english-videos";
import EnglishVideoFacade from "@/components/english/EnglishVideoFacade";
import EnglishCompletionBar from "@/components/english/EnglishCompletionBar";
import EnglishLessonPanel from "@/components/english/EnglishLessonPanel";
import EnglishCredit from "@/components/english/EnglishCredit";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "الفيديو غير موجود",
    metaTitle: (id: string, title: string) => `درس #${id}: ${title}`,
    breadcrumb: "قسم الإنجليزية",
    videoBadge: (id: string) => `درس #${id}`,
    watch: "شاهد على YouTube",
    playlist: "قائمة التشغيل على YouTube",
    previous: "الفيديو السابق",
    next: "الفيديو التالي",
    ended: "أكملت كل فيديوهات هذا المسار!",
    backToHub: "العودة إلى قسم الإنجليزية",
    creditVideo: "شاهد هذا الفيديو الأصلي",
    creditPlaylist: "قائمة التشغيل على YouTube",
  },
  en: {
    metaNotFound: "Video not found",
    metaTitle: (id: string, title: string) => `Lesson #${id}: ${title}`,
    breadcrumb: "English section",
    videoBadge: (id: string) => `Lesson #${id}`,
    watch: "Watch on YouTube",
    playlist: "Playlist on YouTube",
    previous: "Previous video",
    next: "Next video",
    ended: "You finished every video in this path!",
    backToHub: "Back to the English section",
    creditVideo: "Watch the original video",
    creditPlaylist: "Watch the full playlist",
  },
} as const;

/** Flat video order: suggested course order × number asc. */
const orderedVideos = englishCourses
  .map((course) =>
    englishVideos.filter((v) => v.courseId === course.id).sort((a, b) => a.number - b.number)
  )
  .flat();

export function generateStaticParams() {
  return englishVideos.map((v) => ({ video: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const v = findEnglishVideo(params.video);
  if (!v) return { title: COPY[locale].metaNotFound };
  const title = locale === "en" ? v.titleEn : v.title;
  return pageMetadata({
    locale,
    path: `/english/${v.id}`,
    title: COPY[locale].metaTitle(v.id, title),
    description: v.summary,
  });
}

export default function EnglishVideoPage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const v = findEnglishVideo(params.video);
  if (!v) notFound();
  const course = findEnglishCourse(v.courseId);

  const idx = orderedVideos.findIndex((item) => item.id === v.id);
  const prev = idx > 0 ? orderedVideos[idx - 1] : null;
  const next = idx >= 0 && idx < orderedVideos.length - 1 ? orderedVideos[idx + 1] : null;

  const videoTitle = isAr ? v.title : v.titleEn;
  const videoSubtitle = isAr ? v.titleEn : v.title;
  const courseTitle = course ? (isAr ? course.title : course.titleEn) : v.sectionEn;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/english")}
          className="transition-colors hover:text-emerald-300"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="text-slate-300">{c.videoBadge(v.id)}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full bg-gradient-to-l from-emerald-400 to-cyan-500 px-3 py-1 text-xs font-black text-ink-950"
            dir="auto"
          >
            {courseTitle}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
            {isAr ? `الدرس ${formatNumber(Number(v.id))}` : `Lesson ${formatNumber(Number(v.id))}`}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl" dir="auto">
          {videoTitle}
        </h1>
        <p
          className="mt-1 font-mono text-sm text-slate-500"
          dir={isAr ? "ltr" : "rtl"}
        >
          {videoSubtitle}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={v.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-5 w-5 text-emerald-400" />
            {c.watch}
          </a>
          {course && (
            <a
              href={course.playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              {c.playlist}
            </a>
          )}
        </div>
      </header>

      {/* Player */}
      <div className="mt-6">
        <EnglishVideoFacade
          youtubeId={v.youtubeId}
          title={v.titleEn}
          videoId={v.id}
          courseId={v.courseId}
          playlistUrl={v.youtube}
        />
      </div>

      {/* Completion bar */}
      <div className="mt-4">
        <EnglishCompletionBar videoId={v.id} courseId={v.courseId} />
      </div>

      {/* Interactive panel */}
      <EnglishLessonPanel video={v} />

      {/* Prev / next */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={localePath(locale, `/english/${prev.id}`)}
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
            href={localePath(locale, `/english/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-emerald-300 ring-1 ring-emerald-500/25 transition-colors hover:bg-white/10"
          >
            {c.next}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        ) : (
          <span className="text-sm text-slate-500">{c.ended}</span>
        )}
      </div>

      <EnglishCredit
        videoUrl={v.youtube}
        videoLabel={c.creditVideo}
        playlistUrl={course?.playlistUrl}
        playlistLabel={c.creditPlaylist}
      />
    </div>
  );
}
