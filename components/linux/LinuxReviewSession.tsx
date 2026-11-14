"use client";

/**
 * Spaced-repetition review session (/linux/review).
 * Replays due terms from the learner's term_review events (Leitner,
 * lib/english/srs.ts). Arabic meanings are resolved from the video data.
 */

import { useMemo, useState } from "react";
import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { deriveSrs, normalizeTerm, SRS_MAX_BOX } from "@/lib/english/srs";
import { linuxVideos } from "@/lib/linux-videos";
import { Brain, Check, X, RotateCcw, ChevronLeft, Sparkles } from "lucide-react";

const COPY = {
  ar: {
    title: "المراجعة المتباعدة",
    intro: "البطاقات المستحقة تُولَّد من إجاباتك السابقة (أنظمة Leitner: ١ / ٣ / ٧ / ١٦ / ٣٥ / ٧٥ يومًا).",
    dueNow: (n: string) => `${n} بطاقة مستحقة اليوم`,
    start: "ابدأ المراجعة",
    nothingDue: "لا توجد مصطلحات مستحقة اليوم. شاهد فيديوهات جديدة وراجع مصطلحاتها، أو عد غدًا.",
    backHome: "العودة إلى قسم لينكس",
    tapToFlip: "اضغط البطاقة لقلبها",
    know: "أعرفها",
    dontKnow: "لا أعرفها",
    progress: (done: string, total: string) => `${done} من ${total}`,
    doneTitle: "اكتملت مراجعة اليوم",
    doneScore: (ok: string, total: string) => `أجبت صحًا على ${ok} من ${total}`,
    again: "مراجعة مرة أخرى",
    boxLabel: (n: string) => `الصندوق ${n}`,
    maxBox: "مصطلحك في أعلى صندوق",
    unknownMeaning: "المعنى غير متاح لهذا المصطلح حاليًا",
  },
  en: {
    title: "Spaced review",
    intro: "Due cards are derived from your past answers (Leitner: 1 / 3 / 7 / 16 / 35 / 75 days).",
    dueNow: (n: string) => `${n} cards due today`,
    start: "Start reviewing",
    nothingDue: "No terms due today. Watch new videos and drill their terms, or come back tomorrow.",
    backHome: "Back to the Linux section",
    tapToFlip: "Tap the card to flip it",
    know: "I know it",
    dontKnow: "I don't know it",
    progress: (done: string, total: string) => `${done} of ${total}`,
    doneTitle: "Today's review is done",
    doneScore: (ok: string, total: string) => `You got ${ok} of ${total} right`,
    again: "Review again",
    boxLabel: (n: string) => `Box ${n}`,
    maxBox: "term in the top box",
    unknownMeaning: "No meaning stored for this term right now",
  },
} as const;

export default function LinuxReviewSession() {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const { ready, file, track } = useProgressStore();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<boolean[]>([]);

  // Lookup table: normalized term -> meaning (from all videos).
  const meaningByTerm = useMemo(() => {
    const map = new Map<string, { ar: string; example?: string }>();
    for (const v of linuxVideos) {
      for (const t of v.terms) {
        const key = normalizeTerm(t.en);
        if (!map.has(key)) {
          map.set(key, { ar: t.ar, example: t.example });
        }
      }
    }
    return map;
  }, []);

  const due = useMemo(() => (ready ? deriveSrs(file.events, undefined, "linux").due : []), [ready, file.events]);

  if (!ready) {
    return <div className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />;
  }

  if (!started) {
    return (
      <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-l from-violet-500/[0.09] to-emerald-500/[0.09] p-8 text-center">
        <Brain className="mx-auto h-12 w-12 text-violet-300" />
        <h1 className="mt-4 text-2xl font-black text-white">{c.title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">{c.intro}</p>
        {due.length === 0 ? (
          <>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-300">{c.nothingDue}</p>
            <Link
              href="/linux"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
              {c.backHome}
            </Link>
          </>
        ) : (
          <>
            <p dir="ltr" className="mt-5 text-4xl font-black text-white">{formatNumber(due.length)}</p>
            <p className="mt-1 text-sm text-slate-400">{c.dueNow(formatNumber(due.length))}</p>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-500 to-emerald-500 px-6 py-3 font-black text-white hover:opacity-90"
            >
              <Sparkles className="h-5 w-5" />
              {c.start}
            </button>
          </>
        )}
      </div>
    );
  }

  const finished = index >= due.length;
  if (finished) {
    const correct = sessionResults.filter(Boolean).length;
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <Check className="mx-auto h-12 w-12 text-emerald-400" />
        <h1 className="mt-4 text-2xl font-black text-white">{c.doneTitle}</h1>
        <p className="mt-2 text-slate-300">{c.doneScore(formatNumber(correct), formatNumber(sessionResults.length))}</p>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            setSessionResults([]);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          {c.again}
        </button>
      </div>
    );
  }

  const current = due[index];
  const meaning = meaningByTerm.get(current.term);

  const answer = (known: boolean) => {
    track("linux", "term_review", {
      payload: { term: current.term, known },
    });
    setSessionResults((prev) => [...prev, known]);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <div data-quiz>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span dir="ltr" className="text-xs font-bold text-slate-500">
          {c.progress(formatNumber(index + 1), formatNumber(due.length))}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400">
          {current.box >= SRS_MAX_BOX ? `${c.boxLabel(String(SRS_MAX_BOX))} · ${c.maxBox}` : c.boxLabel(String(current.box))}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        className="block w-full rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/[0.09] to-emerald-500/[0.09] p-10 text-center focus:outline-none focus:ring-2 focus:ring-violet-400"
      >
        {!flipped ? (
          <>
            <span className="text-xs uppercase tracking-widest text-violet-300">{c.tapToFlip}</span>
            <p dir="ltr" className="mt-4 text-3xl font-black text-white">{current.term}</p>
          </>
        ) : (
          <>
            {meaning ? (
              <>
                <p dir="rtl" className="text-2xl font-black text-emerald-300">{meaning.ar}</p>
                {meaning.example && (
                  <code dir="ltr" className="mt-4 block font-mono text-base text-slate-200">{meaning.example}</code>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">{c.unknownMeaning}</p>
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
