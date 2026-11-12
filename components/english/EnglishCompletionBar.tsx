"use client";

/**
 * Lesson completion for an English video.
 * Complete = watched ≥ 80% AND practice ≥ 70% — or the learner confirms
 * manually. Auto-completion fires once per mount when both are met; the
 * learner can always toggle manually either way.
 */

import { useEffect, useMemo, useRef } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { CheckCircle2, Circle, MonitorPlay, ListChecks, Hand } from "lucide-react";

const COPY = {
  ar: {
    title: "إنهاء الدرس",
    watched: "مشاهدة الفيديو",
    practice: "التمرين",
    watchedOf: (pct: string) => `${pct}٪ من الفيديو`,
    practiceOf: (pct: string) => `${pct}٪ في آخر محاولة`,
    practiceNone: "لم تنجز التمرين بعد",
    goal: "الهدف",
    markDone: "أنهيت هذا الدرس",
    undoDone: "إلغاء إنهاء الدرس",
    completed: "أكملته — أحسنت!",
    manualHint: "يمكنك تأكيد الإنهاء يدويًا في أي وقت",
  },
  en: {
    title: "Finish the lesson",
    watched: "Watched the video",
    practice: "Practice drill",
    watchedOf: (pct: string) => `${pct}% of the video`,
    practiceOf: (pct: string) => `${pct}% on your last attempt`,
    practiceNone: "No attempt yet",
    goal: "goal",
    markDone: "I finished this lesson",
    undoDone: "Mark as not finished",
    completed: "Completed — well done!",
    manualHint: "You can confirm completion manually at any time",
  },
} as const;

export default function EnglishCompletionBar({
  videoId,
  courseId,
}: {
  videoId: string;
  courseId: string;
}) {
  const c = useCopy(COPY);
  const { ready, file, isDone, toggle } = useProgressStore();
  const autoAppliedRef = useRef(false);

  const { watchedPct, practicePct } = useMemo(() => {
    let watchedPct = 0;
    let practicePct: number | null = null;
    for (const e of file.events) {
      if (e.track !== "english" || e.itemId !== videoId) continue;
      if (e.type === "video_progress") {
        const pct = Number(e.payload?.percent ?? 0);
        if (Number.isFinite(pct) && pct > watchedPct) watchedPct = Math.min(100, Math.round(pct));
      } else if (e.type === "quiz_attempt") {
        const total = Number(e.payload?.total ?? 0);
        const score = Number(e.payload?.score ?? 0);
        if (total > 0) practicePct = Math.round((score / total) * 100);
      }
    }
    return { watchedPct, practicePct };
  }, [file.events, videoId]);

  const done = ready && isDone("english", videoId);
  const autoComplete = watchedPct >= 80 && practicePct !== null && practicePct >= 70;

  // Auto-complete once when both thresholds are met (per mount).
  useEffect(() => {
    if (autoComplete && !autoAppliedRef.current && ready && !isDone("english", videoId)) {
      autoAppliedRef.current = true;
      toggle("english", videoId, courseId);
    }
    if (!autoComplete) autoAppliedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoComplete, ready, videoId, courseId]);

  const watchedOk = watchedPct >= 80;
  const practiceOk = practicePct !== null && practicePct >= 70;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400">{c.title}</p>
          {/* Watched signal */}
          <div className="flex items-center gap-2 text-sm">
            {watchedOk ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <MonitorPlay className="h-4 w-4 shrink-0 text-slate-500" />
            )}
            <span className="text-slate-300">{c.watched}</span>
            <span dir="ltr" className={`font-mono text-xs ${watchedOk ? "text-emerald-300" : "text-slate-500"}`}>
              {formatNumber(watchedPct)}% / 80%
            </span>
            <span className="hidden text-[11px] text-slate-600 sm:inline">({c.goal} 80%)</span>
          </div>
          {/* Practice signal */}
          <div className="flex items-center gap-2 text-sm">
            {practiceOk ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <ListChecks className="h-4 w-4 shrink-0 text-slate-500" />
            )}
            <span className="text-slate-300">{c.practice}</span>
            <span dir="ltr" className={`font-mono text-xs ${practiceOk ? "text-emerald-300" : "text-slate-500"}`}>
              {practicePct === null ? "—" : `${formatNumber(practicePct)}% / 70%`}
            </span>
            <span className="hidden text-[11px] text-slate-600 sm:inline">
              {practicePct === null ? c.practiceNone : c.practiceOf(formatNumber(practicePct))}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {done ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-black text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                {c.completed}
              </span>
              <button
                type="button"
                onClick={() => toggle("english", videoId, courseId)}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                {c.undoDone}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => toggle("english", videoId, courseId)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:border-emerald-400/40 hover:text-emerald-300"
              >
                {watchedOk || practiceOk ? <Hand className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                {c.markDone}
              </button>
              <span className="text-[11px] text-slate-600">{c.manualHint}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
