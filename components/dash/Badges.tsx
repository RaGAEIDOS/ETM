"use client";

import { useCopy } from "@/lib/i18n/context";
import type { DerivedProgress } from "@/lib/progress/core";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Flame,
  Zap,
  Trophy,
  Hourglass,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COPY = {
  ar: {
    title: "الإنجازات",
    unlocked: "مكتسبة",
    locked: "مقفلة",
    items: {
      first: { name: "الخطوة الأولى", desc: "أكمل درسًا واحدًا" },
      ten: { name: "على الطريق", desc: "أكمل 10 عناصر" },
      videos5: { name: "مشاهد محترف", desc: "أكمل 5 فيديوهات ElZero" },
      streak7: { name: "أسبوع كامل", desc: "سلسلة نشاط 7 أيام" },
      streak30: { name: "شهر لا يُقهر", desc: "سلسلة نشاط 30 يومًا" },
      xp100: { name: "جامع الخبرة", desc: "اجمع 100 نقطة خبرة" },
      quizMaster: { name: "العبقري", desc: "دقة 80%+ في 20 سؤالًا على الأقل" },
      focus60: { name: "ساعة تركيز", desc: "60 دقيقة تركيز تراكمية" },
    },
  },
  en: {
    title: "Achievements",
    unlocked: "Unlocked",
    locked: "Locked",
    items: {
      first: { name: "First step", desc: "Complete one lesson" },
      ten: { name: "On the way", desc: "Complete 10 items" },
      videos5: { name: "Seasoned watcher", desc: "Complete 5 ElZero videos" },
      streak7: { name: "Full week", desc: "7-day activity streak" },
      streak30: { name: "Unstoppable month", desc: "30-day activity streak" },
      xp100: { name: "XP collector", desc: "Earn 100 XP" },
      quizMaster: { name: "Quiz master", desc: "80%+ accuracy on 20+ answers" },
      focus60: { name: "Focus hour", desc: "60 cumulative focus minutes" },
    },
  },
} as const;

type BadgeKey = keyof (typeof COPY)["ar"]["items"];

export default function Badges({ stats }: { stats: DerivedProgress }) {
  const c = useCopy(COPY);

  const defs: { key: BadgeKey; icon: LucideIcon; earned: boolean }[] = [
    { key: "first", icon: BookOpen, earned: stats.totalCompletions >= 1 },
    { key: "ten", icon: Layers, earned: stats.totalCompletions >= 10 },
    { key: "videos5", icon: PlayCircle, earned: stats.doneVideoIds.length >= 5 },
    { key: "streak7", icon: Flame, earned: stats.longestStreak >= 7 },
    { key: "streak30", icon: Flame, earned: stats.longestStreak >= 30 },
    { key: "xp100", icon: Zap, earned: stats.xp >= 100 },
    {
      key: "quizMaster",
      icon: Trophy,
      earned: stats.quiz.total >= 20 && stats.quiz.accuracy >= 80,
    },
    { key: "focus60", icon: Hourglass, earned: stats.totalFocusMinutes >= 60 },
  ];

  const earned = defs.filter((d) => d.earned).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-black text-white">{c.title}</h2>
        <span className="text-xs font-bold text-slate-500">
          {earned} / {defs.length}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {defs.map(({ key, icon: Icon, earned: ok }) => {
          const t = c.items[key];
          return (
            <div
              key={key}
              title={`${t.name} — ${t.desc}`}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                ok
                  ? "border-amber-500/30 bg-amber-500/[0.07]"
                  : "border-white/5 bg-white/[0.02] opacity-40"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${ok ? "text-amber-300" : "text-slate-500"}`}
              />
              <span
                className={`text-[11px] font-bold leading-4 ${
                  ok ? "text-amber-200" : "text-slate-500"
                }`}
              >
                {t.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
