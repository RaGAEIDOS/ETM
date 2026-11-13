import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Sprout,
  Mic,
  Volume2,
  MessagesSquare,
} from "lucide-react";
import {
  englishCourses,
  englishVideosOfCourse,
  findEnglishCourse,
} from "@/lib/english-videos";
import EnglishCourseProgress from "@/components/english/EnglishCourseProgress";
import EnglishCredit from "@/components/english/EnglishCredit";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: (title: string) => `كورس ${title} — قسم الإنجليزية`,
    breadcrumb: "قسم الإنجليزية",
    lessonsTitle: "دروس الكورس",
    lessonCount: (n: number) => `${formatNumber(n)} درس`,
    openPlaylist: "القائمة على YouTube",
    empty: "لم يتم استيراد دروس هذا الكورس بعد.",
    back: "العودة لقسم الإنجليزية",
  },
  en: {
    metaTitle: (title: string) => `${title} course — English section`,
    breadcrumb: "English section",
    lessonsTitle: "Course lessons",
    lessonCount: (n: number) => `${formatNumber(n)} lessons`,
    openPlaylist: "Playlist on YouTube",
    empty: "No lessons have been imported for this course yet.",
    back: "Back to the English section",
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

export function generateStaticParams() {
  return englishCourses.map((course) => ({ course: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const course = findEnglishCourse(params.course);
  if (!course) return { title: COPY[locale].metaTitle(params.course) };
  return pageMetadata({
    locale,
    path: `/english/course/${course.id}`,
    title: COPY[locale].metaTitle(locale === "en" ? course.titleEn : course.title),
    description: course.description,
  });
}

export default function EnglishCoursePage({
  params,
}: {
  params: { course: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const course = findEnglishCourse(params.course);
  if (!course) notFound();

  const videos = englishVideosOfCourse(course.id).sort((a, b) => a.number - b.number);
  const Icon = COURSE_ICONS[course.icon];
  const courseTitle = isAr ? course.title : course.titleEn;
  const courseSubtitle = isAr ? course.titleEn : course.title;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
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
        <span className="text-slate-300">{courseTitle}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}
          >
            <Icon className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl" dir="auto">
              {courseTitle}
            </h1>
            <p className="mt-1 text-sm font-semibold text-emerald-400" dir="auto">
              {courseSubtitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400" dir="rtl">
              {course.description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
            <ListChecks className="h-4 w-4 text-emerald-400" />
            {c.lessonCount(videos.length)}
          </span>
          <a
            href={course.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300 hover:text-emerald-200"
          >
            <PlayCircle className="h-4 w-4" />
            {c.openPlaylist}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <EnglishCourseProgress videoIds={videos.map((v) => v.id)} />
      </header>

      {/* Lessons */}
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
          <ListChecks className="h-5 w-5 text-emerald-400" />
          {c.lessonsTitle}
        </h2>
        {videos.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
            {c.empty}
          </p>
        ) : (
          <ol className="grid gap-2 sm:grid-cols-2">
            {videos.map((v) => (
              <li key={v.id}>
                  <Link
                    href={localePath(locale, `/english/${v.id}`)}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
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
        )}
      </section>

      <div className="mt-8">
        <Link
          href={localePath(locale, "/english")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
          {c.back}
        </Link>
      </div>

      <EnglishCredit />
    </div>
  );
}
