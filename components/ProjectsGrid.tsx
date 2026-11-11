"use client";

import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Rocket,
  Rocket as RocketIcon,
  Target,
  StretchHorizontal,
} from "lucide-react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { projects } from "@/lib/projects";

const LEVELS: { level: number; ar: string; en: string; icon: typeof Layers }[] =
  [
    { level: 0, ar: "كل المستويات", en: "All levels", icon: Layers },
    { level: 1, ar: "سهل جداً", en: "Very Easy", icon: Sparkles },
    { level: 2, ar: "متوسط", en: "Medium", icon: Layers },
    { level: 3, ar: "صعب", en: "Hard", icon: Cpu },
    { level: 4, ar: "متطرّف", en: "Extreme", icon: Rocket },
  ];

const LEVEL_COLORS: Record<number, string> = {
  1: "from-emerald-400 to-cyan-500",
  2: "from-cyan-400 to-blue-500",
  3: "from-violet-400 to-fuchsia-500",
  4: "from-amber-400 to-rose-500",
};

const COPY = {
  ar: {
    hide: "إخفاء خطوات التنفيذ والأهداف الإضافية",
    show: "خطوات التنفيذ والأهداف الإضافية",
    implSteps: "خطوات التنفيذ",
    stretchGoals: "أهداف إضافية",
  },
  en: {
    hide: "Hide implementation steps",
    show: "Implementation steps & stretch goals",
    implSteps: "Implementation steps",
    stretchGoals: "Stretch goals",
  },
} as const;

export default function ProjectsGrid() {
  const [filter, setFilter] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const locale = useLocale();
  const c = useCopy(COPY);

  const filtered = projects.filter((p) => filter === 0 || p.level === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            onClick={() => setFilter(l.level)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === l.level
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            <l.icon className="h-4 w-4" />
            {locale === "ar" ? l.ar : l.en}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((p) => {
          const open = openId === p.id;
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l ${LEVEL_COLORS[p.level]} px-3 py-1 text-xs font-bold text-ink-950`}
                      dir="rtl"
                    >
                      <RocketIcon className="h-3.5 w-3.5" />
                      {p.levelName}
                    </span>
                    <h3 className="mt-3 text-xl font-black text-white" dir="rtl">
                      {p.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 font-mono">
                      {p.titleEn}
                    </p>
                  </div>
                </div>
                <p
                  className="mt-4 text-sm text-slate-400 leading-7"
                  dir="rtl"
                >
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-400"
                      dir="rtl"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOpenId(open ? null : p.id)}
                className="flex w-full items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-6 py-4 text-sm font-bold text-slate-300 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
                aria-expanded={open}
              >
                {open ? c.hide : c.show}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="border-t border-white/5 px-6 py-5 space-y-5">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-3">
                      <Target className="h-4 w-4" />
                      {c.implSteps}
                    </h4>
                    <ol className="space-y-2.5">
                      {p.steps.map((s, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-slate-300 leading-6"
                          dir="rtl"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-300">
                            {i + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-amber-300 mb-3">
                      <StretchHorizontal className="h-4 w-4" />
                      {c.stretchGoals}
                    </h4>
                    <ul className="space-y-2">
                      {p.stretchGoals.map((g, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-400 leading-6"
                          dir="rtl"
                        >
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
