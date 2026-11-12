"use client";

/** Review-queue entry card for the /linux hub — shows how many terms are due. */

import Link from "@/lib/i18n/navigation";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { deriveSrs } from "@/lib/english/srs";
import { Brain, ChevronLeft } from "lucide-react";

const COPY = {
  ar: {
    title: "مراجعتك اليوم",
    body: "مصطلحات مستحقة للمراجعة وفق الجدول المتباعد",
    due: (n: string) => `${n} مستحقة`,
    none: "لا توجد مصطلحات مستحقة اليوم — راجع فيديوهاتك أولًا",
    cta: "ابدأ المراجعة",
  },
  en: {
    title: "Your review today",
    body: "Terms due for spaced-repetition review",
    due: (n: string) => `${n} due`,
    none: "Nothing due today — watch some lessons first",
    cta: "Start reviewing",
  },
} as const;

export default function LinuxReviewDueCard() {
  const c = useCopy(COPY);
  const { ready, file } = useProgressStore();
  const due = ready ? deriveSrs(file.events, undefined, "linux").dueCount : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-500/25 bg-gradient-to-l from-violet-500/[0.08] to-amber-500/[0.08] p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Brain className="h-6 w-6" />
        </span>
        <div>
          <p className="font-black text-white">{c.title}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {due > 0 ? c.body : c.none}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {due > 0 && (
          <span dir="ltr" className="rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1 text-sm font-black text-violet-200">
            {c.due(formatNumber(due))}
          </span>
        )}
        <Link
          href="/linux/review"
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500/20 px-4 py-2.5 text-sm font-bold text-violet-200 hover:bg-violet-500/30"
        >
          {c.cta}
          <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
