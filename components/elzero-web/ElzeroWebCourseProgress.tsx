"use client";

/** "Watched X of Y" progress chip for an ElZero Web course page. */

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { countDoneForCourse } from "@/lib/elzero-web-track";
import { CheckCircle2 } from "lucide-react";

const COPY = {
  ar: {
    watched: (done: string, total: string) => `أكملت ${done} من ${total} حلقة`,
  },
  en: {
    watched: (done: string, total: string) => `${done} of ${total} videos watched`,
  },
} as const;

export default function ElzeroWebCourseProgress({
  courseId,
  total,
}: {
  courseId: string;
  total: number;
}) {
  const c = useCopy(COPY);
  const { ready, stats } = useProgressStore();
  const done = ready ? countDoneForCourse(courseId, stats.doneElzeroWebVideoIds) : 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <span className="mt-4 inline-flex w-full max-w-md flex-col gap-1.5" aria-live="polite">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-300">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        {c.watched(formatNumber(done), formatNumber(total))}
      </span>
      <span className="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <span
          className="block h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  );
}
