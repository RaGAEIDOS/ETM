"use client";

/**
 * Mixed-type practice engine for the English track (Phase 4.4).
 * Item types: mcq / fill / dictation / order / match. Exactly one correct
 * answer each; a full pass emits ONE quiz_attempt (track "english",
 * itemId = videoId, topic = courseId) so dashboard accuracy works unchanged.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import { normalizePracticeAnswer, type EnglishPracticeItem } from "@/lib/english-videos";
import {
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Trophy,
  HelpCircle,
  ListChecks,
} from "lucide-react";

const COPY = {
  ar: {
    title: "تدرّب على ما شاهدت",
    passNote: "لإنجاز الدرس تحتاج ٧٠٪ أو أكثر في هذا التمرين",
    correct: "صحيحة",
    retry: "إعادة المحاولة",
    check: "تحقق",
    listen: "استمع",
    clear: "مسح",
    orderPrompt: "رتّب الكلمات لبناء الجملة الصحيحة",
    matchPrompt: "صل كل عنصر بمطابقه — محاولة خاطئة واحدة تُحسب خطأ",
    fillPlaceholder: "اكتب إجابتك هنا…",
    correctAnswer: "الإجابة الصحيحة",
    excellent: "ممتاز! كل الإجابات صحيحة 🎉",
    score: (ok: string, total: string) => `أجبت بشكل صحيح على ${ok} من ${total}`,
    review: "راجع الشرح أعلاه وحاول مرة أخرى",
    passed: "اجتزت التمرين — أحسنت",
  },
  en: {
    title: "Practice what you watched",
    passNote: "You need 70% or more on this drill to complete the lesson",
    correct: "correct",
    retry: "Retry",
    check: "Check",
    listen: "Listen",
    clear: "Clear",
    orderPrompt: "Arrange the words to build the correct sentence",
    matchPrompt: "Match each item — one wrong attempt counts as a miss",
    fillPlaceholder: "Type your answer…",
    correctAnswer: "Correct answer",
    excellent: "Excellent! All answers correct 🎉",
    score: (ok: string, total: string) => `You answered ${ok} of ${total} correctly`,
    review: "Review the explanation above and try again",
    passed: "Drill passed",
  },
} as const;

function speakEn(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    synth.speak(utterance);
  } catch {
    /* speech synthesis unavailable — the text remains visible for dictation review */
  }
}

const acceptedAnswers = (answer: string, accept?: string[]) =>
  [answer, ...(accept ?? [])].map(normalizePracticeAnswer);

function Explanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div dir="rtl" className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm text-cyan-100 leading-7">
      {text}
    </div>
  );
}

/** Shared locked chrome: the explanation block shown once an item is resolved. */
function LockedMark({ ok }: { ok: boolean | null }) {
  if (ok === null) return null;
  return ok ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
  ) : (
    <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
  );
}

function McqItem({ item, locked, ok, onResolve, c }: {
  item: Extract<EnglishPracticeItem, { type: "mcq" }>;
  locked: boolean;
  ok: boolean | null;
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
            className={`w-full flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-start text-sm font-medium transition-all ${cls}`}>
            <span dir="auto" className="leading-6">{opt}</span>
            {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {answered && isChosen && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          </button>
        );
      })}
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}

