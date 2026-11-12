"use client";

/** Ordered lecture list for the /cs50x hub with per-lecture done state + prev/next navigation support. */

import Link from "next/link";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { CS50X_LECTURES, shortDuration } from "@/lib/cs50x";
import { CheckCircle2, ChevronLeft, ExternalLink, FileText, Wrench, Users } from "lucide-react";

const COPY = {
  ar: {
    watch: "شاهد المحاضرة",
    week: "صفحة الأسبوع",
    pset: "التكليف",
    notes: "الملاحظات الرسمية",
    minutes: "دقيقة",
  },
  en: {
    watch: "Watch",
    week: "Week page",
    pset: "Problem set",
    notes: "Official notes",
    minutes: "min",
  },
} as const;

export default function Cs50xLectureList() {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, isDone } = useProgressStore();

  return (
    <ol className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60">
      {CS50X_LECTURES.map((lecture) => {
        const done = ready && isDone("cs50x", lecture.id);
        const minutes = Math.max(1, Math.round(lecture.durationSeconds / 60));
        return (
          <li key={lecture.id} className="group flex items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-white/[0.03]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] font-mono text-sm font-bold text-slate-400">
              {done ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-label="completed" />
              ) : (
                formatNumber(lecture.number)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={localePath(locale, `/cs50x/${lecture.id}`)}
                className="block font-bold leading-6 text-slate-200 transition-colors hover:text-white"
                dir="auto"
              >
                {lecture.title}
              </Link>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span dir="auto">{lecture.week}</span>
                <span dir="ltr" className="font-mono">{formatNumber(minutes)} {c.minutes}</span>
                <a
                  href={lecture.weekUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-rose-300"
                >
                  <Users className="h-3.5 w-3.5" />
                  {c.week}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {lecture.psetUrl && (
                  <a
                    href={lecture.psetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-rose-300"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    {c.pset}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {lecture.notesUrl && (
                  <a
                    href={lecture.notesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-rose-300"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {c.notes}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </p>
            </div>
            <Link
              href={localePath(locale, `/cs50x/${lecture.id}`)}
              aria-label={c.watch}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-all hover:border-rose-400/40 hover:text-rose-300"
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
