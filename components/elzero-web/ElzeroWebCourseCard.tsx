"use client";

/**
 * Course card for the ElZero Web track: icon, progress bar, lesson count and
 * a continue/start affordance. Progress is read from the unified store
 * (track "elzero-web"); videos of a course are matched by id prefix.
 */

import Link from "next/link";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import {
  elzeroWebCourseVideos,
  type ElzeroWebCourse,
} from "@/lib/elzero-web-videos";
import { countDoneForCourse } from "@/lib/elzero-web-track";
import {
  Code2,
  Palette,
  Braces,
  Type,
  Paintbrush,
  GitBranch,
  ArrowLeft,
  ListChecks,
  Clock,
  Globe2,
} from "lucide-react";

const ICONS = {
  code: Code2,
  palette: Palette,
  braces: Braces,
  type: Type,
  paintbrush: Paintbrush,
  "git-branch": GitBranch,
} as const;

const COPY = {
  ar: {
    lessons: (n: string) => `${n} حلقة`,
    done: (done: string, total: string) => `أكملت ${done} من ${total}`,
    official: "صفحة الكورس الرسمية",
    browse: "كل الحلقات",
  },
  en: {
    lessons: (n: string) => `${n} videos`,
    done: (done: string, total: string) => `${done} of ${total} watched`,
    official: "Official course page",
    browse: "All videos",
  },
} as const;

export default function ElzeroWebCourseCard({ course }: { course: ElzeroWebCourse }) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, stats } = useProgressStore();
  const Icon = ICONS[course.icon];
  const videos = elzeroWebCourseVideos(course.id);
  const done = ready ? countDoneForCourse(course.id, stats.doneElzeroWebVideoIds) : 0;
  const total = videos.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const next =
    ready && done > 0
      ? videos.find((v) => !stats.doneElzeroWebVideoIds.includes(v.id)) ?? videos[0]
      : videos[0];

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}
        >
          <Icon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black leading-7 text-white" dir="auto">
            {course.title}
          </h2>
          <p dir="auto" className="mt-2 text-sm leading-7 text-slate-400 line-clamp-3">
            {course.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-4 w-4 text-cyan-400" />
          {c.lessons(formatNumber(course.lessons))}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span dir="ltr">{course.totalTime}</span>
        </span>
        <a
          href={course.courseUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <Globe2 className="h-3.5 w-3.5" />
          {c.official}
        </a>
      </div>

      <div className="mt-4" aria-hidden="true">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-l ${course.color} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {c.done(formatNumber(done), formatNumber(total))}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link
          href={localePath(locale, `/elzero-web/course/${course.id}`)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 min-h-[44px]"
        >
          {c.browse}
        </Link>
        {next && (
          <Link
            href={localePath(locale, `/elzero-web/${next.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2.5 text-sm font-bold text-ink-950 hover:opacity-90 min-h-[44px]"
          >
            {locale === "ar" ? `الحلقة ${formatNumber(next.number)}` : `Video #${formatNumber(next.number)}`}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
        )}
      </div>
    </div>
  );
}
