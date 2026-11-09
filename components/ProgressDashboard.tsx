"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Trophy,
  Flame,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  Layers,
  Sparkles,
  Cpu,
  Rocket,
} from "lucide-react";
import { stages } from "@/lib/data";
import { useProgress, stageCompletion } from "@/lib/progress";

const LEVEL_ICONS = [Sparkles, Layers, Cpu, Rocket];

export default function ProgressDashboard() {
  const { map, ready, reset, isDone } = useProgress();

  const overall = useMemo(() => {
    const all = stages.flatMap((s) => s.courses.flatMap((c) => c.lessons));
    const done = all.filter((l) => map[l.id]).length;
    return {
      done,
      total: all.length,
      percent: all.length ? Math.round((done / all.length) * 100) : 0,
    };
  }, [map]);

  const completedLessons = useMemo(() => {
    const list: {
      stageName: string;
      courseTitle: string;
      title: string;
      id: string;
      stageId: string;
      courseId: string;
    }[] = [];
    stages.forEach((s) =>
      s.courses.forEach((c) =>
        c.lessons.forEach((l) => {
          if (map[l.id]) {
            list.push({
              stageName: s.name,
              courseTitle: c.title,
              title: l.title,
              id: l.id,
              stageId: s.id,
              courseId: c.id,
            });
          }
        })
      )
    );
    return list;
  }, [map]);

  if (!ready) {
    return (
      <div className="py-20 text-center text-slate-400">جارٍ تحميل تقدمك...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-l from-cyan-500/10 to-violet-500/10 p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative h-28 w-28">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - overall.percent / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white tabular-nums">
                {overall.percent}%
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">تقدمك الكلي</h2>
              <p className="mt-1 text-slate-400">
                أنهيت {overall.done} من {overall.total} درس
              </p>
              {overall.done > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-amber-300">
                  <Flame className="h-4 w-4" />
                  استمر! كل درس بيقربك من الاحتراف
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            {overall.done === 0 ? (
              <Link
                href="/curriculum"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
              >
                ابدأ أول درس
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm("هل أنت متأكد من رغبتك في تصفير تقدمك؟")) reset();
                }}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                تصفير التقدم
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Per stage */}
      <div className="grid gap-5 md:grid-cols-2">
        {stages.map((stage, i) => {
          const comp = stageCompletion(map, stage);
          const Icon = LEVEL_ICONS[i] ?? Layers;
          return (
            <div
              key={stage.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stage.color} text-ink-950`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{stage.name}</h3>
                  <p className="text-xs text-slate-500">
                    {comp.done} من {comp.total} درس
                  </p>
                </div>
                <span className="text-lg font-black text-cyan-300 tabular-nums">
                  {comp.percent}%
                </span>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all duration-700"
                  style={{ width: `${comp.percent}%` }}
                />
              </div>
              <Link
                href={`/learn/${stage.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                متابعة التعلم
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Completed lessons */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <Trophy className="h-5 w-5 text-amber-400" />
          الدروس المكتملة ({completedLessons.length})
        </h3>
        {completedLessons.length === 0 ? (
          <p className="mt-4 text-slate-400 leading-7">
            لسه ما أكملت أي درس. ابدأ من{" "}
            <Link href="/curriculum" className="text-cyan-400 hover:underline">
              المنهج
            </Link>{" "}
            وأول درس هيبان هنا.
          </p>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {completedLessons.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.stageId}/${l.courseId}/${l.id}`}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 hover:border-cyan-500/30 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm text-white">{l.title}</span>
                  <span className="block text-xs text-slate-500">
                    {l.stageName} · {l.courseTitle}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
