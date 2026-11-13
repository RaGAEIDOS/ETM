"use client";

/**
 * Mixed-type practice engine for the Programming Advices track.
 * Types: mcq / fill / trace / pseudocode / match / order. Exactly one correct
 * answer per item. A full pass emits ONE quiz_attempt (track
 * "programmingadvices", itemId = lesson id, topic = course id).
 *
 * Miku affordances are authored locally (no AI call): a hint appears BEFORE
 * answering, and a wrong answer unlocks "explain my wrong answer" which shows
 * the authored explanation. Correct answers are never revealed by the hint.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import {
  normalizePaAnswer,
  paAcceptedAnswers,
  type PAPracticeItem,
} from "@/lib/programmingadvices-videos";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  HelpCircle,
  ListChecks,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const COPY = {
  ar: {
    title: "تدرّب على ما شاهدت",
    passNote: "لإنجاز الدرس تحتاج ٧٠٪ أو أكثر في هذا التمرين",
    retry: "إعادة المحاولة",
    check: "تحقق",
    clear: "مسح",
    fillPlaceholder: "اكتب إجابتك هنا…",
    correctAnswer: "الإجابة الصحيحة",
    excellent: "ممتاز! كل الإجابات صحيحة 🎉",
    score: (ok: string, total: string) => `أجبت بشكل صحيح على ${ok} من ${total}`,
    review: "راجع الشرح أعلاه وحاول مرة أخرى",
    passed: "اجتزت التمرين — أحسنت",
    hint: "تلميح من ميكو",
    hideHint: "إخفاء التلميح",
    explainWrong: "اشرح لي إجابتي الخاطئة",
    wrongExplanation: "لماذا كانت الإجابة خاطئة؟",
    matchPrompt: "صل كل عنصر بمطابقه — محاولة خاطئة واحدة تُحسب خطأ",
    orderPrompt: "رتّب الخطوات بالترتيب الصحيح",
    yourAnswer: "إجابتك",
    exercise: "تمرين",
  },
  en: {
    title: "Practice what you watched",
    passNote: "You need 70% or more on this drill to complete the lesson",
    retry: "Retry",
    check: "Check",
    clear: "Clear",
    fillPlaceholder: "Type your answer…",
    correctAnswer: "Correct answer",
    excellent: "Excellent! All answers correct 🎉",
    score: (ok: string, total: string) => `You answered ${ok} of ${total} correctly`,
    review: "Review the explanation above and try again",
    passed: "Drill passed",
    hint: "Miku hint",
    hideHint: "Hide hint",
    explainWrong: "Explain my wrong answer",
    wrongExplanation: "Why was that wrong?",
    matchPrompt: "Match each item — one wrong attempt counts as a miss",
    orderPrompt: "Arrange the steps in the correct order",
    yourAnswer: "Your answer",
    exercise: "Exercise",
  },
} as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Hint({
  text,
  c,
}: {
  text: string;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300 hover:text-violet-200"
        aria-expanded={open}
      >
        <Lightbulb className="h-3.5 w-3.5" />
        {open ? c.hideHint : c.hint}
      </button>
      {open && (
        <p dir="auto" className="mt-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.07] px-3 py-2 text-xs leading-6 text-violet-100">
          {text}
        </p>
      )}
    </div>
  );
}

function Explanation({
  text,
  wrongText,
  c,
}: {
  text: string;
  /** Text shown on a wrong answer: Miku explains the mistake. */
  wrongText?: string;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [open, setOpen] = useState(false);
  if (!wrongText) {
    return (
      <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7 text-cyan-100">
        <p dir="auto">{text}</p>
      </div>
    );
  }
  return (
    <div className="mt-3">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-500/[0.14]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {c.explainWrong}
        </button>
      )}
      {open && (
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7 text-cyan-100">
          {wrongText && <p className="mb-1 font-bold text-amber-200">{c.wrongExplanation}</p>}
          <p dir="auto">{text}</p>
        </div>
      )}
    </div>
  );
}

