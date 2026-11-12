"use client";

/**
 * «صدارة المتعلمين» — the ETM learners' front-runners board.
 *
 * Local-first by design (Phase 3 data architecture): every number here is
 * derived on this device from the learner's own progress store — XP, level,
 * streaks, per-track completion, a milestone ladder and the CS50x certificate
 * tracker. No fake learners are ever shown. A true global, competitive
 * leaderboard needs the account/sync backend decision (see the notice in the
 * "لوحة المنافسة العامة" card below) — until then this page shows YOUR real
 * standing honestly.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import { stages } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";
import { englishVideos } from "@/lib/english-videos";
import { CS50X_LECTURES, CS50X_PSETS } from "@/lib/cs50x";
import { loadCs50xCertificate } from "@/lib/cs50x-notes";
import Heatmap from "@/components/dash/Heatmap";
import {
  Trophy,
  Flame,
  Zap,
  Gauge,
  CalendarDays,
  CheckCircle2,
  Lock,
  GraduationCap,
  ChevronLeft,
  Crown,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";

const MILESTONES = [
  { xp: 0, ar: "مبتدئ", en: "Rookie" },
  { xp: 100, ar: "منتظم", en: "Regular" },
  { xp: 300, ar: "مثابر", en: "Persistent" },
  { xp: 600, ar: "متقدم", en: "Advanced" },
  { xp: 1000, ar: "خبير", en: "Expert" },
  { xp: 2000, ar: "سيّد", en: "Master" },
  { xp: 3500, ar: "أسطورة ETM", en: "ETM Legend" },
] as const;

const COPY = {
  ar: {
    eyebrow: "لوحة الصدارة",
    title: "«صدارة المتعلمين»",
    subtitle:
      "مكانك الحقيقي بين متعلمي ETM يبدأ من هنا — كل رقم في هذه الصفحة محسوب محليًا من تقدمك الفعلي، بلا أسماء وهمية وبلا تزييف.",
    todayXp: "خبرة هذا الأسبوع",
    todayEvents: "فعاليات هذا الأسبوع",
    minutes: "دقائق تركيز هذا الأسبوع",
    totalXp: "إجمالي الخبرة",
    level: "المستوى",
    currentStreak: "السلسلة الحالية",
    longestStreak: "أطول سلسلة",
    accuracy: "دقة الاختبارات",
    daysActive: "أيام نشطة",
    totalCompletions: "إكمالات",
    weeklyCompletion: "إنجازاتك هذا الأسبوع",
    tracks: "إكمال المسارات",
    cpp: "C++ والمنجز الرئيسي",
    elzero: "ElZero",
    english: "الإنجليزية",
    cs50x: "CS50x (Harvard)",
    milestones: "سلّم المراتب",
    milestonesHint: "كل مرتبة تفتح ببلوغ نقاط الخبرة المطلوبة — تُحفظ على جهازك.",
    unlocked: "مفتوحة",
    locked: "مقفلة",
    next: "التالي",
    globalTitle: "لوحة المنافسة العامة",
    globalBody:
      "المنافسة بين متعلمين حقيقيين تحتاج حسابات ومزامنة سحابية — وهذا قرار تقني وخصوصي لم يُحسم بعد في ETM (موثّق في وثائق المشروع ضمن «القرارات المطلوبة»). لا نعرض أسماء أو ترتيبًا مزيفًا: حين يصبح القرار، سترى هنا ترتيبك بين المتعلمين الحقيقيين.",
    globalPoints: [
      "الترتيب حسب نقاط الخبرة الأسبوعية ثم الإجمالية",
      "تصنيفات لكل مسار (C++ · ElZero · الإنجليزية · CS50x)",
      "لا مشاركة للبيانات الشخصية إلا بموافقة صريحة",
    ],
    cs50xCert: "شهادة CS50x",
    cs50xCertCta: "أكمل المسار وقدم طلب الشهادة",
    cs50xCertProgress: (done: number, total: number) => `${formatNumber(done)} من ${formatNumber(total)} تكاليف معتمدة`,
    perTrack: "منجز لكل مسار",
  },
  en: {
    eyebrow: "The front-runners board",
    title: "ETM Learners' Front-Runners",
    subtitle:
      "Your real place among ETM learners starts here — every number on this page is computed locally from your actual progress: no fake names, no fabricated ranks.",
    todayXp: "XP this week",
    todayEvents: "Events this week",
    minutes: "Focus minutes this week",
    totalXp: "Total XP",
    level: "Level",
    currentStreak: "Current streak",
    longestStreak: "Longest streak",
    accuracy: "Quiz accuracy",
    daysActive: "Active days",
    totalCompletions: "Completions",
    weeklyCompletion: "You this week",
    tracks: "Per-track completion",
    cpp: "C++ main track",
    elzero: "ElZero",
    english: "English",
    cs50x: "CS50x (Harvard)",
    milestones: "The milestone ladder",
    milestonesHint: "Each rank unlocks at its XP threshold — stored on your device.",
    unlocked: "Unlocked",
    locked: "Locked",
    next: "Next",
    globalTitle: "The global board",
    globalBody:
      "Real competition needs accounts and cloud sync — a product and privacy decision that is not final in ETM yet (documented in the repo under “Decisions needed”). We never show fake names or made-up ranks: when the decision lands, your ranking against real learners will appear here.",
    globalPoints: [
      "Ranked by weekly XP, then total XP",
      "Per-track leaderboards (C++ · ElZero · English · CS50x)",
      "No personal data shared without explicit consent",
    ],
    cs50xCert: "CS50x Certificate",
    cs50xCertCta: "Finish the path and claim the certificate",
    cs50xCertProgress: (done: number, total: number) => `${formatNumber(done)} of ${formatNumber(total)} qualifying assignments`,
    perTrack: "Per-track momentum",
  },
} as const;

function TrackBar({
  label,
  done,
  total,
}: {
  label: string;
  done: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-300">{label}</span>
        <span dir="ltr" className="font-mono text-slate-500">
          {formatNumber(done)}/{formatNumber(total)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-amber-400 via-rose-400 to-orange-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function LeaderboardClient() {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, stats, grid } = useProgressStore();
  const [certDone, setCertDone] = useState(0);

  useEffect(() => {
    setCertDone(loadCs50xCertificate().done.length);
    const listener = () => setCertDone(loadCs50xCertificate().done.length);
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const cppTotal = useMemo(
    () =>
      stages
        .flatMap((s) => s.courses)
        .reduce((sum, course) => sum + course.lessons.length, 0),
    []
  );
  const cppDone = stats.doneLessonIds.length;
  const elzeroDone = Math.min(stats.doneVideoIds.length, elzeroVideos.length);
  const englishDone = Math.min(stats.doneEnglishVideoIds.length, englishVideos.length);
  const cs50xDone = Math.min(stats.doneCs50xVideoIds.length, CS50X_LECTURES.length);
  const accuracy = stats.quiz.attempts > 0 ? Math.round(stats.quiz.accuracy) : 0;

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      {/* Hero */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-300">
          <Trophy className="h-4 w-4" />
          {c.eyebrow}
        </span>
        <h1 className="mt-5 flex items-center gap-3 text-4xl sm:text-6xl font-black text-white leading-tight">
          <Crown className="h-10 w-10 sm:h-14 sm:w-14 text-amber-400" aria-hidden="true" />
          {c.title}
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400 leading-8">{c.subtitle}</p>
      </div>

      {/* Weekly strip */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Zap, label: c.todayXp, value: formatNumber(stats.xpThisWeek), tone: "text-amber-300 border-amber-500/20" },
          { icon: CalendarDays, label: c.todayEvents, value: formatNumber(stats.eventsThisWeek), tone: "text-emerald-300 border-emerald-500/20" },
          { icon: Gauge, label: c.minutes, value: formatNumber(stats.minutesThisWeek), tone: "text-cyan-300 border-cyan-500/20" },
        ].map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className={`flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-4 ${tone}`}>
            <Icon className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-2xl font-black text-white leading-none" dir="ltr">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: c.totalXp, value: formatNumber(stats.xp), icon: Sparkles },
          { label: c.level, value: formatNumber(stats.level), icon: Gauge },
          { label: c.currentStreak, value: formatNumber(stats.currentStreak), icon: Flame },
          { label: c.longestStreak, value: formatNumber(stats.longestStreak), icon: Flame },
          { label: c.accuracy, value: stats.quiz.attempts > 0 ? `${formatNumber(accuracy)}%` : "—", icon: CheckCircle2 },
          { label: c.daysActive, value: formatNumber(stats.activityDays.length), icon: CalendarDays },
          { label: c.totalCompletions, value: formatNumber(stats.totalCompletions), icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-ink-900/60 p-4">
            <Icon className="h-5 w-5 text-slate-500" />
            <p className="mt-2 text-2xl font-black text-white" dir="ltr">{value}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Track completion + certificate */}
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 font-black text-white">
            <Gauge className="h-5 w-5 text-amber-400" />
            {c.tracks}
          </h2>
          <div className="mt-5 space-y-4">
            <TrackBar label={c.cpp} done={cppDone} total={cppTotal} />
            <TrackBar label={c.elzero} done={elzeroDone} total={elzeroVideos.length} />
            <TrackBar label={c.english} done={englishDone} total={englishVideos.length} />
            <TrackBar label={c.cs50x} done={cs50xDone} total={CS50X_LECTURES.length} />
          </div>
        </section>

        {/* CS50x certificate mini-tracker */}
        <Link
          href={localePath(locale, "/cs50x")}
          className="group flex flex-col rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/[0.08] to-orange-500/[0.06] p-6 transition-colors hover:border-rose-400/40 lg:col-span-2"
        >
          <h2 className="flex items-center gap-2 font-black text-white">
            <GraduationCap className="h-5 w-5 text-rose-400" />
            {c.cs50xCert}
          </h2>
          <p className="mt-4 text-3xl font-black text-white" dir="ltr">
            {formatNumber(certDone)}
            <span className="text-base font-bold text-slate-500"> / {formatNumber(CS50X_PSETS.length)}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{c.cs50xCertProgress(certDone, CS50X_PSETS.length)}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-rose-400 to-orange-400"
              style={{ width: `${Math.round((certDone / CS50X_PSETS.length) * 100)}%` }}
            />
          </div>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-rose-300 group-hover:text-rose-200">
            {c.cs50xCertCta}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:-translate-x-0.5" />
          </span>
        </Link>
      </div>

      {/* Activity heatmap */}
      <div className="mt-6">
        <Heatmap grid={grid} />
      </div>

      {/* Milestones ladder */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <h2 className="flex items-center gap-2 font-black text-white">
          <Shield className="h-5 w-5 text-amber-400" />
          {c.milestones}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{c.milestonesHint}</p>
        <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((m, i) => {
            const unlocked = stats.xp >= m.xp;
            const isNext =
              !unlocked && MILESTONES.slice(0, i).every((prev) => stats.xp >= prev.xp);
            return (
              <li
                key={m.xp}
                aria-current={isNext ? "step" : undefined}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  unlocked
                    ? "border-amber-500/30 bg-amber-500/[0.07]"
                    : isNext
                      ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                      : "border-white/5 bg-white/[0.02] opacity-60"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black ${
                    unlocked
                      ? "bg-amber-500/20 text-amber-300"
                      : isNext
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "bg-white/5 text-slate-600"
                  }`}
                >
                  {unlocked ? <Crown className="h-5 w-5" /> : formatNumber(i + 1)}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-black leading-5 ${unlocked ? "text-amber-200" : "text-slate-300"}`}>
                    {locale === "ar" ? m.ar : m.en}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-slate-500" dir="ltr">
                    {formatNumber(m.xp)} XP {isNext ? `· ${c.next}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The honest global board notice */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="flex items-center gap-3 text-xl font-black text-white">
          <Lock className="h-6 w-6 text-slate-500" />
          {c.globalTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{c.globalBody}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {c.globalPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-6 text-slate-400"
            >
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
