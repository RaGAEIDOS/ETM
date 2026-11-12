"use client";

/** Per-course progress line on the /linux hub. */

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    of: (done: string, total: string) => `${done} من ${total} دروس`,
    all: "أنهيت كل الدروس المتاحة! 🎉",
    soon: "المحتوى قيد المزامنة — ستظهر الدروس هنا قريبًا",
    progress: "تقدم الدورة",
  },
  en: {
    of: (done: string, total: string) => `${done} of ${total} lessons`,
    all: "You finished every available lesson! 🎉",
    soon: "Content is syncing — lessons will appear here soon",
    progress: "Course progress",
  },
} as const;

export default function LinuxCourseProgress({
  videoIds,
}: {
  /** The ETM ids of every video currently in this course. */
  videoIds: string[];
}) {
  const c = useCopy(COPY);
  const { ready, isDone } = useProgressStore();

  if (videoIds.length === 0) {
    return <p className="text-xs leading-6 text-slate-500">{c.soon}</p>;
  }

  const done = ready ? videoIds.filter((id) => isDone("linux", id)).length : 0;
  const total = videoIds.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>{done === total ? c.all : c.of(formatNumber(done), formatNumber(total))}</span>
        <span dir="ltr" className="font-mono">{pct}%</span>
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
