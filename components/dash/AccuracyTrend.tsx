"use client";

import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";

const COPY = {
  ar: {
    title: "دقة الاختبارات — آخر 8 أسابيع",
    noQuizzes: "لا توجد محاولات في هذا الأسبوع",
    accuracy: "دقة",
  },
  en: {
    title: "Quiz accuracy — last 8 weeks",
    noQuizzes: "No attempts this week",
    accuracy: "accuracy",
  },
} as const;

function weekLabel(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${m}/${d}`;
}

/** Eight weekly accuracy buckets as a lightweight bar chart (SVG-free). */
export default function AccuracyTrend({
  trend,
}: {
  trend: { weekStart: string; accuracy: number | null }[];
}) {
  const c = useCopy(COPY);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
      <h2 className="font-black text-white">{c.title}</h2>
      <div className="mt-4 flex h-32 items-end gap-2" dir="ltr">
        {trend.map((t) => {
          const pct = t.accuracy;
          const height = pct === null ? 4 : Math.max(6, pct);
          return (
            <div
              key={t.weekStart}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              title={
                pct === null
                  ? `${weekLabel(t.weekStart)} — ${c.noQuizzes}`
                  : `${weekLabel(t.weekStart)} — ${formatNumber(pct)}% ${c.accuracy}`
              }
            >
              <span
                className={`text-[10px] font-bold ${
                  pct === null ? "text-slate-600" : "text-cyan-300"
                }`}
              >
                {pct === null ? "—" : `${formatNumber(pct)}%`}
              </span>
              <div
                className={`w-full rounded-t-md ${
                  pct === null
                    ? "bg-white/5"
                    : "bg-gradient-to-t from-cyan-500/60 to-cyan-300/80"
                }`}
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-slate-500">{weekLabel(t.weekStart)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
