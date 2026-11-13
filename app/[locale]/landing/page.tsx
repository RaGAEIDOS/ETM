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
  Gamepad2,
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
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";

type Props = {
  params: { locale: string };
};

export function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const locale = localeFromParams(params);
  const isAr = locale === "ar";
  return Promise.resolve(
    pageMetadata({
      locale,
      path: "/landing",
      title: isAr ? "ETM — تعلّم C++ من الصفر إلى الاحتراف" : "ETM — Education Technology Miku",
      description: isAr
        ? "ETM (Education Technology Miku) — منصة عربية مجانية لتعلم C++ من الصفر حتى بناء نظام تشغيل ومحرك ألعاب. منهج OSSU كامل، محرك تفاعلي، مشاريع حقيقية، ورفيقة الدراسة Miku."
        : "ETM (Education Technology Miku) — a free platform that teaches C++ from zero to building an operating system and a game engine. Full Arabic-origin content, interactive playground, real projects, Miku your study buddy.",
    })
  );
}

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
    curriculum: { title: "منهج متكامل من الصفر", desc: "مبني على المنهج العالمي الشهير OSSU، مكتوب بشرح عربي مبسط — من أول متغير لديك إلى نواة نظام تشغيل." },
    glossary: { title: "شرح عربي + مصطلحات", desc: "كل المصطلحات الإنجليزية تشرح بالعربية وتتوفر في دليل المصطلحات — بلا حاجز لغوي." },
    playground: { title: "محرك C++ التفاعلي", desc: "اكتب وشغّل C++ حقيقياً مباشرة في المتصفح، بدون تركيب. جرّب كل الأمثلة بنفسك." },
    projects: { title: "مشاريع حقيقية", desc: "من آلة حاسبة بسيطة إلى لعبة Snake بمحركك ونواة نظام تشغيل يعمل فعلاً في QEMU." },
    progress: { title: "تتبع التقدم", desc: "اعرف أين أنت بالضبط، وكم الدروس أكملتها، وما هو المستوى التالي — مع تشجيع من Miku." },
    career: { title: "مسار مهني واضح", desc: "مصمم للسوق: مهارات حقيقية الطلب في هندسة الأنظمة وتطوير محركات الألعاب." },
  },
  en: {
    curriculum: { title: "A complete curriculum from zero", desc: "Based on the famous OSSU curriculum, rewritten with simplified Arabic explanations — from your first variable to an OS kernel." },
    glossary: { title: "Arabic explanations + glossary", desc: "Every English term is explained in Arabic and indexed in a dedicated glossary — no language barrier in your way." },
    playground: { title: "Interactive C++ playground", desc: "Write and run real C++ right in your browser, no installs. Try every example yourself and experiment freely." },
    projects: { title: "Real projects", desc: "From a simple calculator to a Snake game with your own engine and an OS kernel that actually runs in QEMU." },
    progress: { title: "Progress tracking", desc: "Know exactly where you are, how many lessons you finished, and what stage comes next — with Miku cheering you on." },
    career: { title: "A clear career path", desc: "Designed for the job market: skills actually in demand in systems programming and game engineering." },
  },
};

const HOW_IT_WORKS: { key: string; icon: typeof BookOpen; step: string; title: string; desc: string }[] = [
  { key: "1", icon: BookOpen, step: "1", title: "Learn the lesson", desc: "Clear explanations + real code examples + an interactive quiz so you can check that you understood." },
  { key: "2", icon: Code2, step: "2", title: "Practice in the playground", desc: "Copy an example or write your own, run it in the playground, and experiment by changing things yourself." },
  { key: "3", icon: Target, step: "3", title: "Build a project", desc: "Every course ends with a real project that brings everything together — the best way to make it stick." },
];

