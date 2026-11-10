"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlayCircle,
  ChevronLeft,
  BookMarked,
  CheckCircle2,
  PenLine,
  Volume2,
} from "lucide-react";
import {
  findEnglishCourse,
  englishVideosOfCourse,
  findEnglishVideo,
} from "@/lib/english-videos";
import Quiz from "@/components/Quiz";
import EnglishCredit from "@/components/EnglishCredit";
import {
  englishVideoCompletion,
  isEnglishDone,
  saveEnglishProgress,
  loadProgress,
} from "@/lib/progress";

export default function EnglishVideoPage({
  params,
}: {
  params: { course: string; video: string };
}) {
  // hooks declared before any early return — React requires stable call order
  const [done, setDoneState] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, percent: 0 });

  const course = findEnglishCourse(params.course);
  const v = findEnglishVideo(params.video);

  useEffect(() => {
    if (!course || !v) return;
    setDoneState(isEnglishDone(course.id, v.id));
    const total = englishVideosOfCourse(course.id).length;
    const map = loadProgress();
    setProgress(englishVideoCompletion(map, course.id, total));
  }, [course, v]);

  if (!course || !v) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-black text-white">Video not found</h1>
        <p className="mt-3 text-slate-400">
          Videos for this course have not been fetched yet — Phase 1 will populate them.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/english"
            className="rounded-xl bg-gradient-to-l from-emerald-400 to-cyan-500 px-6 py-3 font-bold text-ink-950"
          >
            Back to English
          </Link>
          {course && (
            <a
              href={course.playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Open the playlist
            </a>
          )}
        </div>
        <EnglishCredit />
      </div>
    );
  }

  const toggleDone = () => {
    const next = !done;
    saveEnglishProgress(course.id, v.id, next);
    setDoneState(next);
    const total = englishVideosOfCourse(course.id).length;
    setProgress(englishVideoCompletion(loadProgress(), course.id, total));
  };

  const courseVideos = englishVideosOfCourse(course.id);
  const idx = courseVideos.findIndex((x) => x.id === v.id);
  const prev = idx > 0 ? courseVideos[idx - 1] : null;
  const next = idx >= 0 && idx < courseVideos.length - 1 ? courseVideos[idx + 1] : null;

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10" dir="rtl">
      {/* breadcrumb */}
      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6"
        dir="ltr"
      >
        <Link href="/english" className="hover:text-cyan-300 transition-colors">
          English
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <Link href={`/english/${course.id}`} className="hover:text-cyan-300 transition-colors">
          {course.titleEn}
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-slate-300">Video #{v.id}</span>
      </nav>

      {/* header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gradient-to-l from-emerald-400 to-cyan-500 px-3 py-1 text-xs font-bold text-ink-950">
            {course.titleEn}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400 font-mono">
            Video #{v.id}
          </span>
          <button
            onClick={toggleDone}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              done
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-white/15 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {done ? "Completed" : "Mark as completed"}
          </button>
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
          {v.title}
        </h1>
        <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">
          {v.titleEn}
        </p>

        <a
          href={v.youtube}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-emerald-400 to-cyan-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
        >
          <PlayCircle className="h-5 w-5" />
          Watch on YouTube
        </a>
      </header>

      {/* Summary */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-black text-emerald-300">
            1
          </span>
          Video summary
        </h2>
        <p className="text-slate-300 leading-8">{v.summary}</p>
        <p className="mt-4 text-xs text-slate-500 leading-6">
          {v.reviewed
            ? "Reviewed against the original captions/description — everything here is our own summary."
            : "Conservative summary: our best reading from title + description. Mark reviewed after you finish the video."}
        </p>
      </section>

      {/* Key terms with speaker buttons */}
      <section className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-violet-300">
          <BookMarked className="h-5 w-5" />
          Key terms in this video
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {v.terms.map((t) => (
            <div key={t.en} className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-cyan-300" dir="ltr">
                  {t.en}
                </span>
                <button
                  type="button"
                  onClick={() => speak(t.en)}
                  aria-label={`Speak ${t.en}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-sm text-slate-300 leading-6" dir="rtl">
                {t.ar}
              </p>
              {t.example && (
                <div className="mt-2 rounded-lg bg-white/[0.03] border border-white/5 p-2.5 text-xs text-slate-400 leading-6" dir="ltr">
                  {t.example.en}
                  <span className="block text-slate-500" dir="rtl">
                    {t.example.ar}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick exercise */}
      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
          <PenLine className="h-5 w-5" />
          Quick practice
        </h2>
        <p className="mt-3 text-slate-200 leading-8">
          Open the video, track along with the key terms above, say every term out loud (use the speaker buttons if your pronunciation is shaky), then answer the quiz. If you pass first try, move to the next video.
        </p>
      </section>

      {/* Quiz */}
      <div className="mt-8">
        <Quiz questions={v.quiz} />
      </div>

      {/* Progress summary for this course */}
      <div className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="text-sm text-slate-400">
          Course progress:{" "}
          <span className="font-bold text-white">
            {progress.done} of {progress.total}
          </span>{" "}
          <span className="text-emerald-400">({progress.percent}%)</span>
        </span>
        <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden max-w-[240px]">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-cyan-500 transition-all duration-700"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Previous / next */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/english/${course.id}/${prev.id}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors text-right"
          >
            <span className="text-xs text-slate-400">Previous video</span>
            <span className="mt-1 block font-bold text-white" dir="rtl">
              #{prev.id} — {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/english/${course.id}/${next.id}`}
            className="group rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 hover:bg-emerald-500/[0.12] transition-colors text-right"
          >
            <span className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
              <CheckCircle2 className="h-3 w-3" />
              Next video
            </span>
            <span className="mt-1 block font-bold text-white" dir="rtl">
              #{next.id} — {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/english/${course.id}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors text-right"
          >
            <span className="text-xs text-slate-400">Series ended</span>
            <span className="mt-1 block font-bold text-white">
              Back to the video list
            </span>
          </Link>
        )}
      </div>

      <EnglishCredit />
    </div>
  );
}


