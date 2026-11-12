"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { ArrowRight, ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import type { Lesson } from "@/lib/types";

const COPY = {
  ar: {
    markComplete: "علّم الدرس كمكتمل",
    completed: "مكتمل — اضغط للتراجع",
    previous: "الدرس السابق",
    next: "الدرس التالي",
    courseFinished: "انتهى الكورس — تصفح المنهج",
    fullCurriculum: "المنهج الكامل",
  },
  en: {
    markComplete: "Mark lesson complete",
    completed: "Completed — click to undo",
    previous: "Previous lesson",
    next: "Next lesson",
    courseFinished: "Course finished — browse the curriculum",
    fullCurriculum: "Full curriculum",
  },
} as const;

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
  const locale = useLocale();
  const c = useCopy(COPY);
  const isAr = locale === "ar";
  const prevTitle = prev ? (isAr ? prev.title : prev.titleEn) : "";
  const nextTitle = next ? (isAr ? next.title : next.titleEn) : "";

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
        {done ? c.completed : c.markComplete}
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/learn/${stageId}/${courseId}/${prev.id}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {c.previous}
            </span>
            <span
              className="mt-1.5 block font-bold text-white text-sm leading-6"
              dir={isAr ? "rtl" : undefined}
            >
              {prevTitle}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/learn/${stageId}/${courseId}/${next.id}`}
            className="group rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] p-4 hover:bg-cyan-500/[0.12] transition-colors text-start sm:text-end"
          >
            <span className="flex items-center gap-1.5 text-xs text-cyan-400">
              {c.next}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
            <span
              className="mt-1.5 block font-bold text-white text-sm leading-6"
              dir={isAr ? "rtl" : undefined}
            >
              {nextTitle}
            </span>
          </Link>
        ) : (
          <Link
            href="/curriculum"
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
              {c.courseFinished}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
            <span className="mt-1.5 block font-bold text-white text-sm leading-6">
              {c.fullCurriculum}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