function TypedItem({ item, locked, onResolve, c }: {
  item: Extract<EnglishPracticeItem, { type: "fill" | "dictation" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [text, setText] = useState("");
  const submit = () => {
    if (locked || text.trim() === "") return;
    const given = normalizePracticeAnswer(text);
    onResolve(acceptedAnswers(item.answer, item.accept).includes(given));
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      {item.type === "dictation" && (
        <div className="mb-3">
          <button type="button" onClick={() => speakEn(item.say)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20">
            <Volume2 className="h-4 w-4" />
            {c.listen}
          </button>
        </div>
      )}
      {item.type === "fill" && (
        <p dir="auto" className="mb-3 text-white font-semibold leading-8">{item.prompt}</p>
      )}
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
          className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400/60"
        />
        {!locked && (
          <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-ink-950 hover:bg-emerald-400">
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

/** Fisher–Yates with Math.random — client-side only shuffle after mount. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MatchItem({ item, locked, onResolve, c }: {
  item: Extract<EnglishPracticeItem, { type: "match" }>;
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
    if (normalizePracticeAnswer(rights[ri]) === normalizePracticeAnswer(item.pairs[li].right)) {
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
      {item.prompt && <p dir="auto" className="mb-3 font-semibold text-white leading-7">{item.prompt}</p>}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {item.pairs.map((p, li) => {
            const done = matched[li] !== undefined;
            const active = selectedLeft === li;
            return (
              <button key={`l-${li}`} type="button" disabled={locked || done}
                onClick={() => setSelectedLeft(active ? null : li)}
                className={`w-full rounded-lg border px-3 py-2.5 text-start text-sm font-semibold transition-all ${
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

interface EnglishPracticeProps {
  items: EnglishPracticeItem[];
  /** ETM video id — itemId of the emitted quiz_attempt. */
  videoId: string;
  /** Course id — topic of the emitted quiz_attempt (per-topic accuracy). */
  courseId: string;
}

export default function EnglishPractice({ items, videoId, courseId }: EnglishPracticeProps) {
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
      trackEvent("english", "quiz_attempt", {
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
                <p className="font-semibold text-white leading-7" dir="auto">
                  <span className="me-1 font-mono text-emerald-400">{formatNumber(i + 1)}.</span>
                  {item.type === "mcq" || item.type === "fill" ? item.prompt : null}
                </p>
                <LockedMark ok={ok} />
              </div>
              {item.type === "mcq" && (
                <McqItem item={item} locked={locked} ok={ok} onResolve={(ok2) => setResult(i, ok2)} c={c} />
              )}
              {(item.type === "fill" || item.type === "dictation") && (
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

function OrderItem({ item, locked, onResolve, c }: {
  item: Extract<EnglishPracticeItem, { type: "order" }>;
  locked: boolean;
  onResolve: (ok: boolean) => void;
  c: (typeof COPY)[keyof typeof COPY];
}) {
  const [built, setBuilt] = useState<number[]>([]);
  const toggle = (i: number) => {
    if (locked) return;
    setBuilt((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };
  const submit = () => {
    if (locked || built.length === 0) return;
    const sentence = built.map((i) => item.words[i]).join(" ");
    onResolve(normalizePracticeAnswer(sentence) === normalizePracticeAnswer(item.answer));
  };
  return (
    <div>
      <p className="mb-3 text-sm text-slate-400">{c.orderPrompt}</p>
      {item.prompt && <p dir="auto" className="mb-3 font-semibold text-white leading-7">{item.prompt}</p>}
      <div dir="ltr" className="mb-3 flex min-h-12 flex-wrap gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3">
        {built.map((i) => (
          <button key={`b-${i}`} type="button" disabled={locked} onClick={() => toggle(i)}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-200">
            {item.words[i]}
          </button>
        ))}
        {built.length === 0 && <span className="text-sm text-slate-600 self-center">…</span>}
      </div>
      <div dir="ltr" className="flex flex-wrap gap-2">
        {item.words.map((w, i) =>
          built.includes(i) ? null : (
            <button key={`w-${i}`} type="button" disabled={locked} onClick={() => toggle(i)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200 hover:bg-white/[0.08]">
              {w}
            </button>
          ),
        )}
      </div>
      {!locked && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={submit} className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-black text-ink-950 hover:bg-emerald-400">
            {c.check}
          </button>
          <button type="button" onClick={() => setBuilt([])} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-400 hover:text-white">
            <RotateCcw className="h-4 w-4" /> {c.clear}
          </button>
        </div>
      )}
      {locked && (
        <p className="mt-3 text-sm text-slate-400">
          {c.correctAnswer}: <span dir="auto" className="font-bold text-emerald-300">{item.answer}</span>
        </p>
      )}
      {locked && <Explanation text={item.explanation} />}
    </div>
  );
}
