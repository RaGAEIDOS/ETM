"use client";

import { useEffect } from "react";
import Link from "@/lib/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { useLocaleRouter } from "@/lib/i18n/navigation";
import { type Locale } from "@/lib/i18n/config";
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

const FEATURES: { key: string; icon: typeof BookOpen; color: string }[] = [
  { key: "curriculum", icon: BookOpen, color: "from-cyan-400 to-blue-500" },
  { key: "glossary", icon: Search, color: "from-violet-400 to-fuchsia-500" },
  { key: "playground", icon: Code2, color: "from-emerald-400 to-teal-500" },
  { key: "projects", icon: Target, color: "from-amber-400 to-orange-500" },
  { key: "progress", icon: Trophy, color: "from-rose-400 to-pink-500" },
  { key: "career", icon: Users, color: "from-sky-400 to-indigo-500" },
];

const FEATURES_COPY: Record<Locale, Record<string, { title: string; desc: string }>> = {
  ar: {
    curriculum: { title: "منهج متكامل من الصفر", desc: "منهج جامعي كامل مبني على OSSU، مكتوب بالعربية — من أول متغير لديك إلى نواة نظام تشغيل." },
    glossary: { title: "شرح عربي + مصطلحات", desc: "كل المصطلحات الإنجليزية تشرح بالعربية وتتوفر في دليل المصطلحات — بلا حاجز لغوي." },
    playground: { title: "محرك C++ التفاعلي", desc: "اكتب وشغّل C++ حقيقياً مباشرة في المتصفح، بدون تركيب. جرّب كل الأمثلة بنفسك." },
    projects: { title: "مشاريع حقيقية", desc: "من آلة حاسبة بسيطة إلى لعبة Snake بمحركك وماكينات زمنية حقيقية تنفذ في QEMU." },
    progress: { title: "تتبع التقدم", desc: "اعرف أين أنت بالضبط، وكم الدروس أكملتها، وما هو المستوى التالي — مع تشجيع من Miku." },
    career: { title: "مسار مهني واضح", desc: "مصمم للسوق: مهارات حقيقية الطلب في هندسة الأنظمة وتطوير محركات الألعاب." },
  },
  en: {
    curriculum: { title: "A complete curriculum from zero", desc: "A full university-level curriculum based on OSSU, rewritten in Arabic — from your first variable to an operating system kernel." },
    glossary: { title: "Arabic explanations + glossary", desc: "Every English term is explained in Arabic and indexed in a dedicated glossary — no language barrier in your way." },
    playground: { title: "Interactive C++ playground", desc: "Write and run real C++ right in your browser, no installs. Try every example yourself and experiment freely." },
    projects: { title: "Real projects", desc: "From a simple calculator to a Snake game with your own engine and an OS kernel that actually runs in QEMU." },
    progress: { title: "Progress tracking", desc: "Know exactly where you are, how many lessons you finished, and what stage comes next — with Miku cheering you on." },
    career: { title: "A clear career path", desc: "Designed for the job market: skills actually in demand in systems programming and game engineering." },
  },
};

const WHY_CPP: { key: string; icon: typeof Zap; title: string; desc: string }[] = [
  { key: "speed", icon: Zap, title: "Speed & performance", desc: "C++ is one of the fastest languages in the world — used wherever performance matters." },
  { key: "engines", icon: Gamepad2, title: "Game engines", desc: "Unreal Engine and the major game engines are built with C++." },
  { key: "os", icon: Cpu, title: "Operating systems", desc: "Windows, Linux and macOS all contain millions of lines of C++." },
  { key: "memory", icon: Shield, title: "Memory control", desc: "C++ gives you full control over hardware and memory — real power." },
];

