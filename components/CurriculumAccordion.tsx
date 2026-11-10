"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Clock,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { Stage } from "@/lib/types";
import { useProgress, stageCompletion } from "@/lib/progress";

export default function CurriculumAccordion({ stages }: { stages: Stage[] }) {
  const { map, ready, isDone } = useProgress();
  const [open, setOpen] = useState<string | null>(stages[0]?.id ?? null);

  return (
    <div className="space-y-5">
      {stages.map((stage) => {
        const comp = stageCompletion(map, stage);
        const isOpen = open === stage.id;
        return (
          <div
            key={stage.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : stage.id)}
              className="w-full flex items-center gap-4 px-6 py-5 text-right hover:bg-white/[0.03] transition-colors"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stage.color} text-ink-950 font-black`}
              >
                {stage.level}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-3">
                  <span className="text-lg font-black text-white" dir="rtl">{stage.name}</span>
                  <span className="text-xs font-semibold text-slate-500 bg-white/5 rounded-full px-2.5 py-0.5">
                    {stage.courses.length} courses · {comp.total} lessons
                  </span>
                </span>
                <span className="mt-1 block text-sm text-slate-400 truncate text-right" dir="rtl">
                  {stage.tagline}
                </span>
                <span className="mt-2.5 flex items-center gap-3">
                  <span className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
                      style={{ width: `${comp.percent}%` }}
                    />
                  </span>
                  <span className="text-xs font-bold text-cyan-300 tabular-nums">
                    {comp.percent}%
                  </span>
                </span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-white/5 px-4 sm:px-6 py-5 space-y-6">
                <p className="text-slate-400 leading-7 max-w-3xl" dir="rtl">
                  {stage.description}
                </p>
                {stage.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-white/5 bg-ink-900/50 overflow-hidden"
                  >
                    <div className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-white flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-cyan-400" />
                            <span dir="rtl">{course.title}</span>
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 font-mono">
                            {course.titleEn}
                          </p>
                        </div>
                        <Link
                          href={`/learn/${stage.id}/${course.id}/${course.lessons[0]?.id ?? ""}`}
                          className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                        >
                          Start course
                        </Link>
                      </div>
                      <p className="mt-3 text-sm text-slate-400 leading-6" dir="rtl">
                        {course.description}
                      </p>
                      {course.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {course.sources.map((s) => (
                            <a
                              key={s.url}
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {s.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-white/5 px-3 py-2">
                      {course.lessons.map((lesson, i) => {
                        const completed = ready && isDone(lesson.id);
                        return (
                          <Link
                            key={lesson.id}
                            href={`/learn/${stage.id}/${course.id}/${lesson.id}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 transition-colors group"
                          >
                            <span className="text-slate-600 font-mono text-xs w-5 text-center shrink-0">
                              {i + 1}
                            </span>
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-700 shrink-0" />
                            )}
                            <span className="flex-1 text-slate-300 group-hover:text-white transition-colors leading-6" dir="rtl">
                              {lesson.title}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
