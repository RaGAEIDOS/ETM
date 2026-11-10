import type { Metadata } from "next";
import Link from "next/link";
import {
  PlayCircle,
  BookMarked,
  ListChecks,
  GraduationCap,
  Info,
  Mic,
  Volume2,
  MessagesSquare,
} from "lucide-react";
import { englishCourses, ETM_ENGLISH_CREDIT } from "@/lib/english-videos";

export const metadata: Metadata = {
  title: "English for Developers",
  description:
    "An English learning track built from the free @ZAmericanEnglish courses on YouTube — beginner course, grammar, phonetics, listening and conversation. Each video gets a summary, key terms and a quiz.",
};

const COURSE_ICONS: Record<string, typeof Mic> = {
  sprout: GraduationCap,
  graduation: GraduationCap,
  mic: Mic,
  volume: Volume2,
  messages: MessagesSquare,
};

function CreatorCredit() {
  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
      <Info className="h-6 w-6 text-cyan-400 mx-auto mb-3" />
      <h2 className="text-xl font-black text-white">Content by @zAmericanEnglish</h2>
      <p className="mt-2 text-sm text-slate-400 leading-7 max-w-2xl mx-auto">
        {ETM_ENGLISH_CREDIT}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        <a
          href="https://www.youtube.com/@ZAmericanEnglish"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10"
        >
          <GraduationCap className="h-4 w-4 text-cyan-400" />
          @ZAmericanEnglish
        </a>
      </div>
    </div>
  );
}

export default function EnglishPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-300">
          <GraduationCap className="h-4 w-4" />
          An English track for Arab developers
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          English with <span className="gradient-text">zAmericanEnglish</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">
          An English learning path powered by the{" "}
          <strong className="text-white">best-known Arabic channel</strong> on
          YouTube — each video paired with an{" "}
          <strong className="text-white">ETM summary</strong>,{" "}
          <strong className="text-white">key terms</strong>,{" "}
          <strong className="text-white">RTL explanations</strong> and{" "}
          <strong className="text-white">a quick quiz</strong>. Watch the free
          videos, come back here to review.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <a
            href="https://www.youtube.com/@ZAmericanEnglish"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-emerald-400 to-cyan-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
          >
            <PlayCircle className="h-5 w-5" />
            Open the channel
          </a>
          <a
            href="https://youtu.be/9cDYq1cun8o"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            How to study these courses
          </a>
        </div>
      </div>

      {/* Suggested path */}
      <div className="mb-12 rounded-2xl border border-cyan-500/15 bg-gradient-to-r from-cyan-500/10 to-violet-500/5 p-6 sm:p-8">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-cyan-400" />
          Suggested path
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Based on the channel&apos;s own guidance — start with the beginner course
          and one grammar lesson per day, in parallel build up to listening and
          conversation, then move on to phonetics and level-2 courses.
        </p>
        <ol className="mt-4 flex flex-wrap gap-2">
          {[
            ["1", "Beginner course (English from zero)"],
            ["2", "Grammar — one lesson per day"],
            ["3", "Listening & conversation"],
            ["4", "Phonetics"],
            ["5", "Reading & level-2 courses"],
          ].map(([n, label]) => (
            <li
              key={n}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                {n}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </div>

      {/* Course cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {englishCourses.map((course) => {
          const Icon = COURSE_ICONS[course.icon] ?? GraduationCap;
          return (
            <Link
              key={course.id}
              href={`/english/${course.id}`}
              className="group rounded-2xl border border-white/10 bg-ink-900/60 p-6 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5 block"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-500">
                  YouTube playlist
                </span>
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <h3 className="mt-3 text-xl font-black text-white leading-7 group-hover:text-cyan-300 transition-colors">
                {course.titleEn}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                {course.title}
              </p>
              <p className="mt-3 text-sm text-slate-400 leading-7 line-clamp-3">
                {course.description}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                  Open playlist
                </span>
                <span className="text-xs text-slate-500">
                  {course.videoCount > 0 ? `${course.videoCount} videos` : "loading…"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 leading-6">
        Videos&apos; data comes from the @ZAmericanEnglish playlists — the first
        batch will appear in Phase 1. Run <code className="text-slate-400">scripts/fetch-playlists.mjs</code> to
        produce the raw metadata, then we generate summaries and quizzes here.
      </p>

      <CreatorCredit />
    </div>
  );
}
