import type { Metadata } from "next";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Full Curriculum",
  description:
    "The complete ETM curriculum for learning C++ from zero to extreme difficulty — 4 levels, 17 courses, over 100 interactive lessons, based on OSSU.",
};

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-cyan-400">Full Curriculum</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white leading-tight">
            Your path from zero to <span className="gradient-text">mastery</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 leading-8">
            {totalCourses()} courses · {totalLessons()} interactive lessons · 4
            difficulty levels. Every lesson has a clear explanation, runnable
            examples, a quiz, and an exercise.
          </p>
        </div>
      </Reveal>

      <CurriculumAccordion stages={stages} />
    </div>
  );
}
