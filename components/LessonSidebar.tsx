"use client";

import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import type { Course } from "@/lib/types";

export default function LessonSidebar({
  stageId,
  course,
  currentLessonId,
  isDone,
}: {
  stageId: string;
  course: Course;
  currentLessonId: string;
  isDone: (id: string) => boolean;
}) {
  const done = course.lessons.filter((l) => isDone(l.id)).length;
  const percent = course.lessons.length
    ? Math.round((done / course.lessons.length) * 100)
    : 0;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="border-b border-white/5 px-5 py-4">
          <h3 className="font-bold text-white text-sm">{course.title}</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-cyan-300 tabular-nums">
              {percent}%
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {done} من {course.lessons.length} درس مكتمل
          </p>
        </div>
        <nav className="max-h-[40vh] lg:max-h-[60vh] overflow-y-auto p-2">
          {course.lessons.map((lesson, i) => {
            const active = lesson.id === currentLessonId;
            const completed = isDone(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/learn/${stageId}/${course.id}/${lesson.id}`}
                className={`flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    completed
                      ? "bg-emerald-500/20 text-emerald-300"
                      : active
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {completed ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span className="flex-1 leading-6">{lesson.title}</span>
                <span className="flex items-center gap-1 text-xs text-slate-600 shrink-0 mt-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