function McqItem({
  item,
  locked,
  ok,
  onResolve,
  c,
  isAr,
}: {
  item: Extract<PAPracticeItem, { type: "mcq" }>;
  locked: boolean;
  ok: boolean | null;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
  isAr: boolean;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const options = isAr || !item.optionsEn ? item.options : item.optionsEn;
  const pick = (i: number) => {
    if (locked) return;
    setChosen(i);
    onResolve(i === item.answer);
  };
  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => {
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
      {locked && (
        <Explanation
          text={isAr ? item.explanation : item.explanationEn}
          wrongText={ok === false ? (isAr ? item.explanation : item.explanationEn) : undefined}
          c={c}
        />
      )}
    </div>
  );
}

function TypedItem({
  item,
  locked,
  onResolve,
  c,
  isAr,
}: {
  item: Extract<PAPracticeItem, { type: "fill" | "trace" | "pseudocode" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
  isAr: boolean;
}) {
  const [text, setText] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const submit = () => {
    if (locked || text.trim() === "") return;
    const given = normalizePaAnswer(text);
    const accepted = paAcceptedAnswers(item.answer, item.accept);
    const correct = accepted.includes(given);
    setOk(correct);
    onResolve(correct);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {item.code && (
        <pre
          dir="ltr"
          className="mb-3 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 text-start font-mono text-xs leading-6 text-cyan-200"
        >
          {item.code}
        </pre>
      )}
      <p dir="auto" className="mb-3 font-semibold leading-8 text-white">
        {isAr ? item.prompt : item.promptEn}
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          placeholder={c.fillPlaceholder}
          dir="auto"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/60"
        />
        {!locked && (
          <button type="submit" className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-ink-950 hover:bg-amber-300">
            {c.check}
          </button>
        )}
      </div>
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}: <span dir="auto" className="font-bold text-emerald-300">{item.answer}</span>
        </p>
      )}
      {locked && (
        <Explanation
          text={isAr ? item.explanation : item.explanationEn}
          wrongText={ok === false ? (isAr ? item.explanation : item.explanationEn) : undefined}
          c={c}
        />
      )}
    </form>
  );
}

