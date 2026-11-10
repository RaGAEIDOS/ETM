"use client";

import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  Lightbulb,
  ListChecks,
  BookMarked,
  PenLine,
} from "lucide-react";
import type { Course, Lesson, Stage } from "@/lib/types";
import { useProgress } from "@/lib/progress";
import Markdown from "./Markdown";
import Quiz from "./Quiz";
import LessonSidebar from "./LessonSidebar";
import LessonNav from "./LessonNav";
import CodeBlock from "./CodeBlock";

export default function LessonView({
  stage,
  course,
  lesson,
  prev,
  next,
  index,
}: {
  stage: Stage;
  course: Course;
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
  index: number;
}) {
  const { isDone, toggle } = useProgress();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6">
        <Link href="/curriculum" className="hover:text-cyan-300 transition-colors">
          Curriculum
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <Link
          href={`/learn/${stage.id}`}
          className="hover:text-cyan-300 transition-colors"
        >
          {stage.nameEn}
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <Link
          href={`/learn/${stage.id}/${course.id}`}
          className="hover:text-cyan-300 transition-colors"
        >
          {course.title}
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-slate-300">{lesson.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="order-2 lg:order-1">
          <LessonSidebar
            stageId={stage.id}
            course={course}
            currentLessonId={lesson.id}
            isDone={isDone}
          />
        </div>

        <article className="min-w-0 order-1 lg:order-2" dir="rtl">
          {/* Header */}
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full bg-gradient-to-l ${stage.color} px-3 py-1 text-xs font-bold text-ink-950`}
              >
                {stage.nameEn}
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
                Lesson {index + 1} of {course.lessons.length}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
              {lesson.title}
            </h1>
            <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">
              {lesson.titleEn}
            </p>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              {lesson.description}
            </p>
          </header>

          {/* Sections */}
          <div className="mt-8 space-y-6">
            {lesson.sections.map((section, i) => (
              <section
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-8"
              >
                {section.heading && (
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-black text-cyan-300">
                      {i + 1}
                    </span>
                    {section.heading}
                  </h2>
                )}
                <Markdown content={section.body} />
              </section>
            ))}
          </div>

          {/* Code examples (if not already in sections) */}
          {lesson.code && lesson.code.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <ListChecks className="h-5 w-5 text-cyan-400" />
                Code examples
              </h2>
              {lesson.code.map((c, i) => (
                <CodeBlock
                  key={i}
                  code={c.code}
                  language={c.language}
                  title={c.title}
                />
              ))}
            </div>
          )}

          {/* Terms */}
          {lesson.terms && lesson.terms.length > 0 && (
            <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-violet-300">
                <BookMarked className="h-5 w-5" />
                Lesson terms
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.terms.map((t) => (
                  <div
                    key={t.en}
                    className="rounded-xl border border-white/10 bg-ink-900/60 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300" dir="ltr">
                        {t.en}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-300 leading-6">{t.ar}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise */}
          {lesson.exercise && (
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
                <PenLine className="h-5 w-5" />
                Practice exercise
              </h2>
              <p className="mt-3 text-slate-200 leading-8">{lesson.exercise}</p>
              <Link
                href="/playground"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                Try the exercise in the playground
              </Link>
            </div>
          )}

          {/* Quiz */}
          {lesson.quiz.length > 0 && <Quiz questions={lesson.quiz} />}

          {/* Navigation */}
          <LessonNav
            stageId={stage.id}
            courseId={course.id}
            prev={prev}
            next={next}
            currentId={lesson.id}
            isDone={isDone}
            toggle={toggle}
          />
        </article>
      </div>
    </div>
  );
}
