import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  Terminal,
} from "lucide-react";
import {
  LINUX_SECTIONS,
  findLinuxCourse,
  findLinuxVideo,
  linuxVideos,
} from "@/lib/linux-videos";
import LinuxVideoFacade from "@/components/linux/LinuxVideoFacade";
import LinuxCompletionBar from "@/components/linux/LinuxCompletionBar";
import LinuxLessonPanel from "@/components/linux/LinuxLessonPanel";
import LinuxCredit from "@/components/linux/LinuxCredit";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "الفيديو غير موجود",
    metaTitle: (id: string, title: string) => `درس ${id}: ${title}`,
    breadcrumb: "قسم لينكس",
    videoBadge: (n: string) => `فيديو ${n} من 53`,
    watch: "شاهد على YouTube",
    playlist: "قائمة التشغيل على YouTube",
    previous: "الفيديو السابق",
    next: "الفيديو التالي",
    ended: "أنهيت كل فيديوهات الدورة!",
    backToHub: "العودة إلى قسم لينكس",
    creditVideo: "مشاهدة الفيديو الأصلي",
    creditPlaylist: "مشاهدة قائمة التشغيل كاملة",
  },
  en: {
    metaNotFound: "Video not found",
    metaTitle: (id: string, title: string) => `Lesson ${id}: ${title}`,
    breadcrumb: "Linux section",
    videoBadge: (n: string) => `Video ${n} of 53`,
    watch: "Watch on YouTube",
    playlist: "Full playlist on YouTube",
    previous: "Previous video",
    next: "Next video",
    ended: "You finished every video in this course!",
    backToHub: "Back to the Linux section",
    creditVideo: "Watch the original video",
    creditPlaylist: "Watch the full playlist",
  },
} as const;

/** Course order = publication order on the playlist. */
const orderedVideos = [...linuxVideos].sort((a, b) => a.number - b.number);

export function generateStaticParams() {
  return linuxVideos.map((v) => ({ video: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const v = findLinuxVideo(params.video);
  if (!v) return { title: COPY[locale].metaNotFound };
  return pageMetadata({
    locale,
    path: `/linux/${v.id}`,
    title: COPY[locale].metaTitle(String(v.number), v.title),
    description: v.summary,
  });
}

export default function LinuxVideoPage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const v = findLinuxVideo(params.video);
  if (!v) notFound();
  const course = findLinuxCourse("linux-2021");
  const section = LINUX_SECTIONS.find((s) => s.id === v.section);

  const idx = orderedVideos.findIndex((item) => item.id === v.id);
  const prev = idx > 0 ? orderedVideos[idx - 1] : null;
  const next = idx >= 0 && idx < orderedVideos.length - 1 ? orderedVideos[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/linux")}
          className="transition-colors hover:text-amber-300"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="text-slate-300">{c.videoBadge(formatNumber(v.number))}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          {section && (
            <span
              className="rounded-full bg-gradient-to-l from-amber-400 to-orange-500 px-3 py-1 text-xs font-black text-ink-950"
              dir="auto"
            >
              {locale === "ar" ? section.title : section.titleEn}
            </span>
          )}
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
            {c.videoBadge(formatNumber(v.number))}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-black leading-snug text-white sm:text-3xl" dir="auto">
          {v.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={v.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-5 w-5 text-amber-400" />
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

      {/* Player (click-to-load facade, youtube-nocookie) */}
      <div className="mt-6">
        <LinuxVideoFacade
          youtubeId={v.youtubeId}
          title={v.title}
          videoId={v.id}
          courseId="linux-2021"
          playlistUrl={v.youtube}
        />
      </div>

      {/* Completion bar */}
      <div className="mt-4">
        <LinuxCompletionBar videoId={v.id} courseId="linux-2021" />
      </div>

      {/* Interactive panel */}
      <LinuxLessonPanel video={v} />

      {/* Prev / next */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={localePath(locale, `/linux/${prev.id}`)}
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
            href={localePath(locale, `/linux/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-amber-300 ring-1 ring-amber-500/25 transition-colors hover:bg-white/10"
          >
            {c.next}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Terminal className="h-4 w-4 text-amber-400" />
            {c.ended}
          </span>
        )}
      </div>

      <LinuxCredit
        videoUrl={v.youtube}
        videoLabel={c.creditVideo}
        playlistUrl={course?.playlistUrl}
        playlistLabel={c.creditPlaylist}
      />
    </div>
  );
}
