"use client";

/** Per-course progress line for the Islamic Studies track. */

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    of: (done: string, total: string) => `${done} من ${total} دروس`,
    all: "أتممت كل دروس الدورة المتاحة! 🎉",
    progress: "تقدم الدورة",
  },
  en: {
    of: (done: string, total: string) => `${done} of ${total} lessons`,
    all: "You finished every available lesson! 🎉",
    progress: "Course progress",
  },
} as const;

export default function ReligiousCourseProgress({
  lessonIds,
}: {
  /** ETM ids of every lesson currently in this course. */
  lessonIds: string[];
}) {
  const c = useCopy(COPY);
  const { ready, isDone } = useProgressStore();

  // No lessons yet: the card and course page already show an honest empty
  // state, so a second "being prepared" line would only add noise.
  if (lessonIds.length === 0) return null;

  const done = ready ? lessonIds.filter((id) => isDone("religious", id)).length : 0;
  const total = lessonIds.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>{done === total ? c.all : c.of(formatNumber(done), formatNumber(total))}</span>
        <span dir="ltr" className="font-mono">
          {pct}%
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label={c.progress}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
