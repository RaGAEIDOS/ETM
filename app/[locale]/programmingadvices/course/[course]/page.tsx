import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  ListChecks,
  PlayCircle,
  Globe2,
  Binary,
  Network,
} from "lucide-react";
import {
  paCourses,
  paVideosOfCourse,
  findPACourse,
  formatPADuration,
} from "@/lib/programmingadvices-videos";
import PACourseProgress from "@/components/programmingadvices/PACourseProgress";
import PACredit from "@/components/programmingadvices/PACredit";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const ICONS = {
  foundations: Binary,
  algorithms: Network,
} as const;

const COPY = {
  ar: {
    metaTitle: (title: string) => `Programming Advices — ${title}`,
    breadcrumb: "Programming Advices",
    lessonsTitle: "دروس الدورة",
    lessonCount: (available: string, total: string) => `${available} من ${total} درسًا متاحًا`,
    openPlaylist: "القائمة على YouTube",
    officialPage: "الصفحة الرسمية للدورة",
    empty:
      "دروس هذه الدورة تُضاف على دفعات بعد اعتماد المرحلة التجريبية. القائمة الرسمية متاحة الآن على YouTube.",
    back: "العودة إلى مسار Programming Advices",
    nextBatch:
      "المرحلة التجريبية تغطي الكورس الأول فقط حاليًا. بقية دروس الكورس الأول ثم الكورس الثاني تُضاف على دفعات.",
    creditPlaylist: "قائمة التشغيل على YouTube",
    creditOfficial: "الصفحة الرسمية",
  },
  en: {
    metaTitle: (title: string) => `Programming Advices — ${title}`,
    breadcrumb: "Programming Advices",
    lessonsTitle: "Course lessons",
    lessonCount: (available: string, total: string) => `${available} of ${total} lessons available`,
    openPlaylist: "Playlist on YouTube",
    officialPage: "Official course page",
    empty:
      "This course's lessons are added in batches after the pilot is approved. The official playlist is available on YouTube now.",
    back: "Back to the Programming Advices track",
    nextBatch:
      "The pilot currently covers Course 1 only. The rest of Course 1 and then Course 2 are added in batches.",
    creditPlaylist: "Playlist on YouTube",
    creditOfficial: "Official page",
  },
} as const;

export function generateStaticParams() {
  return paCourses.map((course) => ({ course: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const course = findPACourse(params.course);
  if (!course) return { title: COPY[locale].metaTitle(params.course) };
  return pageMetadata({
    locale,
    path: `/programmingadvices/course/${course.id}`,
    title: COPY[locale].metaTitle(locale === "en" ? course.titleEn : course.title),
    description: locale === "en" ? course.descriptionEn : course.description,
  });
}

export default function PACoursePage({
  params,
}: {
  params: { course: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const course = findPACourse(params.course);
  if (!course) notFound();

  const videos = paVideosOfCourse(course.id);
  const Icon = ICONS[course.icon];
  const courseTitle = isAr ? course.title : course.titleEn;
  const courseSubtitle = isAr ? course.titleEn : course.title;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
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
        <span className="text-slate-300">
          {isAr ? course.shortTitle : course.shortTitleEn}
        </span>
      </nav>

      <header className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}
          >
            <Icon className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-amber-400">
              {isAr ? `كورس ${formatNumber(course.number)}` : `Course ${formatNumber(course.number)}`}
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl" dir="auto">
              {courseTitle}
            </h1>
            <p className="mt-1 text-sm font-semibold text-amber-300" dir="auto">
              {courseSubtitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400" dir="auto">
              {isAr ? course.description : course.descriptionEn}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
            <ListChecks className="h-4 w-4 text-amber-400" />
            {c.lessonCount(formatNumber(videos.length), formatNumber(course.videoCount))}
          </span>
          <a
            href={course.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 hover:text-amber-200"
          >
            <PlayCircle className="h-4 w-4" />
            {c.openPlaylist}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={course.officialPageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 hover:text-cyan-200"
          >
            <Globe2 className="h-4 w-4" />
            {c.officialPage}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4">
          <PACourseProgress videoIds={videos.map((v) => v.id)} declaredCount={course.videoCount} />
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
          <ListChecks className="h-5 w-5 text-amber-400" />
          {c.lessonsTitle}
        </h2>
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm leading-7 text-slate-400">{c.empty}</p>
            <a
              href={course.playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-200 hover:bg-amber-500/20"
            >
              <PlayCircle className="h-4 w-4" />
              {c.openPlaylist}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <ol className="grid gap-2 sm:grid-cols-2">
            {videos.map((v) => (
              <li key={v.id}>
                <Link
                  href={localePath(locale, `/programmingadvices/${v.id}`)}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.06]"
                >
                  <span className="h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                    <YouTubeThumbnail
                      youtubeId={v.youtubeId}
                      alt={isAr ? v.title : v.titleEn}
                      width={160}
                      height={90}
                      className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-[10px] font-bold text-amber-300">
                    {String(v.number).padStart(2, "0")}
                  </span>
                  <span
                    dir="auto"
                    className="flex-1 truncate text-sm font-semibold text-slate-200 group-hover:text-white"
                  >
                    {isAr ? v.title : v.titleEn}
                  </span>
                  {v.duration && (
                    <span className="shrink-0 font-mono text-xs text-slate-500" dir="ltr">
                      {formatPADuration(v.duration)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-xs leading-6 text-amber-100">
          {c.nextBatch}
        </p>
      </section>

      <div className="mt-8">
        <Link
          href={localePath(locale, "/programmingadvices")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
          {c.back}
        </Link>
      </div>

      <PACredit
        playlistUrl={course.playlistUrl}
        playlistLabel={c.creditPlaylist}
        officialPageUrl={course.officialPageUrl}
        officialPageLabel={c.creditOfficial}
      />
    </div>
  );
}