const HOW_IT_WORKS_COPY: Record<Locale, Record<string, { title: string; desc: string }>> = {
  ar: {
    "1": { title: "تعلّم الدرس", desc: "شرح واضح + أمثلة كود حقيقية + سؤال تفاعلي لتتأكد أنك فهمت." },
    "2": { title: "تمرّن في المحرك", desc: "انسخ مثالاً أو اكتب بنفسك، شغّله في المحرك، وجرّب تعديله." },
    "3": { title: "ابنِ مشروعاً", desc: "كل كورس ينتهي بمشروع حقيقي يجمع كل المفاهيم — أفضل طريقة لتثبيت التعلم." },
  },
  en: {
    "1": { title: "Learn the lesson", desc: "Clear explanations + real code examples + an interactive quiz so you can check that you understood." },
    "2": { title: "Practice in the playground", desc: "Copy an example or write your own, run it in the playground, and experiment by changing things yourself." },
    "3": { title: "Build a project", desc: "Every course ends with a real project that brings everything together — the best way to make it stick." },
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

export default function LandingPage({ params }: Props) {
  const locale = localeFromParams(params);
  const isAr = locale === "ar";
  const lessonCount = totalLessons();
  const courseCount = totalCourses();
  const videoCount = elzeroVideos.length;

  const heroBadge = isAr ? "المنهج العالمي الشهير — OSSU — موثّق بالعربية" : "The world-famous OSSU curriculum — explained in Arabic";
  const heroA = isAr ? "تعلّم البرمجة" : "Learn programming from";
  const heroAccentA = isAr ? "من الصفر" : "zero";
  const heroAccentB = isAr ? "إلى بناء نظام تشغيل متقدم" : "to building an operating system";
  const heroLead = isAr
    ? "ETM بتعلمك لغة C++ مع منهج جامعي كامل، وشرح واضح، وأمثلة تفاعلية، ومشاريع حقيقية — من أول سطر كود لك إلى محرك ألعاب ونظام تشغيل عملي."
    : "ETM teaches you C++ with a complete university-level curriculum, clear explanations, interactive examples, and real projects — from your first line of code to a game engine and an OS kernel that actually runs.";
  const ctaStart = isAr ? "ابدأ الرحلة — مجاناً" : "Start the journey — free";
  const ctaPlayground = isAr ? "جرّب المحرك C++" : "Try the C++ playground";
  const ctaGuide = isAr ? "جديد هنا؟ يقوّدك Miku" : "New here? Miku will show you around";

  const statsLessons = isAr ? "دروس تفاعلية" : "Interactive lessons";
  const statsCourses = isAr ? "كورسات متكاملة" : "Complete courses";
  const statsProjects = isAr ? "مشاريع حقيقية" : "Real projects";
  const statsLevels = isAr ? "مستويات صعبة" : "Difficulty levels";

  const whyEyebrow = isAr ? "ليش ETM؟" : "Why ETM?";
  const whyTitle = isAr ? "منصة كاملة، لا فيديوهات فقط" : "A complete platform, not just videos";
  const whyLead = isAr ? "كل ما تحتاجه للتعلم في مكان واحد: دروس، أمثلة، محرك، مشاريع، وتتبع تقدم." : "Everything you need to learn in one place: lessons, examples, a playground, projects, and progress tracking.";

  const faqEyebrow = isAr ? "أسئلة شائعة" : "FAQ";
  const faqTitle = isAr ? "كل ما تحتاج معرفته" : "Everything you need to know";

  const ctaTitle = isAr ? "رحلتك نحو الإتقان تبدأ بخطوة واحدة" : "Your journey to mastery starts with one step";
  const ctaLead = isAr ? "ساعة من الآن يمكنك أن تكتب أول سطر كود لك. بعد ذلك، السماء هي الحد." : "One hour from now you could write your first line of code. From there, the sky is the limit.";
  const ctaLesson = isAr ? "ابدأ الدرس الأول — مجاناً" : "Start the first lesson — free";
  const ctaSources = isAr ? "تصفح المصادر" : "Browse the sources";
  const ctaBooks = isAr ? "الكتب المجانية" : "Free books";
  const freeForever = isAr ? "مجاناً إلى الأبد" : "Free forever";
  const mikuz = isAr ? "يقوّد Miku خطاك" : "Miku guides you";
  const pomodoro = isAr ? "تركيز Pomodoro" : "Pomodoro focus";
  const join = isAr ? "انضم لآلاف المتعلمين العرب —" : "Join thousands of Arabic learners —";
  const freeForever2 = isAr ? "مجاناً إلى الأبد" : "free forever";

  const mikuCopy = isAr
    ? { name: "Miku Chan", buddy: "رفيقة دراستك في ETM", ready: "جاهز متى أرادك — هيا بصناعة! 🎵", missionTitle: "مهمة اليوم", mission: <>أكمل الدرس <b className="text-white">&quot;Hello World&quot;</b> في C++ Basics، ثم شغّله في المحرك.</>, streak: "أيام متتالية", focus: "وقت تركيز", videos: "فيديوهات ElZero" }
    : { name: "Miku Chan", buddy: "Your study buddy at ETM", ready: "Ready when you are — let's code! 🎵", missionTitle: "Today's mission", mission: <>Finish lesson <b className="text-white">&quot;Hello World&quot;</b> in C++ Basics, then run it in the playground.</>, streak: "days streak", focus: "focus time", videos: "ElZero videos" };

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
                  {heroBadge}
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-6 text-[1.9rem] leading-[1.4] sm:text-5xl lg:text-6xl font-black text-white">
                  {heroA}{" "}
                  <span className="gradient-text">{heroAccentA}</span>
                  <br />
                  {heroAccentB}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-lg leading-9 text-slate-400 max-w-xl">{heroLead}</p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={localePath(locale, "/curriculum")} className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow">
                    {ctaStart}
                    <ArrowLeft className="h-5 w-5 ltr:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href={localePath(locale, "/playground")} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-colors">
                    <Play className="h-5 w-5 text-cyan-400" />
                    {ctaPlayground}
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={350}>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href={localePath(locale, "/guide")} className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors">
                    <Terminal className="h-4 w-4" />
                    {ctaGuide}
                  </Link>
                  <Link href={localePath(locale, "/dashboard")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                    {isAr ? "لوحة التحكم" : "Dashboard"}
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
                      <div className="font-black text-white text-lg">{mikuCopy.name}</div>
                      <div className="text-sm text-slate-400">{mikuCopy.buddy}</div>
                      <div className="mt-2 text-xs text-emerald-400 font-bold">{mikuCopy.ready}</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 leading-6">
                    <div className="font-bold text-cyan-400 mb-1">{mikuCopy.missionTitle}</div>
                    <p>{mikuCopy.mission}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">3</div>
                      <div className="text-[11px] text-slate-500">{mikuCopy.streak}</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">25m</div>
                      <div className="text-[11px] text-slate-500">{mikuCopy.focus}</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-2">
                      <div className="font-black text-white text-lg">{videoCount}</div>
                      <div className="text-[11px] text-slate-500">{mikuCopy.videos}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ BRAND BANNER ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-500/10">
            <img
              src="/brand/etm-banner.jpg"
              alt={isAr ? "بانر ETM — منصة التعلّم الإلكتروني الأولى: دورات تفاعلية، محتوى خبير، شهادات وتتبع للتقدم" : "ETM — your ultimate online learning platform: interactive courses, expert content, certificates and progress tracking"}
              width={1600}
              height={900}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </Reveal>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat value={lessonCount} label={statsLessons} />
            <Stat value={courseCount} label={statsCourses} />
            <Stat value={projects.length} label={statsProjects} />
            <Stat value={4} label={statsLevels} />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">{whyEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">{whyTitle}</h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">{whyLead}</p>
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

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-sm font-bold text-cyan-400">{isAr ? "كيف تتعلم" : "How you learn"}</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                {isAr ? "تعلم بطريقة مثبتة" : "Learn with a proven method"}
              </h2>
            </div>
          </Reveal>
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
                  <h3 className="mt-4 text-xl font-bold text-white">{HOW_IT_WORKS_COPY[locale][s.key].title}</h3>
                  <p className="mt-2 text-slate-400 leading-7">{HOW_IT_WORKS_COPY[locale][s.key].desc}</p>
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
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">{ctaTitle}</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-8">{ctaLead}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href={localePath(locale, "/curriculum")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-8 py-4 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow">
                  {ctaLesson}
                  <ArrowLeft className="h-5 w-5 ltr:rotate-180" />
                </Link>
                <Link href={localePath(locale, "/elzero")} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors">
                  <Play className="h-5 w-5 text-cyan-400" />
                  {isAr ? "شاهد فيديوهات ElZero" : "Watch ElZero videos"}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
