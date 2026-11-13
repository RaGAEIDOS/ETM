"use client";

/**
 * Mixed-type practice engine for the ElZero Web track.
 * Item types: mcq / fill / order / match (see lib/elzero-web-videos.ts).
 * Exactly one correct answer per item; a full pass emits ONE quiz_attempt
 * (track "elzero-web", itemId = video id, topic = course id).
 *
 * Content is Arabic (as published on the channel). UI strings are bilingual.
 * Videos without curated practice items simply render nothing here — the
 * page shows the "pending review" badge instead.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import {
  normalizeElzeroWebAnswer,
  type ElzeroWebPracticeItem,
} from "@/lib/elzero-web-videos";
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
    title: "طبّق ما شاهدته",
    passNote: "تحتاج 70% أو أكثر لاجتياز هذا التدريب",
    retry: "إعادة المحاولة",
    check: "تحقق",
    clear: "مسح",
    fillPlaceholder: "اكتب إجابتك هنا.",
    correctAnswer: "الإجابة الصحيحة",
    excellent: "ممتاز! كل الإجابات صحيحة 🎉",
    score: (ok: string, total: string) => `أجبت ${ok} من ${total} بشكل صحيح`,
    review: "راجع الشرح فوق وحاول مرة أخرى",
    passed: "تم اجتياز التدريب",
    matchPrompt: "طابِق كل عنصر مع نظيره - المحاولة الخاطئة تُحتسب خطأ",
    orderPrompt: "رتّب الخطوات بالترتيب الصحيح",
    exercise: "تمرين",
    empty: "لا توجد أسئلة هنا بعد — شاهد الفيديو أولًا.",
  },
  en: {
    title: "Practice what you watched",
    passNote: "You need 70% or more on this drill to complete it",
    retry: "Retry",
    check: "Check",
    clear: "Clear",
    fillPlaceholder: "Type your answer.",
    correctAnswer: "Correct answer",
    excellent: "Excellent! All answers correct 🎉",
    score: (ok: string, total: string) => `You answered ${ok} of ${total} correctly`,
    review: "Review the explanation above and try again",
    passed: "Drill passed",
    matchPrompt: "Match each item - one wrong attempt counts as a miss",
    orderPrompt: "Arrange the steps in the correct order",
    exercise: "Exercise",
    empty: "No questions here yet — watch the video first.",
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

function Explanation({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7 text-cyan-100">
      <p dir="auto">{text}</p>
    </div>
  );
}

function McqItem({
  item,
  locked,
  ok,
  onResolve,
}: {
  item: Extract<ElzeroWebPracticeItem, { type: "mcq" }>;
  locked: boolean;
  ok: boolean | null;
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
  c,
}: {
  item: Extract<ElzeroWebPracticeItem, { type: "fill" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [text, setText] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const submit = () => {
    if (locked || text.trim() === "") return;
    const given = normalizeElzeroWebAnswer(text);
    const accepted = [item.answer, ...(item.accept ?? [])].map(normalizeElzeroWebAnswer);
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
      <p dir="auto" className="mb-3 font-semibold leading-8 text-white">
        {item.prompt}
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
          className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/60"
        />
        {!locked && (
          <button type="submit" className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-ink-950 hover:bg-cyan-300">
            {c.check}
          </button>
        )}
      </div>
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}: <span dir="auto" className="font-bold text-emerald-300">{item.answer}</span>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </form>
  );
}

function MatchItem({
  item,
  locked,
  onResolve,
  c,
}: {
  item: Extract<ElzeroWebPracticeItem, { type: "match" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
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
        {item.prompt ?? c.matchPrompt}
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
                <span dir="auto">{item.pairs[rightKey].right}</span>
              </button>
            );
          })}
        </div>
      </div>
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

function OrderItem({
  item,
  locked,
  onResolve,
  c,
}: {
  item: Extract<ElzeroWebPracticeItem, { type: "order" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
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
        {item.prompt}
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
            <span dir="auto">{item.steps[i]}</span>
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
            <span dir="auto">{item.steps[i]}</span>
          </button>
        ))}
      </div>
      {!locked && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={built.length !== item.steps.length}
            className="rounded-xl bg-cyan-400 px-5 py-2 text-sm font-black text-ink-950 hover:bg-cyan-300 disabled:opacity-40"
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
          <span dir="auto" className="font-bold text-emerald-300">{item.steps.join(" ← ")}</span>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

export default function ElzeroWebPractice({
  items,
  videoId,
  courseId,
}: {
  items: ElzeroWebPracticeItem[];
  videoId: string;
  /** Course id — stored as topic for weak-topic stats. */
  courseId: string;
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
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
      trackEvent("elzero-web", "quiz_attempt", {
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
        <ListChecks className="h-5 w-5 text-cyan-400" />
        {c.empty}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          {c.title}
        </h3>
        <p className="text-xs text-slate-500">{c.passNote}</p>
      </div>

      <div className="space-y-5">
        {items.map((item, i) => {
          const ok = results[i];
          const locked = ok !== null;
          const promptText =
            item.type === "mcq" || item.type === "fill" || item.type === "order"
              ? item.prompt
              : item.type === "match"
                ? item.prompt ?? null
                : null;
          return (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {promptText !== null && (
                    <p className="font-semibold leading-7 text-white" dir="auto">
                      <span className="me-1 font-mono text-cyan-400">{formatNumber(i + 1)}.</span>
                      {promptText}
                    </p>
                  )}
                  {promptText === null && (
                    <p className="font-semibold leading-7 text-white">
                      <span className="me-1 font-mono text-cyan-400">{formatNumber(i + 1)}.</span>
                      {c.exercise}
                    </p>
                  )}
                </div>
                {ok !== null &&
                  (ok ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  ))}
              </div>
              {item.type === "mcq" && (
                <McqItem item={item} locked={locked} ok={ok} onResolve={(ok2) => setResult(i, ok2)} />
              )}
              {item.type === "fill" && (
                <FillItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {item.type === "match" && (
                <MatchItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {item.type === "order" && (
                <OrderItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-l from-cyan-500/10 to-violet-500/10 p-6 text-center">
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
