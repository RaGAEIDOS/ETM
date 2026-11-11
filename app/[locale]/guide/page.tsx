import type { Metadata } from "next";
import Link from "@/lib/i18n/navigation";
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
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const SECTIONS: {
  icon: typeof BookOpen;
  color: string;
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  miku: { ar: string; en: string };
}[] = [
  {
    icon: BookOpen,
    color: "from-cyan-400 to-blue-500",
    title: { ar: "١. المنهج", en: "1. The Curriculum" },
    body: {
      ar: "كل شيء ستتعلمه منظم في 4 مستويات: Foundations ثم Intermediate ثم Advanced ثم Expert. كل مستوى فيه كورسات، وكل كورس فيه دروس. ابدأ من أول Foundations — الترتيب مهم لأن كل درس يبني على الدرس السابق.",
      en: "Everything you will learn is organized into 4 levels: Foundations, Intermediate, Advanced, and Expert. Each level has courses, and each course has lessons. Start at the top of Foundations — the order matters because every lesson builds on the previous one.",
    },
    miku: {
      ar: "ابدأ من Foundations لو معندكش خبرة. كل مستوى بيبني على اللي قبله، فمت.skipش حاجة!",
      en: "Start with Foundations if you have no experience. Each level builds on the last — don't skip!",
    },
  },
  {
    icon: BookOpen,
    color: "from-violet-400 to-fuchsia-500",
    title: { ar: "٢. دراسة الدرس", en: "2. Studying a Lesson" },
    body: {
      ar: "افتح الدرس واقرأ الشرح، وشغّل أمثلة الكود في الـ Playground، ثم حل الـ Quiz في النهاية. لما تخلص اضغط زر Completed عشان Miku يتابع تقدمك.",
      en: "Open a lesson and read the explanation, run the code examples in the Playground, then solve the quiz at the end. When you are done, press the Completed button so Miku can track your progress.",
    },
    miku: {
      ar: "اقرأ، جرّب، وحل الـ Quiz. ولو خلصته اضغط Completed عشان أعرف وصلت فين.",
      en: "Read, try, solve the quiz — then hit Completed so I know where you are!",
    },
  },
  {
    icon: Code2,
    color: "from-emerald-400 to-teal-500",
    title: { ar: "٣. محرك C++ التفاعلي", en: "3. The C++ Playground" },
    body: {
      ar: "الـ Playground يترجم ويشغّل C++ حقيقي داخل متصفحك — بدون تركيب. انسخ أي مثال من الدرس، عدّل القيم، واضغط Run. التجريب أسرع طريق للتعلم.",
      en: "The playground compiles and runs real C++ in your browser — no installs. Copy any example from a lesson, change the values, and press Run. Experimenting is the fastest way to learn.",
    },
    miku: {
      ar: "اكتب أي كود واضغط Run. جرب تعدّل القيم وتشوف النتيجة — ده أسرع طريقة تتعلم بيها.",
      en: "Write any code and hit Run. Change values and see the result — fastest way to learn!",
    },
  },
  {
    icon: LayoutDashboard,
    color: "from-cyan-400 to-violet-500",
    title: { ar: "٤. لوحة التحكم", en: "4. Your Dashboard" },
    body: {
      ar: "اللوحة توضح دروسك المكتملة، وفيديوهات ElZero المشاهدة، ووقت تركيزك اليوم، وسلسلة أيامك، وما تبقى في المنهج. زورها متى ما أردت ترى كم سرت.",
      en: "The dashboard shows your completed lessons, ElZero videos watched, focus time today, your day streak, and exactly what is left in the curriculum. Check it whenever you want to see how far you have come.",
    },
    miku: {
      ar: "الديب بورد بتوريك وصلت فين وإيه اللي فاضل. زره كل يوم وشوف تقدمك!",
      en: "The dashboard shows where you are and what's left. Visit every day!",
    },
  },
  {
    icon: Timer,
    color: "from-amber-400 to-orange-500",
    title: { ar: "٥. التركيز مع Pomodoro", en: "5. Pomodoro Focus" },
    body: {
      ar: "اضغط زر المؤقّت في الزاوية السفلية. جلسة Focus مدتها 25 دقيقة، ثم استراحة 5 دقائق. بعد 4 جلسات تركز تنال استراحة طويلة. شغّل Study Radio — 8 محطات SomaFM حية مجانية — لتبقى في منطقة التركيز.",
      en: "Press the timer button in the bottom corner. A Focus session runs for 25 minutes, then a 5-minute break. After 4 focus sessions you earn a long break. Turn on Study Radio — pick from 8 free live SomaFM stations — to stay in the zone.",
    },
    miku: {
      ar: "25 دقيقة Focus وبعدها 5 دقايق Break. أنا هذكرك لو سهات عني! 🎵",
      en: "25 minutes of focus, then a 5-minute break. I'll remind you if you drift! 🎵",
    },
  },
  {
    icon: PlayCircle,
    color: "from-rose-400 to-pink-500",
    title: { ar: "٦. فيديوهات ElZero", en: "6. ElZero Videos" },
    body: {
      ar: "78 فيديو من قائمة ElZero Web School — أساسيات البرمجة بـ C++. كل فيديو له صفحته فيها ملخص، وأهم المصطلحات، وQuiz سريع، ومثال كود.",
      en: "78 videos from the ElZero Web School Fundamentals of Programming with C++ playlist. Every video has its own page with a summary, the most important terminology, a quick quiz, and a code example.",
    },
    miku: {
      ar: "لكل فيديو ملخص + Quiz + أهم المصطلحات. شوف الفيديو على يوتيوب وبعدين تعال هنا تحل الامتحان.",
      en: "Each video has a summary + quiz + key terms. Watch it on YouTube, then solve the exam here!",
    },
  },
  {
    icon: BookMarked,
    color: "from-sky-400 to-indigo-500",
    title: { ar: "٧. دليل المصطلحات", en: "7. Glossary" },
    body: {
      ar: "كل مصطلح إنجليزي في المنهج مشروح بالعربية في دليل المصطلحات. لو قابلت كلمة ما تفهمها، ابحث عنها هناك.",
      en: "Every English term in the curriculum is explained in Arabic in the glossary. If you meet a word you do not understand, search for it there.",
    },
    miku: {
      ar: "مفيش حاجز لغوي قدامك — أي كلمة إنجليزي متشرحة بالعربي في القاموس.",
      en: "No language barrier — every English word is explained in Arabic in the glossary.",
    },
  },
  {
    icon: Github,
    color: "from-slate-400 to-slate-600",
    title: { ar: "٨. تسجيل الدخول بـ GitHub", en: "8. Sign in with GitHub" },
    body: {
      ar: "سجّل بحساب GitHub عشان تستخدم اسمك الحقيقي وصورتك عبر المنصة. تقدمك محفوظ على جهازك ومرتبط بهويتك في GitHub.",
      en: "Sign in with your GitHub account to use your real name and profile picture across the platform. Your progress is saved on your device and linked to your GitHub identity.",
    },
    miku: {
      ar: "سجّل بحساب GitHub عشان صورتك واسمك يبوا حقيقيين. مليش أي دليل غير كده!",
      en: "Sign in with GitHub so your name and picture are real. Deal!",
    },
  },
  {
    icon: Rocket,
    color: "from-amber-400 to-rose-500",
    title: { ar: "٩. المشاريع", en: "9. Projects" },
    body: {
      ar: "المشاريع هي المكان الذي تجتمع فيه كل المفاهيم: آلة حاسبة، لعبة Snake بمحركك، نواة نظام تشغيل تعمل بـ QEMU، والمزيد. ابنِها بالترتيب وضعها في بورتفوليوك.",
      en: "Projects are where everything comes together: a calculator, a Snake game with your own engine, an operating system kernel in QEMU, and more. Build them in order and put them on your portfolio.",
    },
    miku: {
      ar: "المشاريع هي اللي بتثبت المعلومة. ابنِ مشروع حقيقي وتحطه في البورتفوليو بتاعك.",
      en: "Projects are what make it stick. Build a real one for your portfolio.",
    },
  },
];

