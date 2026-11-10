"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import type { Lesson } from "@/lib/types";

export default function LessonNav({
  stageId,
  courseId,
  prev,
  next,
  currentId,
  isDone,
  toggle,
}: {
  stageId: string;
  courseId: string;
  prev: Lesson | null;
  next: Lesson | null;
  currentId: string;
  isDone: (id: string) => boolean;
  toggle: (id: string) => void;
}) {
  const done = isDone(currentId);
  return (
    <div className="mt-10 space-y-4">
      <button
        onClick={() => toggle(currentId)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-4 font-bold transition-all ${
          done
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-white/15 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
        {done ? "Completed — click to undo" : "Mark lesson complete"}
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${stageId}/${courseId}/${prev.id}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
              <ArrowRight className="h-4 w-4" />
              Previous lesson
            </span>
            <span className="mt-1.5 block font-bold text-white text-sm leading-6">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/learn/${stageId}/${courseId}/${next.id}`}
            className="group rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] p-4 hover:bg-cyan-500/[0.12] transition-colors sm:text-left text-right"
          >
            <span className="flex items-center gap-1.5 text-xs text-cyan-400">
              Next lesson
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="mt-1.5 block font-bold text-white text-sm leading-6">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/curriculum"
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
              Course finished — browse the curriculum
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="mt-1.5 block font-bold text-white text-sm leading-6">
              Full curriculum
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
