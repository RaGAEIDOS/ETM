import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Terminal,
  PlayCircle,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import {
  LINUX_SECTIONS,
  findLinuxCourse,
  linuxVideos,
  linuxVideosBySection,
} from "@/lib/linux-videos";
import LinuxCourseProgress from "@/components/linux/LinuxCourseProgress";
import LinuxCredit from "@/components/linux/LinuxCredit";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "دورة تعلم نظام اللينكس 2021 — قسم لينكس",
    metaDescription:
      "دورة كاملة من الصفر على قناة Linuxtopia: تثبيت مانجارو، بنية نظام الملفات، الصلاحيات، أوامر النصوص وسكربتات باش والخوادم — مع دروس تفاعلية داخل المنصة.",
    breadcrumb: "قسم لينكس",
    lessonsTitle: "دروس الدورة",
    lessonCount: (n: number) => `${formatNumber(n)} فيديو`,
    openPlaylist: "القائمة على YouTube",
    back: "العودة إلى قسم لينكس",
    sectionCount: (n: number) => `${formatNumber(n)} فيديو`,
  },
  en: {
    metaTitle: "The Complete Linux Course (2021) — Linux section",
    metaDescription:
      "A complete from-zero course by Linuxtopia: installing Manjaro, filesystem layout, permissions, text commands, Bash scripting and self-hosted servers — with interactive lessons.",
    breadcrumb: "Linux section",
    lessonsTitle: "Course lessons",
    lessonCount: (n: number) => `${formatNumber(n)} videos`,
    openPlaylist: "Open the playlist on YouTube",
    back: "Back to the Linux section",
    sectionCount: (n: number) => `${formatNumber(n)} videos`,
  },
} as const;

/** "PT8M36S" -> "8:36" (display only). */
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
  return [{ course: "linux-2021" }];
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const course = findLinuxCourse(params.course);
  if (!course) return { title: params.course };
  return pageMetadata({
    locale,
    path: `/linux/course/${course.id}`,
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function LinuxCoursePage({
  params,
}: {
  params: { course: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const course = findLinuxCourse(params.course);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
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
        <span className="text-slate-300">{isAr ? course.title : course.titleEn}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-ink-950">
            <Terminal className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl" dir="rtl">
              {course.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-amber-400" dir="ltr">
              {course.titleEn}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400" dir="rtl">
              {course.description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
            <ListChecks className="h-4 w-4 text-amber-400" />
            {c.lessonCount(linuxVideos.length)}
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
        </div>

        <LinuxCourseProgress videoIds={linuxVideos.map((v) => v.id)} />
      </header>

      {/* Lessons grouped by section (course order on the channel) */}
      <section className="mt-8" aria-label={c.lessonsTitle}>
        {LINUX_SECTIONS.map((section) => {
          const videos = linuxVideosBySection(section.id);
          if (videos.length === 0) return null;
          return (
            <div key={section.id} id={`section-${section.id}`} className="mb-8 scroll-mt-24">
              <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg font-black text-white">
                <span dir="rtl">{section.title}</span>
                <span dir="ltr" className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {section.titleEn}
                </span>
                <span className="text-xs font-bold text-amber-500">{c.sectionCount(videos.length)}</span>
              </h2>
              <p dir="rtl" className="mt-1 text-xs leading-6 text-slate-500">{section.description}</p>
              <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                {videos.map((v) => (
                  <li key={v.id}>
                    <Link
                      href={localePath(locale, `/linux/${v.id}`)}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.06]"
                    >
                      <span className="h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                        <YouTubeThumbnail
                          youtubeId={v.youtubeId}
                          alt={v.title}
                          width={160}
                          height={90}
                          className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                        />
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-xs font-bold text-amber-300">
                        {formatNumber(v.number)}
                      </span>
                      <span
                        dir="auto"
                        className="flex-1 truncate text-sm font-semibold text-slate-200 group-hover:text-white"
                      >
                        {v.title}
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
            </div>
          );
        })}
      </section>

      <div className="mt-8">
        <Link
          href={localePath(locale, "/linux")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
          {c.back}
        </Link>
      </div>

      <LinuxCredit playlistUrl={course.playlistUrl} playlistLabel={c.openPlaylist} />
    </div>
  );
}
