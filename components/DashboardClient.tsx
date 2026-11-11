"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useAuth } from "@/lib/auth";
import { stageCompletion } from "@/lib/progress";
import { useProgressStore } from "@/lib/progress/store";
import { stages, totalLessons } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";
import { nextLessons } from "@/lib/stats";
import MikuAvatar from "./MikuAvatar";
import ResumeCard from "./ResumeCard";
import Heatmap from "./dash/Heatmap";
import AccuracyTrend from "./dash/AccuracyTrend";
import WeakTopics from "./dash/WeakTopics";
import Badges from "./dash/Badges";
import GoalAndData from "./dash/GoalAndData";
import {
  BookOpen,
  Flame,
  Clock,
  PlayCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Github,
  LayoutGrid,
  Zap,
  Trophy,
  ClipboardList,
} from "lucide-react";

const COPY = {
  ar: {
    loading: "جارٍ التحميل...",
    title: "لوحة التحكم",
    welcomeUserBefore: "أهلًا بعودتك، ",
    welcomeUserAfter: " 👋 — هذه رحلة تعلّمك.",
    welcomeGuest: "أهلًا بعودتك 👋 — هذه رحلة تعلّمك.",
    signInGithub: "الدخول بحساب GitHub",
    lessonsCompleted: "الدروس المكتملة",
    of: "من",
    elzeroVideos: "فيديوهات ElZero",
    focusToday: "تركيز اليوم",
    minute: "دقيقة",
    minutes: "دقيقة",
    dayStreak: "سلسلة الأيام",
    day: "يوم",
    days: "أيام",
    best: "الأفضل",
    overallProgress: "التقدم الإجمالي",
    overallPrefix: "أكملت",
    overallLessons: "درسًا",
    overallComplete: "مكتمل",
    curriculum: "المنهج",
    continueLearning: "تابع التعلم",
    finishedTitle: "أنهيت المنهج بالكامل! 🎉",
    finishedBody: "Miku فخورة بك. تفقّد صفحة المشاريع لتحديك التالي.",
    progressByStage: "التقدم حسب المستوى",
    whatsRemaining: "ما تبقّى",
    nothingLeft: "لا شيء متبقٍ — أنجزت كل شيء! 🏆",
    playground: "المحرر",
    projects: "المشاريع",
    glossary: "المصطلحات",
    weekSummary: "هذا الأسبوع",
    activities: "نشاط",
    xpShort: "XP",
    level: "المستوى",
    xpToNext: "نقطة للترقية",
    xpThisWeek: "XP هذا الأسبوع",
    quizAccuracy: "دقة الاختبارات",
    attempts: "محاولة",
    answered: "سؤال أُجيب",
    reviewDue: "للمراجعة",
    reviewDueBody: "أسئلة من آخر محاولة خاطئة — راجعها ثم أعد المحاولة.",
    reviewCta: "راجع الآن",
  },
  en: {
    loading: "Loading...",
    title: "Dashboard",
    welcomeUserBefore: "Welcome back, ",
    welcomeUserAfter: " 👋 — here is your learning journey.",
    welcomeGuest: "Welcome back 👋 — here is your learning journey.",
    signInGithub: "Sign in with GitHub",
    lessonsCompleted: "Lessons completed",
    of: "of",
    elzeroVideos: "ElZero videos",
    focusToday: "Focus today",
    minute: "minute",
    minutes: "minutes",
    dayStreak: "Day streak",
    day: "day",
    days: "days",
    best: "Best",
    overallProgress: "Overall progress",
    overallPrefix: "You completed",
    overallLessons: "lessons",
    overallComplete: "complete",
    curriculum: "Curriculum",
    continueLearning: "Continue learning",
    finishedTitle: "You finished the whole curriculum! 🎉",
    finishedBody: "Miku is proud of you. Check the projects page for your next challenge.",
    progressByStage: "Progress by stage",
    whatsRemaining: "What's remaining",
    nothingLeft: "Nothing left — you did it all! 🏆",
    playground: "Playground",
    projects: "Projects",
    glossary: "Glossary",
    weekSummary: "This week",
    activities: "activities",
    xpShort: "XP",
    level: "Level",
    xpToNext: "XP to level up",
    xpThisWeek: "XP this week",
    quizAccuracy: "Quiz accuracy",
    attempts: "attempts",
    answered: "questions answered",
    reviewDue: "To review",
    reviewDueBody: "Questions missed in your latest attempt — review, then retry.",
    reviewCta: "Review now",
  },
} as const;

