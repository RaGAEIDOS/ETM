"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useCopy } from "@/lib/i18n/context";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    done: "أتممت هذا الدرس",
    undo: "إلغاء الإتمام",
    progress: "تقدم الدرس",
  },
  en: {
    done: "Mark lesson complete",
    undo: "Mark as not complete",
    progress: "Lesson progress",
  },
} as const;

export default function ReligiousCompletionBar({
  lessonId,
  courseId,
}: {
  lessonId: string;
  courseId: string;
}) {
  const c = useCopy(COPY);
  const { ready, isDone, toggle } = useProgressStore();
  const done = ready && isDone("religious", lessonId);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-300">
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
        ) : (
          <Circle className="h-5 w-5 text-slate-500" aria-hidden />
        )}
        {c.progress}
      </span>
      <button
        type="button"
        onClick={() => toggle("religious", lessonId, courseId)}
        aria-pressed={done}
        className={`rounded-xl px-4 py-2.5 text-sm font-black transition-colors ${
          done
            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
            : "bg-gradient-to-l from-amber-400 to-orange-500 text-ink-950 hover:opacity-90"
        }`}
      >
        {done ? c.undo : c.done}
      </button>
    </div>
  );
}
