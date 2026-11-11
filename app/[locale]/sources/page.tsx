import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Github, Heart, BookOpen } from "lucide-react";
import { stages } from "@/lib/data";
import { OSSU } from "@/lib/stages";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "All the sources and references ETM curriculum is built on — OSSU, CS50, MIT, Stanford, Nand2Tetris, and more.",
};

const MAIN_SOURCES = [
  {
    name: "OSSU — Open Source Society University",
    desc: "The core curriculum. A complete university education in computer science from accredited, free sources.",
    url: OSSU,
    badge: "Core",
  },
  {
    name: "CS50 — Harvard",
    desc: "The most famous introduction to computer science in the world, the source of inspiration for level one.",
    url: "https://cs50.harvard.edu/x/",
    badge: "Core",
  },
  {
    name: "MIT OpenCourseWare",
    desc: "MIT's open courses: algorithms, math for CS, computer architecture.",
    url: "https://ocw.mit.edu/",
    badge: "Core",
  },
  {
    name: "Nand2Tetris",
    desc: "Building a complete computer from a NAND gate to Tetris — the foundation of the architecture stage.",
    url: "https://www.nand2tetris.org/",
    badge: "Core",
  },
  {
    name: "OSTEP — Operating Systems: Three Easy Pieces",
    desc: "The most popular operating systems book in the world, free.",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    badge: "Reference",
  },
  {
    name: "Algorithms Illuminated — Tim Roughgarden",
    desc: "The most famous series on algorithm analysis and design.",
    url: "https://www.algorithmsilluminated.org/",
    badge: "Reference",
  },
  {
    name: "Crafting Interpreters",
    desc: "The reference for building interpreters and compilers — the basis of the compilers course.",
    url: "https://craftinginterpreters.com/",
    badge: "Reference",
  },
  {
    name: "OSDev Wiki",
    desc: "The most famous wiki for building operating systems from scratch.",
    url: "https://wiki.osdev.org/",
    badge: "Reference",
  },
  {
    name: "Learn C++",
    desc: "A comprehensive and practical reference for learning C++ from zero.",
    url: "https://www.learncpp.com/",
    badge: "Reference",
  },
  {
    name: "Game Engine Architecture — Jason Gregory",
    desc: "The reference for programming professional game engines.",
    url: "https://www.gameenginebook.com/",
    badge: "Reference",
  },
  {
    name: "Designing Data-Intensive Applications",
    desc: "The reference for distributed systems and databases.",
    url: "https://dataintensive.net/",
    badge: "Reference",
  },
  {
    name: "The Missing Semester — MIT",
    desc: "Developer tools: the command line, Git, and code editors.",
    url: "https://missing.csail.mit.edu/",
    badge: "Reference",
  },
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold text-cyan-400">Curriculum sources</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          Built on <span className="gradient-text">the strongest sources</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          The ETM curriculum is rooted in the{" "}
          <a
            href={OSSU}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            OSSU
          </a>{" "}
          curriculum, supported by sources from Harvard, MIT and Stanford — with
          a full Arabic rewrite and C++ applications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAIN_SOURCES.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                {s.badge}
              </span>
              <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="mt-3 font-bold text-white group-hover:text-cyan-300 transition-colors leading-7">
              {s.name}
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-6 flex-1">{s.desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-cyan-400" />
          Sources per stage
        </h2>
        <div className="space-y-8">
          {stages.map((stage) => (
            <div key={stage.id}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-cyan-300 mb-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full bg-gradient-to-l ${stage.color}`}
                />
                Level {stage.level}: {stage.nameEn}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {stage.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <h4 className="font-bold text-white text-sm">{course.title}</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.sources.map((s) => (
                        <a
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {s.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <Heart className="h-8 w-8 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white">Disclaimer</h2>
        <p className="mt-3 text-slate-400 leading-8 max-w-2xl mx-auto">
          The ETM educational content is originally written in Arabic, but the
          structure and methodology are inspired by the open sources above and
          mentioned by their authors&apos; names. Every source is linked to its
          official page, and we respect the intellectual property rights of each
          party.
        </p>
        <a
          href="https://github.com/ossu/computer-science/blob/master/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline"
        >
          <Github className="h-4 w-4" />
          OSSU license (MIT)
        </a>
      </div>
    </div>
  );
}
