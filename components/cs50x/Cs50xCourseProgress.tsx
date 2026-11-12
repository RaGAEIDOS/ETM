"use client";

/** Per-course progress line on the /cs50x hub. */

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    of: (done: string, total: string) => `${done} من ${total} محاضرات`,
    all: "أنهيت كل المحاضرات! 🎉",
    soon: "المحتوى قيد المزامنة — ستظهر المحاضرات هنا قريبًا",
    progress: "تقدم المسار",
  },
  en: {
    of: (done: string, total: string) => `${done} of ${total} lectures`,
    all: "You finished every lecture! 🎉",
    soon: "Content is syncing — lectures will appear here soon",
    progress: "Track progress",
  },
} as const;

export default function Cs50xCourseProgress({
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

  const done = ready ? videoIds.filter((id) => isDone("cs50x", id)).length : 0;
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
          className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-cyan-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
