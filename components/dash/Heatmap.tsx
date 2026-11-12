"use client";

import { useCopy } from "@/lib/i18n/context";

const COPY = {
  ar: {
    title: "نشاطك — آخر 12 أسبوعًا",
    less: "أقل",
    more: "أكثر",
    activeDay: "يوم نشاط",
    legendHint: "كل مربع = يوم",
  },
  en: {
    title: "Your activity — last 12 weeks",
    less: "Less",
    more: "More",
    activeDay: "day active",
    legendHint: "Each square = one day",
  },
} as const;

/**
 * GitHub-style 12-week activity grid (7 rows = days of the week).
 * Direction stays left-to-right in both locales — time flows inline.
 */
export default function Heatmap({
  grid,
}: {
  grid: { key: string; count: number }[];
}) {
  const c = useCopy(COPY);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-black text-white">{c.title}</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500" dir="ltr">
          <span>{c.less}</span>
          <span className="h-3 w-3 rounded-[3px] bg-white/5" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500/25" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500/45" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500/70" />
          <span>{c.more}</span>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto pb-1" dir="ltr">
        <div
          className="grid grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, 12px)" }}
        >
          {grid.map((d) => (
            <div
              key={d.key}
              title={`${d.key}${d.count ? ` — ${c.activeDay}` : ""}`}
              className={`h-3 w-3 rounded-[3px] ${
                d.count ? "bg-emerald-500/75" : "bg-white/5"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-600">{c.legendHint}</p>
    </div>
  );
}
