"use client";

/** Review-queue entry card for the Programming Advices hub. */

import Link from "@/lib/i18n/navigation";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { deriveSrs } from "@/lib/english/srs";
import { Brain, ChevronLeft } from "lucide-react";

const COPY = {
  ar: {
    title: "مراجعتك اليوم",
    body: "مصطلحات Programming Advices المستحقة وفق الجدول المتباعد",
    due: (n: string) => `${n} مستحقة`,
    none: "لا توجد مصطلحات مستحقة اليوم — شاهد درسًا وراجع مصطلحاته أولًا",
    cta: "ابدأ المراجعة",
  },
  en: {
    title: "Your review today",
    body: "Programming Advices terms due for spaced-repetition review",
    due: (n: string) => `${n} due`,
    none: "Nothing due today — watch a lesson and review its terms first",
    cta: "Start reviewing",
  },
} as const;

export default function PAReviewDueCard() {
  const c = useCopy(COPY);
  const { ready, file } = useProgressStore();
  const due = ready ? deriveSrs(file.events, undefined, "programmingadvices").dueCount : 0;

  return (
    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-l from-violet-500/[0.08] to-amber-500/[0.08] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-black text-violet-200">
            <Brain className="h-4 w-4" />
            {c.title}
          </p>
          <p className="mt-1 text-xs leading-6 text-slate-400">{due > 0 ? c.body : c.none}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
          {due > 0 ? c.due(formatNumber(due)) : "0"}
        </span>
      </div>
      <Link
        href="/programmingadvices/review"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-500 to-amber-500 px-4 py-2.5 text-sm font-black text-white hover:opacity-90"
      >
        {c.cta}
        <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
      </Link>
    </div>
  );
}