const COPY = {
  ar: {
    metaTitle: "شروحات Miku",
    metaDescription:
      "Miku تشرح لك كيف تستخدم كل جزء من ETM: المنهج، الدروس، المحرك، لوحة التحكم، Pomodoro، فيديوهات ElZero، دليل المصطلحات والمزيد.",
    badge: "شروحات Miku",
    titleLead: "تعلّم كيف تستخدم",
    titleHighlight: "ETM",
    intro1: "أهلاً! أنا",
    intro2: "، رفيقتك في الدراسة. هذا كل ما تحتاج معرفته عن المنصة — من أول درس إلى مشروعك النهائي.",
    quickStartTitle: "البدء السريع — أول 15 دقيقة",
    quickStart: [
      "افتح المنهج وابدأ الدرس الأول",
      "شغّل المثال في الـ Playground",
      "حل الـ Quiz واضغط Completed",
      "افتح لوحة التحكم لترى تقدمك",
      "جرّب جلسة تركيز Pomodoro لمدة 25 دقيقة",
    ],
    startLesson: "ابدأ الدرس الأول",
    bottomTitle: "هذا كل شيء أيها البطل! 🏆",
    bottomBody:
      "الآن تعرف كيف تستخدم المنصة كاملة. كل ما تبقى هو أن تبدأ التعلم — Miku ستكون هنا لو احتجت مساعدة.",
    startLearning: "ابدأ التعلم",
    goDashboard: "اذهب للوحة التحكم",
  },
  en: {
    metaTitle: "Miku's Tutorials",
    metaDescription:
      "Miku explains how to use every part of ETM: curriculum, lessons, playground, dashboard, pomodoro, ElZero videos, glossary and more.",
    badge: "Miku's Tutorials",
    titleLead: "Learn how to use",
    titleHighlight: "ETM",
    intro1: "Hi! I am",
    intro2: ", your study buddy. Here is everything you need to know about the platform — from your first lesson to your final project.",
    quickStartTitle: "Quick start — your first 15 minutes",
    quickStart: [
      "Open the Curriculum and start the first lesson",
      "Run the example in the Playground",
      "Solve the quiz and press Completed",
      "Open the Dashboard to see your progress",
      "Try a 25-minute Pomodoro focus session",
    ],
    startLesson: "Start the first lesson",
    bottomTitle: "That is everything, champion! 🏆",
    bottomBody:
      "You know how to use the whole platform now. The only thing left is to start learning — Miku will be right here if you need help.",
    startLearning: "Start learning",
    goDashboard: "Go to dashboard",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  return pageMetadata({
    locale,
    path: "/guide",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function GuidePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <MikuAvatar size={88} />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-300">
          <GraduationCap className="h-4 w-4" />
          {c.badge}
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          {c.titleLead} <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">
          {c.intro1} <b className="text-white">Miku</b>
          {c.intro2}
        </p>
      </div>

      {/* quick start */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <h2 className="font-black text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          {c.quickStartTitle}
        </h2>
        <ol className="mt-4 space-y-3">
          {c.quickStart.map((s, i) => (
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
          {c.startLesson} <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
      </div>

      {/* sections */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div
            key={s.title.en}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors"
          >
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-ink-950`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-black text-white">{s.title[locale]}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-7">
              {s.body[locale]}
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] p-3">
              <MikuAvatar size={26} className="mt-0.5 shrink-0" />
              <p className="text-sm text-cyan-100 leading-6" dir="auto">
                {s.miku[locale]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* bottom cta */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-l from-cyan-500/10 to-violet-500/10 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-cyan-400 mx-auto" />
        <h2 className="mt-3 text-2xl font-black text-white">{c.bottomTitle}</h2>
        <p className="mt-2 text-slate-400 max-w-xl mx-auto leading-7">
          {c.bottomBody}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/curriculum"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
          >
            {c.startLearning} <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4" /> {c.goDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
