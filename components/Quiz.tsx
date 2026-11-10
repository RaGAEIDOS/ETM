"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Trophy } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q, i) => answers[i] === q.answer
  ).length;
  const allAnswered = answeredCount === questions.length;

  const select = (qIndex: number, oIndex: number) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const reset = () => setAnswers({});

  return (
    <div className="my-8" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          Test your understanding
        </h3>
        {answeredCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              {correctCount} / {answeredCount} correct
            </span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
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
              <p className="font-semibold text-white mb-4 leading-7">
                <span className="text-cyan-400 font-mono ms-1">{qi + 1}.</span>
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
                      className={`w-full text-right rounded-lg border px-4 py-3 text-sm font-medium transition-all flex items-center justify-between gap-3 ${cls}`}
                    >
                      <span className="leading-6">{opt}</span>
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
                <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-3 text-sm text-cyan-100 leading-7">
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
              ? "Excellent! All answers correct"
              : `You answered ${correctCount} of ${questions.length} correctly`}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {correctCount === questions.length
              ? "You are ready for the next lesson"
              : "Review the lesson and try again — repetition is the secret to mastery"}
          </p>
        </div>
      )}
    </div>
  );
}
