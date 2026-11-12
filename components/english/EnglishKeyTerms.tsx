"use client";

/**
 * Key terms as flip flashcards. "اعرفها" / "لا أعرفها" emit term_review
 * events (track english) which feed the Leitner spaced-repetition queue
 * (lib/english/srs.ts). Nothing else is stored.
 */

import { useMemo, useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { useProgressStore } from "@/lib/progress/store";
import { deriveSrs } from "@/lib/english/srs";
import type { EnglishKeyTerm } from "@/lib/english-videos";
import { Check, X, RotateCcw, Layers } from "lucide-react";

const COPY = {
  ar: {
    title: "مصطلحات مهمة",
    empty: "لا توجد مصطلحات لهذا الفيديو بعد.",
    tapToFlip: "اضغط البطاقة لقلبها",
    know: "أعرفها",
    dontKnow: "لا أعرفها",
    box: "المربع",
    dueTomorrow: "تظهر مجددًا وفق جدول المراجعة المتباعدة",
    done: "أحسنت! راجعت كل المصطلحات — ستعود وفق الجدول",
    restart: "مراجعة مرة أخرى",
    mastered: "متقنة",
    newTerm: "جديد",
  },
  en: {
    title: "Key terms",
    empty: "No key terms for this video yet.",
    tapToFlip: "Tap the card to flip it",
    know: "I know it",
    dontKnow: "I don't know it",
    box: "Box",
    dueTomorrow: "They come back on the spaced schedule",
    done: "Nice! You reviewed every term — they will come back on schedule",
    restart: "Review again",
    mastered: "Mastered",
    newTerm: "New",
  },
} as const;

export default function EnglishKeyTerms({
  terms,
  videoId,
  courseId,
}: {
  terms: EnglishKeyTerm[];
  videoId: string;
  courseId: string;
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const { file, track } = useProgressStore();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  const srs = useMemo(() => deriveSrs(file.events), [file.events]);
  const dueNow = srs.dueCount;

  const reset = () => {
    setIndex(0);
    setFlipped(false);
    setDone(new Set());
  };

  if (terms.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
        <Layers className="h-5 w-5 text-emerald-400" />
        {c.empty}
      </div>
    );
  }

  const remaining = terms.filter((t) => !done.has(t.en));
  if (remaining.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <Check className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
        <p className="font-bold text-white">{c.done}</p>
        <p className="mt-2 text-xs text-slate-400">
          {c.dueTomorrow} · {isAr ? "مراجعة مستحقة اليوم:" : "Due for review today:"}{" "}
          <span className="font-bold text-emerald-300">{dueNow}</span>
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          {c.restart}
        </button>
      </div>
    );
  }

  const current = remaining[Math.min(index, remaining.length - 1)];
  const state = srs.terms.find((t) => t.term === current.en.replace(/\s+/g, " ").trim());

  const answer = (known: boolean) => {
    track("english", "term_review", {
      itemId: videoId,
      topic: courseId,
      payload: { term: current.en, known },
    });
    setDone((prev) => new Set(prev).add(current.en));
    setFlipped(false);
    setIndex(0);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <Layers className="h-5 w-5 text-emerald-400" />
          {c.title}
        </h3>
        <span className="text-xs text-slate-500">
          {terms.length - remaining.length + 1} / {terms.length}
        </span>
      </div>

      {/* Card */}
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        className="block w-full rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/[0.07] to-cyan-500/[0.07] p-8 text-center transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {!flipped ? (
          <>
            <span className="text-xs uppercase tracking-widest text-emerald-400">{c.tapToFlip}</span>
            <p dir="ltr" className="mt-3 text-3xl font-black text-white">{current.en}</p>
            {state && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400">
                {state.box >= 4 ? c.mastered : `${c.box} ${state.box}`}
              </p>
            )}
          </>
        ) : (
          <>
            <p dir="rtl" className="text-2xl font-black text-emerald-300">{current.ar}</p>
            {current.example && (
              <span className="mt-4 block space-y-1">
                <span dir="ltr" className="block text-base text-slate-200">“{current.example.en}”</span>
                <span dir="rtl" className="block text-sm text-slate-400">{current.example.ar}</span>
              </span>
            )}
          </>
        )}
      </button>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(false)}
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 font-bold text-rose-300 hover:bg-rose-500/20"
        >
          <X className="h-5 w-5" />
          {c.dontKnow}
        </button>
        <button
          type="button"
          onClick={() => answer(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 font-bold text-emerald-300 hover:bg-emerald-500/20"
        >
          <Check className="h-5 w-5" />
          {c.know}
        </button>
      </div>
    </div>
  );
}
