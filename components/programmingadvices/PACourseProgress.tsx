"use client";

/** Per-course progress line for the Programming Advices track. */

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    of: (done: string, total: string) => `${done} من ${total} درسًا متاحًا`,
    all: "أنهيت كل الدروس المتاحة! 🎉",
    soon: "الدروس التالية تُضاف على دفعات — سيعرضها المسار هنا",
    progress: "تقدم الدورة",
    declared: (available: string, total: string) => `${available} من ${total} فيديو متاح الآن`,
  },
  en: {
    of: (done: string, total: string) => `${done} of ${total} available lessons`,
    all: "You finished every available lesson! 🎉",
    soon: "More lessons are added in batches — this track will show them here",
    progress: "Course progress",
    declared: (available: string, total: string) => `${available} of ${total} videos available now`,
  },
} as const;

export default function PACourseProgress({
  videoIds,
  declaredCount,
}: {
  /** ETM ids of every lesson currently available in this course. */
  videoIds: string[];
  /** Official playlist length (20 / 50). */
  declaredCount?: number;
}) {
  const c = useCopy(COPY);
  const { ready, isDone } = useProgressStore();

  if (videoIds.length === 0) {
    return <p className="text-xs leading-6 text-slate-500">{c.soon}</p>;
  }

  const done = ready ? videoIds.filter((id) => isDone("programmingadvices", id)).length : 0;
  const pct = Math.round((done / videoIds.length) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-400">{c.progress}</span>
        <span className="text-slate-500">
          {done === videoIds.length
            ? c.all
            : c.of(formatNumber(done), formatNumber(videoIds.length))}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-500 transition-all"
          style={{ width: `${ready ? pct : 0}%` }}
        />
      </div>
      {declaredCount !== undefined && declaredCount > videoIds.length && (
        <p className="mt-1.5 text-[11px] text-slate-600">
          {c.declared(formatNumber(videoIds.length), formatNumber(declaredCount))}
        </p>
      )}
    </div>
  );
}
