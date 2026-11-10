"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { stageCompletion } from "@/lib/progress";
import { stages, totalLessons } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";
import {
  currentStreak,
  elzeroProgress,
  findNextLesson,
  focusMinutesToday,
  nextLessons,
} from "@/lib/stats";
import MikuAvatar from "./MikuAvatar";
import {
  BookOpen,
  Flame,
  Clock,
  PlayCircle,
  ArrowLeft,
  Sparkles,
  Target,
  CheckCircle2,
  Github,
  LayoutGrid,
} from "lucide-react";

export default function DashboardClient() {
  const { user, ready: authReady } = useAuth();
  const { map, ready } = useProgress();

  if (!ready || !authReady) {
    return <div className="p-10 text-center text-slate-400">Loading...</div>;
  }

  const total = totalLessons();
  const done = Object.keys(map).filter((k) => !k.startsWith("elzero-")).length;
  const elzero = elzeroProgress(map, elzeroVideos.length);
  const focusToday = focusMinutesToday();
  const streak = currentStreak();
  const next = findNextLesson(map, stages);
  const upcoming = nextLessons(map, stages, 6);
  const overall = total ? Math.round((done / total) * 100) : 0;

  const stats = [
    {
      icon: BookOpen,
      label: "Lessons completed",
      value: `${done}`,
      sub: `of ${total}`,
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: PlayCircle,
      label: "ElZero videos",
      value: `${elzero.done}`,
      sub: `of ${elzero.total} · ${elzero.percent}%`,
      color: "from-violet-400 to-fuchsia-500",
    },
    {
      icon: Clock,
      label: "Focus today",
      value: `${focusToday}`,
      sub: focusToday === 1 ? "minute" : "minutes",
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Flame,
      label: "Day streak",
      value: `${streak}`,
      sub: streak === 1 ? "day" : "days",
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
              Dashboard
            </h1>
            <p className="text-slate-400">
              {user ? `Welcome back, ${user.name} 👋` : "Welcome back 👋"} — here is
              your learning journey.
            </p>
          </div>
        </div>
        {!user && (
          <Link
            href="/login?next=/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2.5 text-sm font-bold text-ink-950"
          >
            <Github className="h-4 w-4" />
            Sign in with GitHub
          </Link>
        )}
      </div>

      {/* stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
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

      {/* overall progress */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Overall progress
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {done} of {total} lessons · {overall}% complete
            </p>
          </div>
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            <LayoutGrid className="h-4 w-4" /> Curriculum
          </Link>
        </div>
        <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 transition-all"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* continue learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
            <h2 className="font-black text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              Continue learning
            </h2>
            {next ? (
              <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] p-5">
                <div className="text-xs font-bold text-cyan-400">
                  {next.stage.name} · {next.courseTitle}
                </div>
                <h3 className="mt-2 text-lg font-black text-white">
                  {next.lesson.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-6 line-clamp-2">
                  {next.lesson.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/learn/${next.stage.id}/${next.courseId}/${next.lesson.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-bold text-ink-950"
                  >
                    Start lesson <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-slate-500">
                    {next.lesson.duration}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h3 className="mt-2 font-black text-white">
                  You finished the whole curriculum! 🎉
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Miku is proud of you. Check the projects page for your next
                  challenge.
                </p>
              </div>
            )}
          </div>

          {/* stages */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
            <h2 className="font-black text-white flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-cyan-400" />
              Progress by stage
            </h2>
            <div className="mt-4 space-y-4">
              {stages.map((stage) => {
                const c = stageCompletion(map, stage);
                return (
                  <Link
                    key={stage.id}
                    href={`/learn/${stage.id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {stage.name}
                        <span className="ms-2 text-xs font-medium text-slate-500" dir="ltr">
                          {stage.nameEn}
                        </span>
                      </span>
                      <span className="text-slate-400">
                        {c.done}/{c.total} · {c.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-l ${stage.color}`}
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* what's remaining */}
        <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
          <h2 className="font-black text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            What&apos;s remaining
          </h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nothing left — you did it all! 🏆
            </p>
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
                        {n.lesson.title}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {n.stage.name} · {n.courseTitle}
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
              Playground
            </Link>
            <Link
              href="/elzero"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
            >
              ElZero videos
            </Link>
            <Link
              href="/projects"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
            >
              Projects
            </Link>
            <Link
              href="/glossary"
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-bold text-white hover:bg-white/10"
            >
              Glossary
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
