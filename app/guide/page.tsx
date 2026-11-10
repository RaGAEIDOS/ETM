import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  LayoutDashboard,
  Timer,
  PlayCircle,
  BookMarked,
  Github,
  Rocket,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import MikuAvatar from "@/components/MikuAvatar";

export const metadata: Metadata = {
  title: "Miku's Tutorials",
  description:
    "Miku explains how to use every part of ETM: curriculum, lessons, playground, dashboard, pomodoro, ElZero videos, glossary and more.",
};

const SECTIONS = [
  {
    icon: BookOpen,
    color: "from-cyan-400 to-blue-500",
    title: "1. The Curriculum",
    body: "Everything you will learn is organized into 4 levels: Foundations, Intermediate, Advanced, and Expert. Each level has courses, and each course has lessons. Start at the top of Foundations — the order matters because every lesson builds on the previous one.",
    miku: "ابدأ من Foundations لو معندكش خبرة. كل مستوى بيبني على اللي قبله، فمت.skipش حاجة!",
  },
  {
    icon: BookOpen,
    color: "from-violet-400 to-fuchsia-500",
    title: "2. Studying a Lesson",
    body: "Open a lesson and read the explanation, run the code examples in the Playground, then solve the quiz at the end. When you are done, press the Completed button so Miku can track your progress.",
    miku: "اقرأ، جرّب، وحل الـ Quiz. ولو خلصته اضغط Completed عشان أعرف وصلت فين.",
  },
  {
    icon: Code2,
    color: "from-emerald-400 to-teal-500",
    title: "3. The C++ Playground",
    body: "The playground compiles and runs real C++ in your browser — no installs. Copy any example from a lesson, change the values, and press Run. Experimenting is the fastest way to learn.",
    miku: "اكتب أي كود واضغط Run. جرب تعدّل القيم وتشوف النتيجة — ده أسرع طريقة تتعلم بيها.",
  },
  {
    icon: LayoutDashboard,
    color: "from-cyan-400 to-violet-500",
    title: "4. Your Dashboard",
    body: "The dashboard shows your completed lessons, ElZero videos watched, focus time today, your day streak, and exactly what is left in the curriculum. Check it whenever you want to see how far you have come.",
    miku: "الديب بورد بتوريك وصلت فين وإيه اللي فاضل. زره كل يوم وشوف تقدمك!",
  },
  {
    icon: Timer,
    color: "from-amber-400 to-orange-500",
    title: "5. Pomodoro Focus",
    body: "Press the timer button in the bottom-right corner. A Focus session runs for 25 minutes, then a 5-minute break. After 4 focus sessions you earn a long break. Turn on Lofi study music to stay in the zone.",
    miku: "25 دقيقة Focus وبعدها 5 دقايق Break. أنا هذكرك لو سهات عني! 🎵",
  },
  {
    icon: PlayCircle,
    color: "from-rose-400 to-pink-500",
    title: "6. ElZero Videos",
    body: "78 videos from the ElZero Web School Fundamentals of Programming with C++ playlist. Every video has its own page with a summary, the most important terminology, a quick quiz, and a code example.",
    miku: "لكل فيديو ملخص + Quiz + أهم المصطلحات. شوف الفيديو على يوتيوب وبعدين تعال هنا تحل الامتحان.",
  },
  {
    icon: BookMarked,
    color: "from-sky-400 to-indigo-500",
    title: "7. Glossary",
    body: "Every English term in the curriculum is explained in Arabic in the glossary. If you meet a word you do not understand, search for it there.",
    miku: "مفيش حاجز لغوي قدامك — أي كلمة إنجليزي متشرحة بالعربي في القاموس.",
  },
  {
    icon: Github,
    color: "from-slate-400 to-slate-600",
    title: "8. Sign in with GitHub",
    body: "Sign in with your GitHub account to use your real name and profile picture across the platform. Your progress is saved on your device and linked to your GitHub identity.",
    miku: "سجّل بحساب GitHub عشان صورتك واسمك يبوا حقيقيين. مليش أي دليل غير كده!",
  },
  {
    icon: Rocket,
    color: "from-amber-400 to-rose-500",
    title: "9. Projects",
    body: "Projects are where everything comes together: a calculator, a Snake game with your own engine, an operating system kernel in QEMU, and more. Build them in order and put them on your portfolio.",
    miku: "المشاريع هي اللي بتثبت المعلومة. ابنِ مشروع حقيقي وتحطه في البورتفوليو بتاعك.",
  },
];

const QUICK_START = [
  "Open the Curriculum and start the first lesson",
  "Run the example in the Playground",
  "Solve the quiz and press Completed",
  "Open the Dashboard to see your progress",
  "Try a 25-minute Pomodoro focus session",
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <MikuAvatar size={88} />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-300">
          <GraduationCap className="h-4 w-4" />
          Miku&apos;s Tutorials
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          Learn how to use <span className="gradient-text">ETM</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">
          Hi! I am <b className="text-white">Miku</b>, your study buddy. Here is
          everything you need to know about the platform — from your first lesson
          to your final project.
        </p>
      </div>

      {/* quick start */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <h2 className="font-black text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Quick start — your first 15 minutes
        </h2>
        <ol className="mt-4 space-y-3">
          {QUICK_START.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-ink-950">
                {i + 1}
              </span>
              <span className="text-slate-300 leading-7">{s}</span>
            </li>
          ))}
        </ol>
        <Link
          href="/curriculum"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
        >
          Start the first lesson <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      {/* sections */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors"
          >
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-ink-950`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-black text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-7">{s.body}</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] p-3">
              <MikuAvatar size={26} className="mt-0.5 shrink-0" />
              <p className="text-sm text-cyan-100 leading-6">{s.miku}</p>
            </div>
          </div>
        ))}
      </div>

      {/* bottom cta */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-l from-cyan-500/10 to-violet-500/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-cyan-400 mx-auto" />
        <h2 className="mt-3 text-2xl font-black text-white">
          That is everything, champion! 🏆
        </h2>
        <p className="mt-2 text-slate-400 max-w-xl mx-auto leading-7">
          You know how to use the whole platform now. The only thing left is to
          start learning — Miku will be right here if you need help.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
          >
            Start learning <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4" /> Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
