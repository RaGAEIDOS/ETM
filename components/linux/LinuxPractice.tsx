"use client";

/**
 * Mixed-type practice engine for the Linux track.
 * Item types: mcq / cmd / chmod / order / match. Exactly one correct answer
 * each; a full pass emits ONE quiz_attempt (track "linux",
 * itemId = videoId, topic = courseId) so dashboard accuracy works unchanged.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import { normalizeLinuxAnswer, type LinuxPracticeItem } from "@/lib/linux-videos";
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
    passNote: "لإتمام الدرس تحتاج ٧٠٪ أو أكثر في هذا التمرين",
    retry: "إعادة المحاولة",
    check: "تحقق",
    clear: "مسح",
    orderPrompt: "رتّب الخطوات بالترتيب الصحيح",
    matchPrompt: "صل كل أمر أو مصطلح بمطابقه — محاولة خاطئة واحدة تُحسب خطأ",
    typedPlaceholder: "اكتب الأمر هنا…",
    chmodPlaceholder: "اكتب الصيغة هنا…",
    correctAnswer: "الإجابة الصحيحة",
    excellent: "ممتاز! كل الإجابات صحيحة 🎉",
    score: (ok: string, total: string) => `أجبت بشكل صحيح على ${ok} من ${total}`,
    review: "راجع الشرح أسفل كل سؤال وحاول مرة أخرى",
    passed: "اجتزت التمرين — أحسنت",
    empty: "أسئلة هذا الدرس قيد الإعداد — شاهد الفيديو ثم عُد لاحقًا.",
  },
  en: {
    title: "Practice what you watched",
    passNote: "You need 70% or more on this drill to complete the lesson",
    retry: "Retry",
    check: "Check",
    clear: "Clear",
    orderPrompt: "Arrange the steps in the correct order",
    matchPrompt: "Match each command or term to its match — one wrong attempt counts as a miss",
    typedPlaceholder: "Type the command…",
    chmodPlaceholder: "Type the answer…",
    correctAnswer: "Correct answer",
    excellent: "Excellent! All answers correct 🎉",
    score: (ok: string, total: string) => `You answered ${ok} of ${total} correctly`,
    review: "Review the explanation under each question and try again",
    passed: "Drill passed",
    empty: "This lesson's questions are being prepared — watch the video and come back later.",
  },
} as const;

const acceptedAnswers = (answer: string, accept?: string[]) =>
  [answer, ...(accept ?? [])].map(normalizeLinuxAnswer);

function Explanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div dir="rtl" className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm leading-7 text-cyan-100">
      {text}
    </div>
  );
}

function LockedMark({ ok }: { ok: boolean | null }) {
  if (ok === null) return null;
  return ok ? (
    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
  ) : (
    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
  );
}

function McqItem({ item, locked, onResolve, c }: {
  item: Extract<LinuxPracticeItem, { type: "mcq" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
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
          <button key={i} type="button" onClick={() => pick(i)} disabled={answered}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-start text-sm font-medium transition-all ${cls}`}>
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

function TypedItem({ item, locked, onResolve, c }: {
  item: Extract<LinuxPracticeItem, { type: "cmd" | "chmod" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [text, setText] = useState("");
  const submit = () => {
    if (locked || text.trim() === "") return;
    const given = normalizeLinuxAnswer(text);
    onResolve(acceptedAnswers(item.answer, item.accept).includes(given));
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <p dir="auto" className="mb-3 font-semibold leading-8 text-white">{item.prompt}</p>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          placeholder={item.type === "chmod" ? c.chmodPlaceholder : c.typedPlaceholder}
          dir="ltr"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-emerald-100 placeholder-slate-600 outline-none focus:border-amber-400/60"
        />
        {!locked && (
          <button type="submit" className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-ink-950 hover:bg-amber-400">
            {c.check}
          </button>
        )}
      </div>
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}: <code dir="ltr" className="font-bold text-amber-300">{item.answer}</code>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </form>
  );
}

/** Fisher–Yates with Math.random — client-side only shuffle after mount. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OrderItem({ item, locked, onResolve, c }: {
  item: Extract<LinuxPracticeItem, { type: "order" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [display, setDisplay] = useState<number[]>(() => item.steps.map((_, i) => i));
  const [built, setBuilt] = useState<number[]>([]);

  // Shuffle the displayed chip order after mount so SSR/CSR markup matches.
  useEffect(() => {
    setDisplay((prev) => shuffle(prev));
  }, []);

  const toggle = (i: number) => {
    if (locked) return;
    setBuilt((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };
  const submit = () => {
    if (locked || built.length === 0) return;
    onResolve(built.length === item.steps.length && built.every((stepIndex, position) => stepIndex === position));
  };
  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">{c.orderPrompt}</p>
      {item.prompt && <p dir="auto" className="mb-3 font-semibold leading-7 text-white">{item.prompt}</p>}
      <div dir="auto" className="mb-3 flex min-h-12 flex-wrap gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
        {built.map((i, position) => (
          <button key={`b-${i}`} type="button" disabled={locked} onClick={() => toggle(i)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-200">
            <span className="font-mono text-[10px] text-amber-500">{position + 1}</span>
            {item.steps[i]}
          </button>
        ))}
        {built.length === 0 && <span className="self-center text-sm text-slate-600">…</span>}
      </div>
      <div dir="auto" className="flex flex-wrap gap-2">
        {display.filter((i) => !built.includes(i)).map((i) => (
          <button key={`w-${i}`} type="button" disabled={locked} onClick={() => toggle(i)}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200 hover:bg-white/[0.08]">
            {item.steps[i]}
          </button>
        ))}
      </div>
      {!locked && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={submit} className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-black text-ink-950 hover:bg-amber-400">
            {c.check}
          </button>
          <button type="button" onClick={() => setBuilt([])} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white">
            <RotateCcw className="h-4 w-4" /> {c.clear}
          </button>
        </div>
      )}
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}: <span dir="auto" className="font-bold text-amber-300">{item.steps.join(" ← ")}</span>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

function MatchItem({ item, locked, onResolve, c }: {
  item: Extract<LinuxPracticeItem, { type: "match" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [rights, setRights] = useState(() => item.pairs.map((p) => p.right));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({}); // leftIdx -> rightIdx
  const [misses, setMisses] = useState(0);
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  // Shuffle the right column after mount so SSR/CSR markup matches.
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

  const pickRight = (ri: number) => {
    if (locked || selectedLeft === null) return;
    if (Object.values(matched).includes(ri)) return;
    const li = selectedLeft;
    if (normalizeLinuxAnswer(rights[ri]) === normalizeLinuxAnswer(item.pairs[li].right)) {
      setMatched((prev) => ({ ...prev, [li]: ri }));
      setSelectedLeft(null);
    } else {
      setMisses((n) => n + 1);
      setWrongRight(ri);
      setSelectedLeft(null);
      window.setTimeout(() => setWrongRight(null), 600);
    }
  };

  return (
    <div dir="ltr">
      <p dir="rtl" className="mb-3 text-sm text-slate-400">{c.matchPrompt}</p>
      {item.prompt && <p dir="auto" className="mb-3 font-semibold leading-7 text-white">{item.prompt}</p>}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {item.pairs.map((p, li) => {
            const done = matched[li] !== undefined;
            const active = selectedLeft === li;
            return (
              <button key={`l-${li}`} type="button" disabled={locked || done}
                onClick={() => setSelectedLeft(active ? null : li)}
                className={`w-full rounded-lg border px-3 py-2.5 text-start font-mono text-sm font-semibold transition-all ${
                  done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : active
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                }`}>
                <span dir="auto">{p.left}</span>
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((right, ri) => {
            const taken = Object.values(matched).includes(ri);
            const wrong = wrongRight === ri;
            return (
              <button key={`r-${ri}`} type="button" disabled={locked || taken}
                onClick={() => pickRight(ri)}
                className={`w-full rounded-lg border px-3 py-2.5 text-start text-sm font-semibold transition-all ${
                  taken
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : wrong
                      ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                }`}>
                <span dir="auto">{right}</span>
              </button>
            );
          })}
        </div>
      </div>
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

interface LinuxPracticeProps {
  items: LinuxPracticeItem[];
  /** ETM lesson id — itemId of the emitted quiz_attempt. */
  videoId: string;
  /** Course id — topic of the emitted quiz_attempt (per-topic accuracy). */
  courseId: string;
}

export default function LinuxPractice({ items, videoId, courseId }: LinuxPracticeProps) {
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
      trackEvent("linux", "quiz_attempt", {
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
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-slate-400">
        <ListChecks className="h-5 w-5 shrink-0 text-amber-400" />
        {c.empty}
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
                <p className="font-semibold leading-7 text-white" dir="auto">
                  <span className="me-1 font-mono text-amber-400">{formatNumber(i + 1)}.</span>
                  {item.type === "mcq" ? item.prompt : null}
                </p>
                <LockedMark ok={ok} />
              </div>
              {item.type === "mcq" && (
                <McqItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {(item.type === "cmd" || item.type === "chmod") && (
                <TypedItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {item.type === "order" && (
                <OrderItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {item.type === "match" && (
                <MatchItem item={item} locked={locked} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-l from-amber-500/10 to-orange-500/10 p-6 text-center">
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
