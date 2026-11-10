"use client";

import Link from "next/link";
import { Clock, BookOpen, ArrowLeft } from "lucide-react";
import type { Stage } from "@/lib/types";
import { useProgress, stageCompletion } from "@/lib/progress";

export default function StageView({ stage }: { stage: Stage }) {
  const { map } = useProgress();
  const comp = stageCompletion(map, stage);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/curriculum" className="hover:text-cyan-300">Curriculum</Link>
        <span className="text-slate-700">‹</span>
        <span className="text-slate-300">{stage.nameEn}</span>
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
              Level {stage.level}: {stage.nameEn}
            </h1>
            <p className="mt-1 text-lg font-semibold text-cyan-300" dir="rtl">{stage.tagline}</p>
          </div>
        </div>
        <p className="mt-5 text-slate-300 leading-8 max-w-3xl" dir="rtl">{stage.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300">
            {stage.courses.length} courses
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-slate-300">
            {comp.total} lessons
          </span>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-sm font-bold text-cyan-300">
            {comp.percent}% complete
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
                  <h2 className="text-xl font-black text-white" dir="rtl">{course.title}</h2>
                  <p className="mt-0.5 text-xs font-mono text-slate-500" dir="ltr">
                    {course.titleEn}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                  {course.lessons.length} lessons
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
                  {coursePercent}%
                </span>
              </div>
              <Link
                href={`/learn/${stage.id}/${course.id}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                View course
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