export default function DashboardClient() {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const { user, ready: authReady } = useAuth();
  const { ready, stats, grid, trend, todayKey } = useProgressStore();

  if (!ready || !authReady) {
    return <div className="p-10 text-center text-slate-400">{c.loading}</div>;
  }

  const map = { ...stats.map };
  const total = totalLessons();
  const done = stats.doneLessonIds.length;
  const videosDone = stats.doneVideoIds.length;
  const videoPercent = elzeroVideos.length
    ? Math.round((videosDone / elzeroVideos.length) * 100)
    : 0;
  const focusToday = stats.minutesByDay[todayKey] ?? 0;
  const streak = stats.currentStreak;
  const overall = total ? Math.round((done / total) * 100) : 0;
  const upcoming = nextLessons(map, stages, 6);
  const xpInLevel = stats.xp % 100;

  const cards = [
    {
      icon: BookOpen,
      label: c.lessonsCompleted,
      value: formatNumber(done),
      sub: `${c.of} ${formatNumber(total)}`,
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: PlayCircle,
      label: c.elzeroVideos,
      value: formatNumber(videosDone),
      sub: `${c.of} ${formatNumber(elzeroVideos.length)} · ${formatNumber(videoPercent)}%`,
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      icon: Clock,
      label: c.focusToday,
      value: formatNumber(focusToday),
      sub: c.minutes,
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Flame,
      label: c.dayStreak,
      value: formatNumber(streak),
      sub: `${streak === 1 ? c.day : c.days} · ${c.best} ${formatNumber(stats.longestStreak)}`,
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MikuAvatar size={52} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {c.title}
            </h1>
            <p className="text-slate-400">
              {user ? (
                <>
                  {c.welcomeUserBefore}
                  {user.name}
                  {c.welcomeUserAfter}
                </>
              ) : (
                c.welcomeGuest
              )}
            </p>
          </div>
        </div>
        {!user && (
          <Link
            href="/login?next=/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2.5 text-sm font-bold text-ink-950"
          >
            <Github className="h-4 w-4" />
            {c.signInGithub}
          </Link>
        )}
      </div>

      {/* primary stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-ink-900/60 p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-ink-950`}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
            <div className="mt-3 text-3xl font-black text-white">
              {s.value}{" "}
              <span className="text-sm font-medium text-slate-500">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* level / quiz / review */}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-ink-950">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs text-slate-400">{c.level}</div>
              <div className="text-2xl font-black text-white">
                {formatNumber(stats.level)}
                <span className="ms-2 text-xs font-medium text-slate-500 align-middle">
                  {formatNumber(stats.xp)} {c.xpShort} · {formatNumber(stats.xpThisWeek)}{" "}
                  {c.xpThisWeek}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-amber-400 to-yellow-500 transition-all"
              style={{ width: `${xpInLevel}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            {formatNumber(100 - xpInLevel)} {c.xpToNext}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-ink-950">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs text-slate-400">{c.quizAccuracy}</div>
              <div className="text-2xl font-black text-white">
                {formatNumber(stats.quiz.accuracy)}%
                <span className="ms-2 text-xs font-medium text-slate-500 align-middle">
                  {formatNumber(stats.quiz.correct)}/{formatNumber(stats.quiz.total)}{" "}
                  {c.answered}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            {formatNumber(stats.quiz.attempts)} {c.attempts}
          </p>
        </div>

        <Link
          href="/curriculum"
          className="group rounded-2xl border border-white/10 bg-ink-900/60 p-5 hover:border-amber-500/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-ink-950">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs text-slate-400">{c.reviewDue}</div>
              <div className="text-2xl font-black text-white">
                {formatNumber(stats.reviewDue)}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-500">{c.reviewDueBody}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-amber-200">
            {c.reviewCta}
            <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" />
          </span>
        </Link>
      </div>

      {/* overall + weekly */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              {c.overallProgress}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {c.overallPrefix} {formatNumber(done)} {c.of} {formatNumber(total)}{" "}
              {c.overallLessons} · {formatNumber(overall)}% {c.overallComplete}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {c.weekSummary}: {formatNumber(stats.eventsThisWeek)} {c.activities} ·{" "}
              {formatNumber(stats.minutesThisWeek)} {c.minutes} ·{" "}
              {formatNumber(stats.xpThisWeek)} {c.xpShort}
            </p>
          </div>
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            <LayoutGrid className="h-4 w-4" /> {c.curriculum}
          </Link>
        </div>
        <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* resume */}
      <div className="mt-6">
        <ResumeCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Heatmap grid={grid} />
          <AccuracyTrend trend={trend} />

          {/* stages */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
            <h2 className="font-black text-white flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-cyan-400" />
              {c.progressByStage}
            </h2>
            <div className="mt-4 space-y-4">
              {stages.map((stage) => {
                const comp = stageCompletion(map, stage);
                return (
                  <Link
                    key={stage.id}
                    href={`/learn/${stage.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {locale === "en" ? stage.nameEn : stage.name}
                        <span
                          className="ms-2 text-xs font-medium text-slate-500"
                          dir={locale === "en" ? "rtl" : "ltr"}
                        >
                          {locale === "en" ? stage.name : stage.nameEn}
                        </span>
                      </span>
                      <span className="text-slate-400">
                        {formatNumber(comp.done)}/{formatNumber(comp.total)} ·{" "}
                        {formatNumber(comp.percent)}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-l ${stage.color}`}
                        style={{ width: `${comp.percent}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* what's remaining + weak topics */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
            <h2 className="font-black text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              {c.whatsRemaining}
            </h2>
            {upcoming.length === 0 ? (
              <div className="mt-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <p className="mt-2 text-sm text-slate-400">{c.nothingLeft}</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {upcoming.map((n) => (
                  <li key={n.lesson.id}>
                    <Link
                      href={`/learn/${n.stage.id}/${n.courseId}/${n.lesson.id}`}
                      className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-400">
                        <BookOpen className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {isAr ? n.lesson.title : n.lesson.titleEn}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {isAr ? n.stage.name : n.stage.nameEn} ·{" "}
                          {isAr ? n.courseTitle : n.courseTitleEn}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link
                href="/playground"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
              >
                {c.playground}
              </Link>
              <Link
                href="/elzero"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
              >
                {c.elzeroVideos}
              </Link>
              <Link
                href="/projects"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
              >
                {c.projects}
              </Link>
              <Link
                href="/glossary"
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
              >
                {c.glossary}
              </Link>
            </div>
          </div>

          <WeakTopics weakTopics={stats.weakTopics} />
        </div>
      </div>

      <div className="mt-6">
        <Badges stats={stats} />
      </div>

      <div className="mt-6">
        <GoalAndData />
      </div>
    </div>
  );
}