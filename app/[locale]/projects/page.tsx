import type { Metadata } from "next";
import { Target } from "lucide-react";
import ProjectsGrid from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real programming projects at graduated levels — from a simple calculator to a Snake game with your own engine and an operating system kernel.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
          <Target className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Real <span className="gradient-text">projects</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          Real learning happens when you build. Every project brings together the
          concepts you learned and turns them into something tangible you can be
          proud of.
        </p>
      </div>

      <ProjectsGrid />
    </div>
  );
}