function MatchItem({
  item,
  locked,
  onResolve,
  c,
  isAr,
}: {
  item: Extract<PAPracticeItem, { type: "match" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
  isAr: boolean;
}) {
  const rightText = (index: number) =>
    isAr || !item.pairs[index].rightEn ? item.pairs[index].right : item.pairs[index].rightEn!;
  const [rights, setRights] = useState(() => item.pairs.map((_, i) => i));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [misses, setMisses] = useState(0);
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  useEffect(() => {
    setRights((prev) => (Object.keys(matched).length === 0 ? shuffle(prev) : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locked) return;
    if (Object.keys(matched).length === item.pairs.length) {
      onResolve(misses === 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const pickRight = (rightKey: number) => {
    if (locked || selectedLeft === null) return;
    if (Object.values(matched).includes(rightKey)) return;
    const li = selectedLeft;
    if (rightKey === li) {
      setMatched((prev) => ({ ...prev, [li]: rightKey }));
      setSelectedLeft(null);
    } else {
      setMisses((n) => n + 1);
      setWrongRight(rightKey);
      setSelectedLeft(null);
      window.setTimeout(() => setWrongRight(null), 600);
    }
  };

  return (
    <div dir="ltr">
      <p dir="auto" className="mb-3 text-sm text-slate-400">
        {isAr ? (item.prompt ?? c.matchPrompt) : (item.promptEn ?? c.matchPrompt)}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {item.pairs.map((p, li) => {
            const done = matched[li] !== undefined;
            const active = selectedLeft === li;
            return (
              <button
                key={`l-${li}`}
                type="button"
                disabled={locked || done}
                onClick={() => setSelectedLeft(active ? null : li)}
                className={`w-full rounded-lg border px-3 py-2.5 text-start text-sm font-semibold transition-all ${
                  done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : active
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                <span dir="auto">{p.left}</span>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((rightKey) => {
            const taken = Object.values(matched).includes(rightKey);
            const wrong = wrongRight === rightKey;
            return (
              <button
                key={`r-${rightKey}`}
                type="button"
                disabled={locked || taken}
                onClick={() => pickRight(rightKey)}
                className={`w-full rounded-lg border px-3 py-2.5 text-start text-sm font-semibold transition-all ${
                  taken
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : wrong
                      ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                <span dir="auto">{rightText(rightKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
      {locked && (
        <Explanation
          text={isAr ? item.explanation : item.explanationEn}
          wrongText={misses > 0 ? (isAr ? item.explanation : item.explanationEn) : undefined}
          c={c}
        />
      )}
    </div>
  );
}

function OrderItem({
  item,
  locked,
  onResolve,
  c,
  isAr,
}: {
  item: Extract<PAPracticeItem, { type: "order" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
  isAr: boolean;
}) {
  const texts = isAr || !item.stepsEn ? item.steps : item.stepsEn;
  const [pool, setPool] = useState(() => item.steps.map((_, i) => i));
  const [built, setBuilt] = useState<number[]>([]);

  useEffect(() => {
    setPool((prev) => shuffle(prev));
  }, []);

  const pick = (i: number) => {
    if (locked) return;
    setBuilt((prev) => [...prev, i]);
    setPool((prev) => prev.filter((x) => x !== i));
  };
  const unpick = (i: number) => {
    if (locked) return;
    setBuilt((prev) => prev.filter((x) => x !== i));
    setPool((prev) => [...prev, i]);
  };
  const submit = () => {
    if (locked || built.length !== item.steps.length) return;
    onResolve(built.every((value, index) => value === index));
  };
  return (
    <div>
      <p dir="auto" className="mb-3 text-sm text-slate-400">
        {isAr ? item.prompt : item.promptEn}
      </p>
      <div dir="ltr" className="mb-3 min-h-12 space-y-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
        {built.map((i, position) => (
          <button
            key={`b-${i}`}
            type="button"
            disabled={locked}
            onClick={() => unpick(i)}
            className="flex w-full items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-start text-sm font-bold text-emerald-200"
          >
            <span className="font-mono text-[10px] text-emerald-400">{position + 1}.</span>
            <span dir="auto">{texts[i]}</span>
          </button>
        ))}
        {built.length === 0 && <span className="self-center text-sm text-slate-600">…</span>}
      </div>
      <div dir="ltr" className="flex flex-wrap gap-2">
        {pool.map((i) => (
          <button
            key={`p-${i}`}
            type="button"
            disabled={locked}
            onClick={() => pick(i)}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200 hover:bg-white/[0.08]"
          >
            <span dir="auto">{texts[i]}</span>
          </button>
        ))}
      </div>
      {!locked && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={built.length !== item.steps.length}
            className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-black text-ink-950 hover:bg-amber-300 disabled:opacity-40"
          >
            {c.check}
          </button>
          <button
            type="button"
            onClick={() => {
              setBuilt([]);
              setPool(item.steps.map((_, i) => i));
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> {c.clear}
          </button>
        </div>
      )}
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}:{" "}
          <span dir="auto" className="font-bold text-emerald-300">{texts.join(" → ")}</span>
        </p>
      )}
      {locked && (
        <Explanation
          text={isAr ? item.explanation : item.explanationEn}
          wrongText={built.some((v, i) => v !== i) ? (isAr ? item.explanation : item.explanationEn) : undefined}
          c={c}
        />
      )}
    </div>
  );
}

export default function PAPractice({
  items,
  videoId,
  courseId,
}: {
  items: PAPracticeItem[];
  videoId: string;
  courseId: string;
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
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
      trackEvent("programmingadvices", "quiz_attempt", {
        itemId: videoId,
        topic: courseId,
        payload: {
          score,
          total,
          perQuestion: results.map((r) => r === true),
        },
      });
    }
    if (!allAnswered) emittedRef.current = false;
  }, [allAnswered, score, total, results, videoId, courseId]);

  const setResult = (index: number, ok: boolean) =>
    setResults((prev) => prev.map((r, i) => (i === index ? ok : r)));

  const reset = () => {
    setResults(items.map(() => null));
    emittedRef.current = false;
  };

  if (total === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
        <ListChecks className="h-5 w-5 text-amber-400" />
        {c.title}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <HelpCircle className="h-5 w-5 text-amber-400" />
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
                <div className="min-w-0">
                  <p className="font-semibold leading-7 text-white" dir="auto">
                    <span className="me-1 font-mono text-amber-400">{formatNumber(i + 1)}.</span>
                    {item.type === "mcq" ? (isAr ? item.prompt : item.promptEn) : c.exercise}
                  </p>
                  <Hint text={isAr ? item.hint : item.hintEn} c={c} />
                </div>
                {ok !== null &&
                  (ok ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  ))}
              </div>
              {item.type === "mcq" && (
                <McqItem item={item} locked={locked} ok={ok} onResolve={(ok2) => setResult(i, ok2)} c={c} isAr={isAr} />
              )}
              {(item.type === "fill" || item.type === "trace" || item.type === "pseudocode") && (
                <TypedItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} isAr={isAr} />
              )}
              {item.type === "match" && (
                <MatchItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} isAr={isAr} />
              )}
              {item.type === "order" && (
                <OrderItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} isAr={isAr} />
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-l from-amber-500/10 to-cyan-500/10 p-6 text-center">
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
