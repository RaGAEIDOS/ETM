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
} from "lucide-react";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import { projects } from "@/lib/projects";
import HeroTerminal from "@/components/HeroTerminal";
import Stat from "@/components/Stat";
import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    icon: BookOpen,
    title: "A complete curriculum from zero",
    desc: "A full university-level curriculum based on OSSU, rewritten in Arabic — from your first variable to an operating system kernel.",
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

const LEVEL_ICONS = [Sparkles, Layers, Cpu, Rocket];

const WHY_CPP = [
  {
    icon: Zap,
    title: "Speed & performance",
    desc: "C++ is one of the fastest languages in the world — used wherever performance matters.",
  },
  {
    icon: Gamepad2,
    title: "Game engines",
    desc: "Unreal Engine and the major game engines are built with C++.",
  },
  {
    icon: Cpu,
    title: "Operating systems",
    desc: "Windows, Linux and macOS all contain millions of lines of C++.",
  },
  {
    icon: Shield,
    title: "Memory control",
    desc: "C++ gives you full control over hardware and memory — real power.",
  },
];

const SOURCES = [
  {
    name: "OSSU",
    desc: "The core curriculum — a complete free university education",
    url: "https://github.com/ossu/computer-science",
  },
  {
    name: "CS50 — Harvard",
    desc: "The most famous introduction to computer science in the world",
    url: "https://cs50.harvard.edu/x/",
  },
  {
    name: "MIT OpenCourseWare",
    desc: "MIT's open courses: algorithms, math, architecture",
    url: "https://ocw.mit.edu/",
  },
  {
    name: "Nand2Tetris",
    desc: "Build a complete computer from a single NAND gate",
    url: "https://www.nand2tetris.org/",
  },
  {
    name: "OSTEP",
    desc: "The most popular operating systems book — completely free",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
  },
  {
    name: "Learn C++",
    desc: "A comprehensive reference for learning the language from zero",
    url: "https://www.learncpp.com/",
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

export default function HomePage() {
  const lessonCount = totalLessons();
  const courseCount = totalCourses();

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
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <Timer className="h-4 w-4 text-emerald-400" />
                    Pomodoro focus
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2 space-x-reverse">
                    {["Ahmed", "Sara", "Mahmoud", "Nour"].map((n) => (
                      <span
                        key={n}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-950 bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-xs font-bold text-white"
                      >
                        {n[0]}
                      </span>
                    ))}
                  </div>
                  <span>
                    Join thousands of Arabic learners —{" "}
                    <span className="text-white font-semibold">free forever</span>
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="animate-float">
                <HeroTerminal />
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
        <Reveal>
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
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-ink-950 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-slate-400 leading-7">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ LEVELS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-sm font-bold text-cyan-400">Learning path</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                4 levels: from Very Easy to Extreme
              </h2>
              <p className="mt-4 text-lg text-slate-400 leading-8">
                A carefully gradual path. Every level builds on the one before
                it, and every lesson brings you one step closer to mastery.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, i) => {
              const Icon = LEVEL_ICONS[i] ?? Layers;
              const lessonCountStage = stage.courses.reduce(
                (s, c) => s + c.lessons.length,
                0
              );
              return (
                <Reveal key={stage.id} delay={i * 100}>
                  <Link
                    href={`/learn/${stage.id}`}
                    className="group block h-full rounded-2xl border border-white/10 bg-ink-900/60 p-6 hover:border-white/25 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stage.color} text-ink-950 shadow-lg`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-white/5 rounded-full px-3 py-1">
                        Level {stage.level}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black text-white">
                      {stage.nameEn}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-cyan-300">
                      {stage.name}
                    </p>
                    <p className="mt-3 text-sm text-slate-400 leading-6 line-clamp-3">
                      {stage.tagline}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {stage.courses.length} courses · {lessonCountStage} lessons
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:gap-2 transition-all">
                        Start
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">How you learn</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Learn with a proven method
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
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
          ].map((s, i) => (
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
      </section>

      {/* ============ WHY C++ ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="text-sm font-bold text-cyan-400">Why C++?</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
                  The language that opens the door to{" "}
                  <span className="gradient-text">systems engineering</span>
                </h2>
                <p className="mt-4 text-lg text-slate-400 leading-8">
                  C++ is not just a programming language — it is the tool the
                  world&apos;s biggest companies use to build the strongest
                  systems. When you learn it, you learn how the computer really
                  works.
                </p>
                <Link
                  href="/curriculum"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Start with level one
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {WHY_CPP.map((w, i) => (
                <Reveal key={w.title} delay={i * 80}>
                  <div className="rounded-xl border border-white/10 bg-ink-900/60 p-5 hover:border-cyan-500/30 transition-colors">
                    <w.icon className="h-7 w-7 text-cyan-400" />
                    <h3 className="mt-3 font-bold text-white">{w.title}</h3>
                    <p className="mt-1 text-sm text-slate-400 leading-6">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOURCES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">Curriculum sources</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Built on the world&apos;s strongest sources
            </h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              The curriculum structure comes from OSSU, supported by Harvard,
              MIT, Stanford and Nand2Tetris.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group block h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {s.name}
                  </h3>
                  <ArrowLeft className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
                </div>
                <p className="mt-2 text-sm text-slate-400 leading-6">{s.desc}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <span className="text-sm font-bold text-cyan-400">FAQ</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                Everything you need to know
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 space-y-4">
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <details className="group rounded-xl border border-white/10 bg-ink-900/60 overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-bold text-white list-none [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-cyan-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-slate-400 leading-8">{f.a}</p>
                </details>
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
                  href="/sources"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  Browse the sources
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Free forever
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <Brain className="h-3 w-3 text-cyan-400" /> Miku guides you
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <Timer className="h-3 w-3 text-emerald-400" /> Pomodoro focus
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