const WHY_CPP_COPY: Record<Locale, Record<string, { title: string; desc: string }>> = {
  ar: {
    speed: { title: "سرعة وأداء", desc: "C++ من أسرع اللغات في العالم — تُستخدم حيثما يهم الأداء." },
    engines: { title: "محركات ألعاب", desc: "Unreal Engine والمحركات الكبرى مبنية بـ C++." },
    os: { title: "أنظمة تشغيل", desc: "Windows و Linux و macOS كلها مليئة بملايين الأسطر المكتوبة بـ C++." },
    memory: { title: "تحكم كامل", desc: "C++ يعطيك تحكماً كاملاً في الأجهزة والذاكرة — قوة حقيقية." },
  },
  en: {
    speed: { title: "Speed & performance", desc: "C++ is one of the fastest languages in the world — used wherever performance matters." },
    engines: { title: "Game engines", desc: "Unreal Engine and the major game engines are built with C++." },
    os: { title: "Operating systems", desc: "Windows, Linux and macOS all contain millions of lines of C++." },
    memory: { title: "Memory control", desc: "C++ gives you full control over hardware and memory — real power." },
  },
};

const SOURCES: { key: string; name: string; desc: string; url: string }[] = [
  { key: "ossu", name: "OSSU", desc: "The core curriculum — a complete free university education", url: "https://github.com/ossu/computer-science" },
  { key: "cs50", name: "CS50 — Harvard", desc: "The most famous introduction to computer science in the world", url: "https://cs50.harvard.edu/x/" },
  { key: "mit", name: "MIT OpenCourseWare", desc: "MIT's open courses: algorithms, math, architecture", url: "https://ocw.mit.edu/" },
  { key: "nand2tetris", name: "Nand2Tetris", desc: "Build a complete computer from a single NAND gate", url: "https://www.nand2tetris.org/" },
  { key: "ostep", name: "OSTEP", desc: "The most popular operating systems book — completely free", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
  { key: "learncpp", name: "Learn C++", desc: "A comprehensive reference for learning the language from zero", url: "https://www.learncpp.com/" },
];

const SOURCES_COPY: Record<Locale, Record<string, string>> = {
  ar: {
    ossu: "المنهج الأساسي — تعليم أكاديمي مجاني كامل",
    cs50: "أشهر مقدمة في علوم الحاسوب في العالم",
    mit: "مقررات مفتوحة من MIT: الخوارزميات والرياضيات والبنية التحتية",
    nand2tetris: "ابنِ حاسوباً كاملاً من بوابة NAND واحدة",
    ostep: "أشهر كتاب في أنظمة التشغيل — مجاني بالكامل",
    learncpp: "مرجع شامل لتعلم اللغة من الصفر",
  },
  en: {
    ossu: "The core curriculum — a complete free university education",
    cs50: "The most famous introduction to computer science in the world",
    mit: "MIT's open courses: algorithms, math, architecture",
    nand2tetris: "Build a complete computer from a single NAND gate",
    ostep: "The most popular operating systems book — completely free",
    learncpp: "A comprehensive reference for learning the language from zero",
  },
};

const FAQS: Record<Locale, { q: string; a: string }[]> = {
  ar: [
    { q: "ليس لدي أي خبرة في البرمجة. هل هذا مناسب لي؟", a: "بالتأكيد. المنهج يبدأ من الصفر المطلق: أول درس يعلّمك تركيب المترجم، والثاني يكتب أول سطر كود لك. المستوى الأول مصمم خصيصاً لأشخاص لم يكتبوا برمجياً من قبل." },
    { q: "ليش C++ وليس لغة أبسط مثل Python؟", a: "C++ من أكثر اللغات قوة — وبالتالي صعبة — وذلك هو سبب قيمتها. عندما تفهم C++ بعمق، تفهم كيف يعمل الحاسوب فعلاً، وتصبح باقي اللغات سهلة. والأهم أنه اللغة الأساسية في أنظمة البرمجة وهندسة الألعاب، وأحد أكثر المهارات طلباً في السوق." },
    { q: "ما هو OSSU؟", a: "OSSU (Open Source Society University) منهج مجاني معتمد يساوي درجة علمية كاملة في علوم الحاسوب، مبني من مصادر عالمية (Harvard, MIT, Stanford). أخذنا هيكله ومصادره وأعادنا كتابته كلها بالعربية مع شرح مبسط وممارسات C++." },
    { q: "كم الوقت أحتاج كل أسبوع؟", a: "إذا تستطيع وضع 10 ساعات أسبوعياً، يمكنك إنهاء المستوى الأول في حوالي شهرين. المنهج كاملاً يستغرق تقريباً سنتين ونصف إلى سنتين، مثل أي درجة. الاستمرارية أهم من السرعة." },
    { q: "هل سأكون قادراً على العمل بعد إكماله؟", a: "الهدف النهائي هو أن تصبح مهندس برمجيات قادراً على العمل فعلياً. مشاريع المستوى الرابع (محرك ألعاب، نواة نظام تشغيل، مترجم) هي أقوى ما يمكنك إضافته لمصدرو محافظك لفتح الأبواب." },
  ],
  en: [
    { q: "I have zero programming experience. Is this for me?", a: "Exactly. The curriculum starts from absolute zero: the first lesson teaches you to install the compiler, and the second one writes your first line of code. Level one is designed specifically for people who have never written code before." },
    { q: "Why C++ and not something easier like Python?", a: "C++ is one of the most powerful — and demanding — languages, and that is exactly why it is valuable. When you understand C++ deeply, you understand how the computer actually works, and every other language becomes easy. It is also the core language of systems programming and game engines, and one of the most in-demand skills in the market." },
    { q: "What is OSSU?", a: "OSSU (Open Source Society University) is a free, accredited curriculum that equals a full computer science degree, built from world-class sources (Harvard, MIT, Stanford). We took its structure and sources and rewrote everything in Arabic, with simplified explanations and C++ exercises." },
    { q: "How much time do I need each week?", a: "If you can put in 10 hours a week, you can finish the first level in about two months. The full curriculum takes roughly one and a half to two years, like any degree. Consistency matters more than speed." },
    { q: "Will I be able to work after finishing it?", a: "The final goal is to make you a software engineer who can actually work. The stage four projects (a game engine, an OS kernel, a compiler) are the strongest things you can add to your portfolio to open doors." },
  ],
};

const COPY: Record<Locale, {
  heroBadge: string;
  heroA: string;
  heroAccentA: string;
  heroAccentB: string;
  heroLead: string;
  ctaStart: string;
  ctaPlayground: string;
  ctaGuide: string;
  ctaDashboard: string;
  ctaPomodoro: string;
  statsLessons: string;
  statsCourses: string;
  statsProjects: string;
  statsLevels: string;
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  levelsEyebrow: string;
  levelsTitle: string;
  levelsLead: string;
  start: string;
  howEyebrow: string;
  howTitle: string;
  step1: string;
  step2: string;
  step3: string;
  step1Desc: string;
  step2Desc: string;
  step3Desc: string;
  whyCppEyebrow: string;
  whyCppTitle: string;
  whyCppLead: string;
  startLevel1: string;
  sourcesEyebrow: string;
  sourcesTitle: string;
  sourcesLead: string;
  faqEyebrow: string;
  faqTitle: string;
  ctaTitle: string;
  ctaLead: string;
  ctaLesson: string;
  ctaSources: string;
  ctaBooks: string;
  freeForever: string;
  mikuz: string;
  pomodoro: string;
  join: string;
  freeForever2: string;
  loading: string;
}> = {
  ar: {
    heroBadge: "المنهج العالمي الشهير — OSSU — موثّق بالعربية",
    heroA: "تعلّم البرمجة",
    heroAccentA: "من الصفر",
    heroAccentB: "إلى بناء نظام تشغيل متقدم",
    heroLead: "ETM بتعلمك لغة C++ مع منهج جامعي كامل، وشرح واضح، وأمثلة تفاعلية، ومشاريع حقيقية — من أول سطر كود لك إلى محرك ألعاب ونظام تشغيل عملي.",
    ctaStart: "ابدأ الرحلة — مجاناً",
    ctaPlayground: "جرّب المحرك C++",
    ctaGuide: "جديد هنا؟ يقوّدك Miku",
    ctaDashboard: "لوحة التقدم",
    ctaPomodoro: "تركيز Pomodoro",
    statsLessons: "دروس تفاعلية",
    statsCourses: "كورسات متكاملة",
    statsProjects: "مشاريع حقيقية",
    statsLevels: "مستويات صعبة",
    whyEyebrow: "ليش ETM؟",
    whyTitle: "منصة كاملة، لا فيديوهات فقط",
    whyLead: "كل ما تحتاجه للتعلم في مكان واحد: دروس، أمثلة، محرك، مشاريع، وتتبع تقدم.",
    levelsEyebrow: "مسار التعلم",
    levelsTitle: "4 مستويات: من Very Easy إلى Extreme",
    levelsLead: "مسار متدرج بعناية. كل مستوى يبني على السابق، وكل درس يقربك خطوة واحدة من الإتقان.",
    start: "ابدأ",
    howEyebrow: "كيف تتعلم",
    howTitle: "تعلم بطريقة مثبتة",
    step1: "تعلّم الدرس",
    step2: "تمرّن في المحرك",
    step3: "ابنِ مشروعاً",
    step1Desc: "شرح واضح + أمثلة كود حقيقية + سؤال تفاعلي تاكد أنك فهمت.",
    step2Desc: "انسخ مثالاً أو اكتب أكتب بنفسي، شغّلها في المحرك، وجرّب تعديلها.",
    step3Desc: "كل كورس ينتهي بمشروع حقيقي يجمع كل المفاهيم — أفضل طريقة لتثبيت التعلم.",
    whyCppEyebrow: "ليش C++؟",
    whyCppTitle: "اللغة التي تفتح باب هندسة الأنظمة",
    whyCppLead: "C++ ليست مجرد لغة برمجة — بل الأداة التي تبني بها أكبر الشركات أنظمة قوية. عندما تتعلمها، تتعلم كيف يعمل الحاسوب فعلاً.",
    startLevel1: "ابدأ من المستوى الأول",
    sourcesEyebrow: "مصادر المنهج",
    sourcesTitle: "مبني على أقوى المصادر في العالم",
    sourcesLead: "هيكل المنهج يأتي من OSSU، مدعوماً بـ Harvard و MIT و Stanford و Nand2Tetris.",
    faqEyebrow: "أسئلة شائعة",
    faqTitle: "كل ما تحتاج معرفته",
    ctaTitle: "رحلتك نحو الإتقان تبدأ بخطوة واحدة",
    ctaLead: "ساعة من الآن يمكنك أن تكتب أول سطر كود لك. بعد ذلك، السماء هي الحد.",
    ctaLesson: "ابدأ الدرس الأول — مجاناً",
    ctaSources: "تصفح المصادر",
    ctaBooks: "الكتب المجانية",
    freeForever: "مجاناً إلى الأبد",
    mikuz: "يقوّد Miku خطاك",
    pomodoro: "تركيز Pomodoro",
    join: "انضم لآلاف المتعلمين العرب —",
    freeForever2: "مجاناً إلى الأبد",
    loading: "جارٍ التحميل...",
  },
  en: {
    heroBadge: "The world-famous OSSU curriculum — explained in Arabic",
    heroA: "Learn programming from",
    heroAccentA: "zero",
    heroAccentB: "to building an operating system",
    heroLead: "ETM teaches you C++ with a complete university-level curriculum, clear explanations, interactive examples, and real projects — from your first line of code to a game engine and an OS kernel that actually runs.",
    ctaStart: "Start the journey — free",
    ctaPlayground: "Try the C++ playground",
    ctaGuide: "New here? Miku will show you around",
    ctaDashboard: "Dashboard",
    ctaPomodoro: "Pomodoro focus",
    statsLessons: "Interactive lessons",
    statsCourses: "Complete courses",
    statsProjects: "Real projects",
    statsLevels: "Difficulty levels",
    whyEyebrow: "Why ETM?",
    whyTitle: "A complete platform, not just videos",
    whyLead: "Everything you need to learn in one place: lessons, examples, a playground, projects, and progress tracking.",
    levelsEyebrow: "Learning path",
    levelsTitle: "4 levels: from Very Easy to Extreme",
    levelsLead: "A carefully gradual path. Every level builds on the one before it, and every lesson brings you one step closer to mastery.",
    start: "Start",
    howEyebrow: "How you learn",
    howTitle: "Learn with a proven method",
    step1: "Learn the lesson",
    step2: "Practice in the playground",
    step3: "Build a project",
    step1Desc: "Clear explanations + real code examples + an interactive quiz so you can check that you understood.",
    step2Desc: "Copy an example or write your own, run it in the playground, and experiment by changing things yourself.",
    step3Desc: "Every course ends with a real project that brings everything together — the best way to make it stick.",
    whyCppEyebrow: "Why C++?",
    whyCppTitle: "The language that opens the door to systems engineering",
    whyCppLead: "C++ is not just a programming language — it is the tool the world's biggest companies use to build the strongest systems. When you learn it, you learn how the computer really works.",
    startLevel1: "Start with level one",
    sourcesEyebrow: "Curriculum sources",
    sourcesTitle: "Built on the world's strongest sources",
    sourcesLead: "The curriculum structure comes from OSSU, supported by Harvard, MIT, Stanford and Nand2Tetris.",
    faqEyebrow: "FAQ",
    faqTitle: "Everything you need to know",
    ctaTitle: "Your journey to mastery starts with one step",
    ctaLead: "One hour from now you could write your first line of code. From there, the sky is the limit.",
    ctaLesson: "Start the first lesson — free",
    ctaSources: "Browse the sources",
    ctaBooks: "Free books",
    freeForever: "Free forever",
    mikuz: "Miku guides you",
    pomodoro: "Pomodoro focus",
    join: "Join thousands of Arabic learners —",
    freeForever2: "free forever",
    loading: "Loading...",
  },
} as const;

export default function HomePage() {
  const { user, ready } = useAuth();
  const locale = useLocale();
  const localeRouter = useLocaleRouter();
  const c = useCopy(COPY);

  // Landing page for logged-in users only — guests are redirected to /landing
  useEffect(() => {
    if (ready && !user) localeRouter.replace("/landing");
  }, [ready, user, localeRouter]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        {c.loading}
      </div>
    );
  }

  if (!user) return null;

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
                  {c.heroBadge}
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-6 text-[1.9rem] leading-[1.4] sm:text-5xl lg:text-6xl font-black text-white">
                  {c.heroA}{" "}
                  <span className="gradient-text">{c.heroAccentA}</span>
                  <br />
                  {c.heroAccentB}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-lg leading-9 text-slate-400 max-w-xl">
                  {c.heroLead}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/curriculum" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow">
                    {c.ctaStart}
                    <ArrowLeft className="h-5 w-5 ltr:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/playground" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-colors">
                    <Play className="h-5 w-5 text-cyan-400" />
                    {c.ctaPlayground}
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={350}>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href="/guide" className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors">
                    <Terminal className="h-4 w-4" />
                    {c.ctaGuide}
                  </Link>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                    {c.ctaDashboard}
                  </Link>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                    <Timer className="h-4 w-4 text-emerald-400" />
                    {c.ctaPomodoro}
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2 space-x-reverse">
                    {["Ahmed", "Sara", "Mahmoud", "Nour"].map((n) => (
                      <span key={n} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-950 bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-xs font-bold text-white">
                        {n[0]}
                      </span>
                    ))}
                  </div>
                  <span>
                    {c.join}{" "}
                    <span className="text-white font-semibold">{c.freeForever2}</span>
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
            <Stat value={lessonCount} label={c.statsLessons} />
            <Stat value={courseCount} label={c.statsCourses} />
            <Stat value={projects.length} label={c.statsProjects} />
            <Stat value={4} label={c.statsLevels} />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">{c.whyEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{c.whyTitle}</h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">{c.whyLead}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const t = FEATURES_COPY[locale][f.key];
            const Icon = f.icon;
            return (
              <Reveal key={f.key} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-ink-950 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{t.title}</h3>
                  <p className="mt-2 text-slate-400 leading-7">{t.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ LEVELS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-sm font-bold text-cyan-400">{c.levelsEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{c.levelsTitle}</h2>
              <p className="mt-4 text-lg text-slate-400 leading-8">{c.levelsLead}</p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, i) => {
              const Icon = [Sparkles, Layers, Cpu, Rocket][i] ?? Layers;
              const lessonCountStage = stage.courses.reduce(
                (s, course) => s + course.lessons.length,
                0
              );
              return (
                <Reveal key={stage.id} delay={i * 100}>
                  <Link href={`/learn/${stage.id}`} className="group block h-full rounded-2xl border border-white/10 bg-ink-900/60 p-6 hover:border-white/25 transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stage.color} text-ink-950 shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-white/5 rounded-full px-3 py-1">
                        {locale === "ar" ? `المستوى ${stage.level}` : `Level ${stage.level}`}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black text-white">{stage.nameEn}</h3>
                    <p className="mt-1 text-sm font-semibold text-cyan-300" dir="rtl">{stage.name}</p>
                    <p className="mt-3 text-sm text-slate-400 leading-6 line-clamp-3" dir="rtl">{stage.tagline}</p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {locale === "ar"
                          ? `${stage.courses.length} كورسات · ${lessonCountStage} درساً`
                          : `${stage.courses.length} courses · ${lessonCountStage} lessons`}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:gap-2 transition-all">
                        {c.start}
                        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
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
            <span className="text-sm font-bold text-cyan-400">{c.howEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{c.howTitle}</h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            { icon: BookOpen, step: "1", title: c.step1, desc: c.step1Desc },
            { icon: Code2, step: "2", title: c.step2, desc: c.step2Desc },
            { icon: Target, step: "3", title: c.step3, desc: c.step3Desc },
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
                <span className="text-sm font-bold text-cyan-400">{c.whyCppEyebrow}</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
                  {c.whyCppTitle}
                </h2>
                <p className="mt-4 text-lg text-slate-400 leading-8">{c.whyCppLead}</p>
                <Link href="/curriculum" className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300">
                  {c.startLevel1}
                  <ArrowLeft className="h-5 w-5 ltr:rotate-180" />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {WHY_CPP.map((w, i) => (
                <Reveal key={w.key} delay={i * 80}>
                  <div className="rounded-xl border border-white/10 bg-ink-900/60 p-5 hover:border-cyan-500/30 transition-colors">
                    <w.icon className="h-7 w-7 text-cyan-400" />
                    <h3 className="mt-3 font-bold text-white">{WHY_CPP_COPY[locale][w.key].title}</h3>
                    <p className="mt-1 text-sm text-slate-400 leading-6">{WHY_CPP_COPY[locale][w.key].desc}</p>
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
            <span className="text-sm font-bold text-cyan-400">{c.sourcesEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{c.sourcesTitle}</h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">{c.sourcesLead}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map((s, i) => (
            <Reveal key={s.key} delay={i * 60}>
              <a href={s.url} target="_blank" rel="noreferrer" className="group block h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{s.name}</h3>
                  <ArrowLeft className="h-4 w-4 ltr:rotate-180 text-slate-600 group-hover:text-cyan-400 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-2 text-sm text-slate-400 leading-6">{SOURCES_COPY[locale][s.key]}</p>
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
              <span className="text-sm font-bold text-cyan-400">{c.faqEyebrow}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{c.faqTitle}</h2>
            </div>
          </Reveal>
          <div className="mt-12 space-y-4">
            {FAQS[locale].map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <details className="group rounded-xl border border-white/10 bg-ink-900/60 overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-bold text-white list-none [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-cyan-400 transition-transform group-open:rotate-45">+</span>
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
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">{c.ctaTitle}</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-8">{c.ctaLead}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/curriculum" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-8 py-4 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow">
                  {c.ctaLesson}
                  <ArrowLeft className="h-5 w-5 ltr:rotate-180" />
                </Link>
                <Link href="/sources" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors">
                  <Github className="h-5 w-5" />
                  {c.ctaSources}
                </Link>
                <Link href="/books" className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 font-bold text-cyan-200 hover:bg-cyan-500/20 transition-colors">
                  <BookOpen className="h-5 w-5" />
                  {c.ctaBooks}
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {c.freeForever}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <Brain className="h-3 w-3 text-cyan-400" /> {c.mikuz}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1">
                  <Timer className="h-3 w-3 text-emerald-400" /> {c.pomodoro}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
