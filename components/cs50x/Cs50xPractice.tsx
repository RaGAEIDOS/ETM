"use client";

/**
 * Practice engine for the CS50x track.
 * Item types: mcq / fill. Exactly one correct answer each; a full pass emits
 * ONE quiz_attempt (track "cs50x", itemId = lecture id, topic = course id)
 * so dashboard accuracy works unchanged.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import { normalizeCs50xAnswer, type Cs50xPracticeItem } from "@/lib/cs50x";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  HelpCircle,
  ListChecks,
} from "lucide-react";

const COPY = {
  ar: {
    title: "تدرّب على ما شاهدت",
    passNote: "لإنجاز المحاضرة تحتاج ٧٠٪ أو أكثر في هذا التمرين",
    retry: "إعادة المحاولة",
    check: "تحقق",
    fillPlaceholder: "اكتب إجابتك هنا…",
    correctAnswer: "الإجابة الصحيحة",
    excellent: "ممتاز! كل الإجابات صحيحة 🎉",
    score: (ok: string, total: string) => `أجبت بشكل صحيح على ${ok} من ${total}`,
    review: "راجع الشرح أعلاه وحاول مرة أخرى",
    passed: "اجتزت التمرين — أحسنت",
  },
  en: {
    title: "Practice what you watched",
    passNote: "You need 70% or more on this drill to complete the lecture",
    retry: "Retry",
    check: "Check",
    fillPlaceholder: "Type your answer…",
    correctAnswer: "Correct answer",
    excellent: "Excellent! All answers correct 🎉",
    score: (ok: string, total: string) => `You answered ${ok} of ${total} correctly`,
    review: "Review the explanation above and try again",
    passed: "Drill passed",
  },
} as const;

const accepted = (answer: string, accept?: string[]) =>
  [answer, ...(accept ?? [])].map(normalizeCs50xAnswer);

function Explanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div
      dir="rtl"
      className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7 text-cyan-100"
    >
      {text}
    </div>
  );
}

function McqItem({
  item,
  locked,
  onResolve,
}: {
  item: Extract<Cs50xPracticeItem, { type: "mcq" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const pick = (i: number) => {
    if (locked) return;
    setChosen(i);
    onResolve(i === item.answer);
  };
  return (
    <div className="space-y-2.5">
      {item.options.map((opt, i) => {
        const answered = chosen !== null || locked;
        const isCorrect = i === item.answer;
        const isChosen = chosen === i;
        let cls = "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-slate-300";
        if (answered) {
          if (isCorrect) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
          else if (isChosen) cls = "border-rose-500/50 bg-rose-500/10 text-rose-300";
          else cls = "border-white/5 bg-white/[0.01] text-slate-500";
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            disabled={answered}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-start text-sm font-medium transition-all ${cls}`}
          >
            <span dir="auto" className="leading-6">{opt}</span>
            {answered && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />}
            {answered && isChosen && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-rose-400" />}
          </button>
        );
      })}
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

function FillItem({
  item,
  locked,
  onResolve,
  placeholder,
  checkLabel,
  correctAnswerLabel,
}: {
  item: Extract<Cs50xPracticeItem, { type: "fill" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  placeholder: string;
  checkLabel: string;
  correctAnswerLabel: string;
}) {
  const [text, setText] = useState("");
  const submit = () => {
    if (locked || text.trim() === "") return;
    const given = normalizeCs50xAnswer(text);
    onResolve(accepted(item.answer, item.accept).includes(given));
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p dir="auto" className="mb-3 font-semibold leading-8 text-white">{item.prompt}</p>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          dir="auto"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400/60"
        />
        {!locked && (
          <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-ink-950 hover:bg-emerald-400">
            {checkLabel}
          </button>
        )}
      </div>
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {correctAnswerLabel}: <span dir="auto" className="font-bold text-emerald-300">{item.answer}</span>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </form>
  );
}

interface Cs50xPracticeProps {
  items: Cs50xPracticeItem[];
  /** Lecture id — itemId of the emitted quiz_attempt. */
  lectureId: string;
  /** Week id — topic of the emitted quiz_attempt (per-topic accuracy). */
  topic: string;
}

export default function Cs50xPractice({ items, lectureId, topic }: Cs50xPracticeProps) {
  const c = useCopy(COPY);
  const [results, setResults] = useState<(boolean | null)[]>(() => items.map(() => null));
  const emittedRef = useRef(false);

  const answered = results.filter((r) => r !== null).length;
  const score = results.filter((r) => r === true).length;
  const total = items.length;
  const allAnswered = total > 0 && answered === total;
  const passed = allAnswered && score / total >= 0.7;

  useEffect(() => {
    if (allAnswered && !emittedRef.current) {
      emittedRef.current = true;
      trackEvent("cs50x", "quiz_attempt", {
        itemId: lectureId,
        topic,
        payload: { score, total, perQuestion: results.map((r) => r === true) },
      });
    }
    if (!allAnswered) emittedRef.current = false;
  }, [allAnswered, score, total, results, lectureId, topic]);

  const setResult = (index: number, ok: boolean) =>
    setResults((prev) => prev.map((r, i) => (i === index ? ok : r)));

  const reset = () => {
    setResults(items.map(() => null));
    emittedRef.current = false;
  };

  if (total === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
        <ListChecks className="h-5 w-5 text-emerald-400" />
        {c.title}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <HelpCircle className="h-5 w-5 text-emerald-400" />
          {c.title}
        </h3>
        <p className="text-xs text-slate-500">{c.passNote}</p>
      </div>

      <div className="space-y-5">
        {items.map((item, i) => {
          const ok = results[i];
          const locked = ok !== null;
          return (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="font-semibold leading-7 text-white" dir="auto">
                  {item.type === "mcq" && (
                    <>
                      <span className="me-1 font-mono text-emerald-400">{formatNumber(i + 1)}.</span>
                      {item.prompt}
                    </>
                  )}
                </p>
                {locked &&
                  (ok ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  ))}
              </div>
              {item.type === "mcq" && <McqItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} />}
              {item.type === "fill" && (
                <FillItem
                  item={item}
                  locked={locked}
                  onResolve={(ok2) => setResult(i, ok2)}
                  placeholder={c.fillPlaceholder}
                  checkLabel={c.check}
                  correctAnswerLabel={c.correctAnswer}
                />
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-l from-emerald-500/10 to-cyan-500/10 p-6 text-center">
          <Trophy className={`mx-auto mb-3 h-8 w-8 ${passed ? "text-amber-400" : "text-slate-500"}`} />
          <p className="text-lg font-bold text-white">
            {score === total ? c.excellent : c.score(formatNumber(score), formatNumber(total))}
          </p>
          <p className="mt-1 text-sm text-slate-400">{passed ? c.passed : c.review}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {c.retry}
          </button>
        </div>
      )}
    </div>
  );
}
