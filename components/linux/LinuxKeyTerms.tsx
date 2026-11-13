"use client";

/**
 * Key terms & commands as flip flashcards. "اعرفها" / "لا أعرفها" emit
 * term_review events (track linux) feeding the Leitner spaced-repetition
 * queue (lib/english/srs.ts, parameterized by track).
 */

import { useMemo, useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { useProgressStore } from "@/lib/progress/store";
import { deriveSrs } from "@/lib/english/srs";
import type { LinuxKeyTerm } from "@/lib/linux-videos";
import { Check, X, RotateCcw, Layers } from "lucide-react";

const COPY = {
  ar: {
    title: "مصطلحات وأوامر مهمة",
    empty: "لا توجد مصطلحات لهذا الدرس بعد.",
    tapToFlip: "اضغط البطاقة لقلبها",
    know: "أعرفها",
    dontKnow: "لا أعرفها",
    box: "المربع",
    dueTomorrow: "تظهر مجددًا وفق جدول المراجعة المتباعدة",
    done: "أحسنت! راجعت كل المصطلحات — ستعود وفق الجدول",
    restart: "مراجعة مرة أخرى",
    mastered: "متقنة",
  },
  en: {
    title: "Key terms & commands",
    empty: "No key terms for this lesson yet.",
    tapToFlip: "Tap the card to flip it",
    know: "I know it",
    dontKnow: "I don't know it",
    box: "Box",
    dueTomorrow: "They come back on the spaced schedule",
    done: "Nice! You reviewed every term — they will come back on schedule",
    restart: "Review again",
    mastered: "Mastered",
  },
} as const;

export default function LinuxKeyTerms({
  terms,
  videoId,
  courseId,
}: {
  terms: LinuxKeyTerm[];
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

  const srs = useMemo(() => deriveSrs(file.events, undefined, "linux"), [file.events]);
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
    track("linux", "term_review", {
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
        className="block w-full rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.07] to-orange-500/[0.07] p-8 text-center transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {!flipped ? (
          <>
            <span className="text-xs uppercase tracking-widest text-amber-400">{c.tapToFlip}</span>
            <p dir="ltr" className="mt-3 font-mono text-2xl font-black text-white sm:text-3xl">{current.en}</p>
            {state && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400">
                {state.box >= 4 ? c.mastered : `${c.box} ${state.box}`}
              </p>
            )}
          </>
        ) : (
          <>
            <p dir="rtl" className="text-xl font-black text-amber-300 sm:text-2xl">{current.ar}</p>
            {current.example && (
              <code dir="ltr" className="mt-4 inline-block rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-slate-200">
                {current.example}
              </code>
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
