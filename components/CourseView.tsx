"use client";

import Link from "next/link";
import { Clock, CheckCircle2, Circle, ExternalLink, PlayCircle } from "lucide-react";
import type { Course, Stage } from "@/lib/types";
import { useProgress } from "@/lib/progress";

export default function CourseView({
  stage,
  course,
}: {
  stage: Stage;
  course: Course;
}) {
  const { isDone, ready } = useProgress();
  const done = course.lessons.filter((l) => isDone(l.id)).length;
  const percent = course.lessons.length
    ? Math.round((done / course.lessons.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/curriculum" className="hover:text-cyan-300">Curriculum</Link>
        <span className="text-slate-700">‹</span>
        <Link href={`/learn/${stage.id}`} className="hover:text-cyan-300">
          {stage.nameEn}
        </Link>
        <span className="text-slate-700">‹</span>
        <span className="text-slate-300">{course.title}</span>
      </nav>

      <header className="rounded-2xl border border-white/10 bg-gradient-to-l from-cyan-500/[0.08] to-violet-500/[0.08] p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full bg-gradient-to-l ${stage.color} px-3 py-1 text-xs font-bold text-ink-950`}
          >
            {stage.nameEn}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            {course.lessons.length} lessons
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            {course.lessons.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0)} min of learning
          </span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">{course.title}</h1>
        <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">{course.titleEn}</p>
        <p className="mt-4 text-lg text-slate-300 leading-8 max-w-3xl">{course.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-2 flex-1 max-w-xs rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-cyan-300 tabular-nums">{percent}%</span>
          <span className="text-sm text-slate-400">complete</span>
        </div>

        {course.sources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-400 mb-2">External sources</h3>
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
                {completed ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {lesson.title}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500 leading-6 line-clamp-1">
                  {lesson.description}
                </span>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500 shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {lesson.duration}
              </span>
              <PlayCircle className="h-5 w-5 shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
