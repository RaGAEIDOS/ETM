"use client";

/**
 * Module + lesson renderer for one Islamic Studies course. It is already
 * wired to the shared progress store, so adding a lesson to `lib/religious.ts`
 * automatically produces a clickable row with completion state.
 */

import Link from "@/lib/i18n/navigation";
import { CheckCircle2, Circle, Clock3, Layers } from "lucide-react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import type { ReligiousModule } from "@/lib/religious";

const COPY = {
  ar: {
    lessons: (n: string) => `${n} دروس`,
    emptyTitle: "المنهج قيد الإعداد",
    emptyBody:
      "لم تُضف الوحدات والفيديوهات بعد. سيظهر هنا تقسيم الدورة إلى وحدات ودروس فور اعتماد المحتوى من المصدر الرسمي.",
    done: "مكتمل",
    open: "غير مكتمل",
  },
  en: {
    lessons: (n: string) => `${n} lessons`,
    emptyTitle: "Curriculum in preparation",
    emptyBody:
      "Modules and videos have not been added yet. The course structure will appear here once the content is verified against the official source.",
    done: "Completed",
    open: "Not completed",
  },
} as const;

function formatDuration(iso?: string): string {
  if (!iso) return "";
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return "";
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${min}:${String(s).padStart(2, "0")}`;
}

export default function ReligiousLessonList({
  modules,
}: {
  modules: ReligiousModule[];
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const { ready, isDone } = useProgressStore();

  if (modules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
        <Layers className="mx-auto h-8 w-8 text-amber-400" aria-hidden />
        <h3 className="mt-3 text-lg font-black text-white">{c.emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-400">{c.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modules.map((module, moduleIndex) => (
        <section
          key={module.id}
          id={`module-${module.id}`}
          className="scroll-mt-24 rounded-2xl border border-white/10 bg-ink-900/50 p-5"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs font-black text-amber-400">
              {formatNumber(moduleIndex + 1)}
            </span>
            <h3 className="text-lg font-black text-white" dir="auto">
              {isAr ? module.title : module.titleEn}
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {c.lessons(formatNumber(module.lessons.length))}
            </span>
          </div>
          {(module.description || module.descriptionEn) && (
            <p className="mt-2 text-sm leading-7 text-slate-400" dir="auto">
              {isAr ? module.description : module.descriptionEn}
            </p>
          )}
          <ol className="mt-4 space-y-2">
            {module.lessons.map((lesson) => {
              const done = ready && isDone("religious", lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/islamic-studies/${lesson.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-amber-500/30 hover:bg-amber-500/[0.06]"
                  >
                    {done ? (
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 text-emerald-400"
                        aria-label={c.done}
                      />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-600" aria-label={c.open} />
                    )}
                    <span
                      dir="auto"
                      className="flex-1 text-sm font-semibold text-slate-200 group-hover:text-white"
                    >
                      {isAr ? lesson.title : lesson.titleEn}
                    </span>
                    {lesson.duration && (
                      <span
                        className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-slate-500"
                        dir="ltr"
                      >
                        <Clock3 className="h-3.5 w-3.5" aria-hidden />
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
          {module.lessons.length === 0 && (
            <p className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-slate-500">
              {c.emptyBody}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
