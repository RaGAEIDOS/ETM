"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { ChevronLeft, BookOpen, ArrowRight } from "lucide-react";
import type { Stage } from "@/lib/types";
import { useProgress, stageCompletion } from "@/lib/progress";

const COPY = {
  ar: {
    curriculum: "المنهج",
    level: (level: string, name: string) => `المستوى ${level}: ${name}`,
    courses: (count: string) => `${count} كورسات`,
    lessons: (count: string) => `${count} دروس`,
    complete: (percent: string) => `${percent}% مكتمل`,
    viewCourse: "عرض الكورس",
  },
  en: {
    curriculum: "Curriculum",
    level: (level: string, name: string) => `Level ${level}: ${name}`,
    courses: (count: string) => `${count} courses`,
    lessons: (count: string) => `${count} lessons`,
    complete: (percent: string) => `${percent}% complete`,
    viewCourse: "View course",
  },
} as const;

export default function StageView({ stage }: { stage: Stage }) {
  const { map } = useProgress();
  const comp = stageCompletion(map, stage);
  const locale = useLocale();
  const c = useCopy(COPY);
  const isAr = locale === "ar";
  const stageName = isAr ? stage.name : stage.nameEn;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/curriculum" className="hover:text-cyan-300">
          {c.curriculum}
        </Link>
        <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        <span className="text-slate-300">{stageName}</span>
      </nav>

      <header className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stage.color} text-ink-950 font-black text-2xl shadow-lg`}
          >
            {stage.level}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {c.level(formatNumber(stage.level), stageName)}
            </h1>
            <p className="mt-1 text-lg font-semibold text-cyan-300" dir="rtl">
              {stage.tagline}
            </p>
          </div>
        </div>
        <p className="mt-5 text-slate-300 leading-8 max-w-3xl" dir="rtl">
          {stage.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300">
            {c.courses(formatNumber(stage.courses.length))}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300">
            {c.lessons(formatNumber(comp.total))}
          </span>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-sm font-bold text-cyan-300">
            {c.complete(formatNumber(comp.percent))}
          </span>
        </div>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {stage.courses.map((course) => {
          const courseDone = course.lessons.filter((l) => map[l.id]).length;
          const coursePercent = course.lessons.length
            ? Math.round((courseDone / course.lessons.length) * 100)
            : 0;
          return (
            <div
              key={course.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    className="text-xl font-black text-white"
                    dir={isAr ? "rtl" : undefined}
                  >
                    {isAr ? course.title : course.titleEn}
                  </h2>
                  {isAr && (
                    <p className="mt-0.5 text-xs font-mono text-slate-500" dir="ltr">
                      {course.titleEn}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                  {c.lessons(formatNumber(course.lessons.length))}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400 leading-6 line-clamp-3" dir="rtl">
                {course.description}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500"
                    style={{ width: `${coursePercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-cyan-300 tabular-nums">
                  {formatNumber(coursePercent)}%
                </span>
              </div>
              <Link
                href={`/learn/${stage.id}/${course.id}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {c.viewCourse}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
