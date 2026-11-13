import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  Clock3,
  Globe2,
} from "lucide-react";
import {
  paVideos,
  orderedPAVideos,
  findPACourse,
  findPAVideo,
  formatPADuration,
} from "@/lib/programmingadvices-videos";
import PAVideoFacade from "@/components/programmingadvices/PAVideoFacade";
import PACompletionBar from "@/components/programmingadvices/PACompletionBar";
import PALessonPanel from "@/components/programmingadvices/PALessonPanel";
import PACredit from "@/components/programmingadvices/PACredit";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "الدرس غير موجود",
    metaTitle: (id: string, title: string) => `Programming Advices — ${id}: ${title}`,
    breadcrumb: "Programming Advices",
    videoBadge: (id: string) => `الدرس ${id}`,
    watch: "شاهد على YouTube",
    playlist: "قائمة التشغيل على YouTube",
    officialPage: "الصفحة الرسمية للدورة",
    previous: "الدرس السابق",
    next: "الدرس التالي",
    ended: "وصلت إلى آخر درس متاح في المرحلة التجريبية — المزيد قريبًا.",
    backToHub: "العودة إلى مسار Programming Advices",
    creditVideo: "شاهد هذا الفيديو الأصلي",
    creditPlaylist: "قائمة التشغيل على YouTube",
    creditOfficial: "الصفحة الرسمية",
    duration: "المدة",
  },
  en: {
    metaNotFound: "Lesson not found",
    metaTitle: (id: string, title: string) => `Programming Advices — ${id}: ${title}`,
    breadcrumb: "Programming Advices",
    videoBadge: (id: string) => `Lesson ${id}`,
    watch: "Watch on YouTube",
    playlist: "Playlist on YouTube",
    officialPage: "Official course page",
    previous: "Previous lesson",
    next: "Next lesson",
    ended: "You reached the last lesson available in the pilot — more soon.",
    backToHub: "Back to the Programming Advices track",
    creditVideo: "Watch the original video",
    creditPlaylist: "Playlist on YouTube",
    creditOfficial: "Official page",
    duration: "Duration",
  },
} as const;

const orderedVideos = orderedPAVideos();

export function generateStaticParams() {
  return paVideos.map((video) => ({ video: video.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const video = findPAVideo(params.video);
  if (!video) return { title: COPY[locale].metaNotFound };
  const title = locale === "en" ? video.titleEn : video.title;
  return pageMetadata({
    locale,
    path: `/programmingadvices/${video.id}`,
    title: COPY[locale].metaTitle(video.id, title),
    description: locale === "en" ? video.summaryEn : video.summary,
  });
}

export default function PAVideoPage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const video = findPAVideo(params.video);
  if (!video) notFound();
  const course = findPACourse(video.courseId);

  const index = orderedVideos.findIndex((item) => item.id === video.id);
  const prev = index > 0 ? orderedVideos[index - 1] : null;
  const next = index >= 0 && index < orderedVideos.length - 1 ? orderedVideos[index + 1] : null;

  const videoTitle = isAr ? video.title : video.titleEn;
  const videoSubtitle = isAr ? video.titleEn : video.title;
  const courseTitle = course ? (isAr ? course.shortTitle : course.shortTitleEn) : video.sectionEn;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/programmingadvices")}
          className="transition-colors hover:text-amber-300"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        {course && (
          <>
            <Link
              href={localePath(locale, `/programmingadvices/course/${course.id}`)}
              className="transition-colors hover:text-amber-300"
            >
              {courseTitle}
            </Link>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </>
        )}
        <span className="text-slate-300">{c.videoBadge(video.id)}</span>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full bg-gradient-to-l from-amber-400 to-orange-500 px-3 py-1 text-xs font-black text-ink-950"
            dir="auto"
          >
            {courseTitle}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
            {isAr
              ? `الدرس ${formatNumber(video.number)}`
              : `Lesson ${formatNumber(video.number)}`}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
            <Clock3 className="h-3 w-3" />
            <span dir="ltr">{formatPADuration(video.duration)}</span>
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl" dir="auto">
          {videoTitle}
        </h1>
        <p className="mt-1 font-mono text-sm text-slate-500" dir={isAr ? "ltr" : "rtl"}>
          {videoSubtitle}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={video.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-5 w-5 text-amber-400" />
            {c.watch}
          </a>
          {course && (
            <>
              <a
                href={course.playlistUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
              >
                {c.playlist}
              </a>
              <a
                href={course.officialPageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
              >
                <Globe2 className="h-4 w-4" />
                {c.officialPage}
              </a>
            </>
          )}
        </div>
      </header>

      <div className="mt-6">
        <PAVideoFacade
          youtubeId={video.youtubeId}
          title={videoTitle}
          videoId={video.id}
          courseId={video.courseId}
          watchUrl={video.youtube}
          embeddable={video.embeddable !== false}
        />
      </div>

      <div className="mt-4">
        <PACompletionBar
          videoId={video.id}
          courseId={video.courseId}
          embeddable={video.embeddable !== false}
        />
      </div>

      <PALessonPanel video={video} />

      <div className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={localePath(locale, `/programmingadvices/${prev.id}`)}
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
            href={localePath(locale, `/programmingadvices/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-amber-300 ring-1 ring-amber-500/25 transition-colors hover:bg-white/10"
          >
            {c.next}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        ) : (
          <span className="text-sm text-slate-500">{c.ended}</span>
        )}
      </div>

      <PACredit
        videoUrl={video.youtube}
        videoLabel={c.creditVideo}
        playlistUrl={course?.playlistUrl}
        playlistLabel={c.creditPlaylist}
        officialPageUrl={course?.officialPageUrl}
        officialPageLabel={c.creditOfficial}
      />
    </div>
  );
}
