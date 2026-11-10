import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Rocket,
  Terminal,
  Brain,
  Trophy,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Target,
  Layers,
  Cpu,
  Gamepad2,
  Shield,
  Search,
  Play,
  GraduationCap,
  Github,
  LayoutDashboard,
  Timer,
  BookMarked,
  FlaskConical,
} from "lucide-react";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import { projects } from "@/lib/projects";
import { elzeroVideos } from "@/lib/elzero-videos";
import MikuAvatar from "@/components/MikuAvatar";
import Stat from "@/components/Stat";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "ETM — Education Technology Miku",
  description:
    "ETM (Education Technology Miku) — a free platform that teaches C++ from zero to building an operating system and a game engine. Full Arabic-origin content, interactive playground, real projects, Miku your study buddy.",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "A complete curriculum from zero",
    desc: "Based on the famous OSSU curriculum, rewritten with simplified Arabic explanations — from your first variable to an OS kernel.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Search,
    title: "Arabic explanations + glossary",
    desc: "Every English term is explained in Arabic and indexed in a dedicated glossary — no language barrier in your way.",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: Code2,
    title: "Interactive C++ playground",
    desc: "Write and run real C++ right in your browser, no installs. Try every example yourself and experiment freely.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Target,
    title: "Real projects",
    desc: "From a simple calculator to a Snake game with your own engine and an OS kernel that actually runs in QEMU.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Trophy,
    title: "Progress tracking",
    desc: "Know exactly where you are, how many lessons you finished, and what stage comes next — with Miku cheering you on.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Users,
    title: "A clear career path",
    desc: "Designed for the job market: skills actually in demand in systems programming and game engineering.",
    color: "from-sky-400 to-indigo-500",
  },
];

const HOW_IT_WORKS = [
  {
    icon: BookOpen,
    step: "1",
    title: "Learn the lesson",
    desc: "Clear explanations + real code examples + an interactive quiz so you can check that you understood.",
  },
  {
    icon: Code2,
    step: "2",
    title: "Practice in the playground",
    desc: "Copy an example or write your own, run it in the playground, and experiment by changing things yourself.",
  },
  {
    icon: Target,
    step: "3",
    title: "Build a project",
    desc: "Every course ends with a real project that brings everything together — the best way to make it stick.",
  },
];

const FAQS = [
  {
    q: "I have zero programming experience. Is this for me?",
    a: "Exactly. The curriculum starts from absolute zero: the first lesson teaches you to install the compiler, and the second one writes your first line of code. Level one is designed specifically for people who have never written code before.",
  },
  {
    q: "Why C++ and not something easier like Python?",
    a: "C++ is one of the most powerful — and demanding — languages, and that is exactly why it is valuable. When you understand C++ deeply, you understand how the computer actually works, and every other language becomes easy. It is also the core language of systems programming and game engines, and one of the most in-demand skills in the market.",
  },
  {
    q: "What is OSSU?",
    a: "OSSU (Open Source Society University) is a free, accredited curriculum that equals a full computer science degree, built from world-class sources (Harvard, MIT, Stanford). We took its structure and sources and rewrote everything in Arabic, with simplified explanations and C++ exercises.",
  },
  {
    q: "How much time do I need each week?",
    a: "If you can put in 10 hours a week, you can finish the first level in about two months. The full curriculum takes roughly one and a half to two years, like any degree. Consistency matters more than speed.",
  },
  {
    q: "Will I be able to work after finishing it?",
    a: "The final goal is to make you a software engineer who can actually work. The stage four projects (a game engine, an OS kernel, a compiler) are the strongest things you can add to your portfolio to open doors.",
  },
];

export default function LandingPage() {
  const lessonCount = totalLessons();
  const courseCount = totalCourses();
  const videoCount = elzeroVideos.length;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  The world-famous OSSU curriculum — explained in Arabic
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-6 text-[1.9rem] leading-[1.4] sm:text-5xl lg:text-6xl font-black text-white">
                  Learn programming from{" "}
                  <span className="gradient-text">zero</span>
                  <br />
                  to building an{" "}
                  <span className="gradient-text">operating system</span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-lg leading-9 text-slate-400 max-w-xl">
                  <strong className="text-white">ETM</strong> teaches you{" "}
                  <strong className="text-cyan-300">C++</strong> with a complete
                  university-level curriculum, clear explanations, interactive
                  examples, and real projects — from your first &quot;Hello
                  World&quot; to a game engine and an OS kernel that actually
                  runs.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/curriculum"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                  >
                    Start the journey — free
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <Play className="h-5 w-5 text-cyan-400" />
                    Try the C++ playground
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={350}>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/guide"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    <Terminal className="h-4 w-4" />
                    New here? Miku will show you around
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="animate-float">
                <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 shadow-2xl backdrop-blur">
                  <div className="flex items-center gap-4">
                    <MikuAvatar size={84} />
                    <div>
                      <div className="font-black text-white text-lg">Miku Chan</div>
                      <div className="text-sm text-slate-400">Your study buddy at ETM</div>
                      <div className="mt-2 text-xs text-emerald-400 font-bold">
                        Ready when you are — let&apos;s code! 🎵
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 leading-6">
                    <div className="font-bold text-cyan-400 mb-1">Today&apos;s mission</div>
                    <p>
                      Finish lesson <b className="text-white">&quot;Hello World&quot;</b> in
                      C++ Basics, then run it in the playground.
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">3</div>
                      <div className="text-[11px] text-slate-500">days streak</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">25m</div>
                      <div className="text-[11px] text-slate-500">focus time</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">78</div>
                      <div className="text-[11px] text-slate-500">ElZero videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat value={lessonCount} label="Interactive lessons" />
            <Stat value={courseCount} label="Complete courses" />
            <Stat value={projects.length} label="Real projects" />
            <Stat value={4} label="Difficulty levels" />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold text-cyan-400">Why ETM?</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
            A complete platform, not just videos
          </h2>
          <p className="mt-4 text-lg text-slate-400 leading-8">
            Everything you need to learn in one place: lessons, examples, a
            playground, projects, and progress tracking.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-ink-950 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-slate-400 leading-7">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">How you learn</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Learn with a proven method
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 120}>
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
                  <span className="absolute -top-4 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-ink-950">
                    {s.step}
                  </span>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-cyan-400">
                    <s.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-slate-400 leading-7">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-l from-cyan-500/15 via-ink-900 to-violet-500/15 p-10 sm:p-16 text-center">
            <div className="absolute -top-20 right-1/3 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />
            <div className="relative">
              <GraduationCap className="h-14 w-14 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Your journey to mastery starts with one step
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-8">
                One hour from now you could write your first line of code. From
                there, the sky is the limit.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-8 py-4 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                >
                  Start the first lesson — free
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Link
                  href="/elzero"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <Play className="h-5 w-5 text-cyan-400" />
                  Watch ElZero videos
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
