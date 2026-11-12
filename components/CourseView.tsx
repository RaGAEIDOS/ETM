"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { Clock, CheckCircle2, ChevronLeft, ExternalLink, PlayCircle } from "lucide-react";
import type { Course, Stage } from "@/lib/types";
import { useProgress } from "@/lib/progress";

const COPY = {
  ar: {
    curriculum: "المنهج",
    lessons: (count: string) => `${count} دروس`,
    minutes: (count: string) => `${count} دقيقة من التعلم`,
    complete: "مكتمل",
    sources: "المصادر الخارجية",
    duration: (minutes: string) => `${minutes} دقيقة`,
  },
  en: {
    curriculum: "Curriculum",
    lessons: (count: string) => `${count} lessons`,
    minutes: (count: string) => `${count} min of learning`,
    complete: "complete",
    sources: "External sources",
    duration: (minutes: string) => `${minutes} min`,
  },
} as const;

function durationMinutes(duration: string): number {
  return parseInt(duration, 10) || 0;
}

export default function CourseView({
  stage,
  course,
}: {
  stage: Stage;
  course: Course;
}) {
  const { isDone, ready } = useProgress();
  const locale = useLocale();
  const c = useCopy(COPY);
  const isAr = locale === "ar";
  const stageName = isAr ? stage.name : stage.nameEn;
  const courseTitle = isAr ? course.title : course.titleEn;
  const done = course.lessons.filter((l) => isDone(l.id)).length;
  const percent = course.lessons.length
    ? Math.round((done / course.lessons.length) * 100)
    : 0;
  const totalMinutes = course.lessons.reduce(
    (sum, l) => sum + durationMinutes(l.duration),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/curriculum" className="hover:text-cyan-300">
          {c.curriculum}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        <Link href={`/learn/${stage.id}`} className="hover:text-cyan-300">
          {stageName}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        <span className="text-slate-300">{courseTitle}</span>
      </nav>

      <header className="rounded-2xl border border-white/10 bg-gradient-to-l from-cyan-500/[0.08] to-violet-500/[0.08] p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full bg-gradient-to-l ${stage.color} px-3 py-1 text-xs font-bold text-ink-950`}
          >
            {stageName}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            {c.lessons(formatNumber(course.lessons.length))}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            {c.minutes(formatNumber(totalMinutes))}
          </span>
        </div>
        <h1
          className="mt-4 text-3xl sm:text-4xl font-black text-white"
          dir={isAr ? "rtl" : undefined}
        >
          {courseTitle}
        </h1>
        {isAr && (
          <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">
            {course.titleEn}
          </p>
        )}
        <p className="mt-4 text-lg text-slate-300 leading-8 max-w-3xl" dir="rtl">
          {course.description}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-2 flex-1 max-w-xs rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-cyan-300 tabular-nums">
            {formatNumber(percent)}%
          </span>
          <span className="text-sm text-slate-400">{c.complete}</span>
        </div>

        {course.sources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-400 mb-2">{c.sources}</h3>
            <div className="flex flex-wrap gap-2">
              {course.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="mt-8 space-y-3">
        {course.lessons.map((lesson, i) => {
          const completed = ready && isDone(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/learn/${stage.id}/${course.id}/${lesson.id}`}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  completed
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {completed ? <CheckCircle2 className="h-5 w-5" /> : formatNumber(i + 1)}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className="block font-bold text-white group-hover:text-cyan-300 transition-colors"
                  dir={isAr ? "rtl" : undefined}
                >
                  {isAr ? lesson.title : lesson.titleEn}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500 leading-6 line-clamp-1" dir="rtl">
                  {lesson.description}
                </span>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {c.duration(formatNumber(durationMinutes(lesson.duration)))}
              </span>
              <PlayCircle className="h-5 w-5 shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
