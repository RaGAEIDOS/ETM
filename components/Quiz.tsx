"use client";

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/progress/store";
import type { Track } from "@/lib/progress/core";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Trophy } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

const COPY = {
  ar: {
    title: "اختبر فهمك",
    correct: "صحيحة",
    retry: "إعادة المحاولة",
    excellent: "ممتاز! كل الإجابات صحيحة",
    score: (correct: string, total: string) =>
      `أجبت بشكل صحيح على ${correct} من ${total}`,
    readyNext: "أنت جاهز للدرس التالي",
    review: "راجع الدرس وحاول مرة أخرى — التكرار سر الإتقان",
  },
  en: {
    title: "Test your understanding",
    correct: "correct",
    retry: "Retry",
    excellent: "Excellent! All answers correct",
    score: (correct: string, total: string) =>
      `You answered ${correct} of ${total} correctly`,
    readyNext: "You are ready for the next lesson",
    review: "Review the lesson and try again — repetition is the secret to mastery",
  },
} as const;

interface QuizProps {
  questions: QuizQuestion[];
  /** Progress tracking: which track this quiz belongs to (omit to skip tracking). */
  track?: Track;
  /** Item id (lesson id / video id) for per-item "review due" stats. */
  itemId?: string;
  /** Coarse topic for per-topic accuracy (course id for C++, section id for ElZero). */
  topic?: string;
}

export default function Quiz({ questions, track, itemId, topic }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const c = useCopy(COPY);
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.answer
  ).length;
  const allAnswered = answeredCount === questions.length;
  const emittedRef = useRef(false);

  useEffect(() => {
    if (allAnswered && !emittedRef.current && track) {
      emittedRef.current = true;
      trackEvent(track, "quiz_attempt", {
        itemId,
        topic,
        payload: {
          score: correctCount,
          total: questions.length,
          perQuestion: questions.map((q, i) => answers[i] === q.answer),
        },
      });
    }
    if (!allAnswered) emittedRef.current = false;
  }, [allAnswered, correctCount, questions, answers, track, itemId, topic]);

  const select = (qIndex: number, oIndex: number) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const reset = () => setAnswers({});

  return (
    <div data-quiz className="my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          {c.title}
        </h3>
        {answeredCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              {formatNumber(correctCount)} / {formatNumber(answeredCount)}{" "}
              {c.correct}
            </span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {c.retry}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== undefined;
          return (
            <div
              key={qi}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p
                className="font-semibold text-white mb-4 leading-7"
                dir="rtl"
              >
                <span className="text-cyan-400 font-mono me-1">
                  {formatNumber(qi + 1)}.
                </span>
                {q.question}
              </p>
              <div className="space-y-2.5">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;
                  let cls =
                    "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-slate-300";
                  if (isAnswered) {
                    if (isCorrect) {
                      cls =
                        "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                    } else if (isChosen) {
                      cls = "border-rose-500/50 bg-rose-500/10 text-rose-300";
                    } else {
                      cls = "border-white/5 bg-white/[0.01] text-slate-500";
                    }
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => select(qi, oi)}
                      disabled={isAnswered}
                      className={`w-full text-start rounded-lg border px-4 py-3 text-sm font-medium transition-all flex items-center justify-between gap-3 ${cls}`}
                    >
                      <span className="leading-6" dir="auto">
                        {opt}
                      </span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isChosen && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              {isAnswered && q.explanation && (
                <div
                  className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm text-cyan-100 leading-7"
                  dir="rtl"
                >
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-l from-cyan-500/10 to-violet-500/10 p-6 text-center">
          <Trophy className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-white">
            {correctCount === questions.length
              ? c.excellent
              : c.score(
                  formatNumber(correctCount),
                  formatNumber(questions.length)
                )}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {correctCount === questions.length ? c.readyNext : c.review}
          </p>
        </div>
      )}
    </div>
  );
}
