import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, GraduationCap } from "lucide-react";
import {
  englishCourses,
  englishVideosOfCourse,
  findEnglishCourse,
} from "@/lib/english-videos";
import EnglishCredit from "@/components/EnglishCredit";

export function generateStaticParams() {
  return englishCourses.map((c) => ({ course: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { course: string };
}): Promise<Metadata> {
  const course = findEnglishCourse(params.course);
  return { title: course?.title ?? "English course" };
}

export default function EnglishCoursePage({
  params,
}: {
  params: { course: string };
}) {
  const course = findEnglishCourse(params.course);
  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-black text-white">Course not found</h1>
        <p className="mt-2 text-slate-400">
          The English track is under construction — the course list will fill in
          Phase 1 once the playlists have been fetched.
        </p>
      </div>
    );
  }

  const videos = englishVideosOfCourse(course.id);

  const sectionsMap = new Map<string, typeof videos>();
  for (const v of videos) {
    const arr = sectionsMap.get(v.sectionEn) ?? [];
    arr.push(v);
    sectionsMap.set(v.sectionEn, arr);
  }
  const sections = Array.from(sectionsMap.keys());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      {/* Breadcrumb */}
      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6"
        dir="ltr"
      >
        <Link href="/english" className="hover:text-cyan-300 transition-colors">
          English
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-slate-300">{course.titleEn}</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-300">
          <GraduationCap className="h-4 w-4" />
          English track — powered by @ZAmericanEnglish
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          {course.titleEn}
        </h1>
        <p className="mt-2 text-sm text-slate-500" dir="rtl">
          {course.title}
        </p>
        <p className="mt-3 text-slate-400 leading-8">{course.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={course.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-emerald-400 to-cyan-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
          >
            Open playlist on YouTube
          </a>
          <Link
            href="/english"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            All English courses
          </Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-xl font-bold text-white">
            Phase 1 is on the way — this course is being prepared.
          </p>
          <p className="mt-3 text-slate-400">
            The videos, summaries, terms and quizzes will land here once the
            playlist metadata has been fetched for {course.playlistId}.
          </p>
          <a
            href={course.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            Watch it on YouTube in the meantime
          </a>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((sec) => {
            const vids = sectionsMap.get(sec)!;
            return (
              <section key={sec}>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{sec}</h2>
                  </div>
                  <span className="text-sm text-slate-400">
                    {vids.length} video{vids.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {vids.map((v) => (
                    <Link
                      key={v.id}
                      href={`/english/${course.id}/${v.id}`}
                      className="group rounded-2xl border border-white/10 bg-ink-900/60 p-5 hover:border-emerald-500/30 transition-all hover:-translate-y-0.5 block"
                    >
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-emerald-300">
                        #{v.id}
                      </span>
                      <h3
                        className="mt-3 font-black text-white leading-7 group-hover:text-emerald-300 transition-colors"
                        dir="rtl"
                      >
                        {v.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 font-mono" dir="ltr">
                        {v.titleEn}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 font-mono" dir="ltr">
                        {v.terms.length} terms · {v.quiz.length} questions
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <EnglishCredit />
    </div>
  );
}
