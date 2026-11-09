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
  GitBranch,
  Search,
  Play,
  GraduationCap,
  Github,
} from "lucide-react";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import { projects } from "@/lib/projects";
import HeroTerminal from "@/components/HeroTerminal";
import Stat from "@/components/Stat";
import Reveal from "@/components/Reveal";

const FEATURES = [
  {
    icon: BookOpen,
    title: "منهج كامل من الصفر",
    desc: "منهج جامعي معتمد مبني على OSSU، مُعاد صياغته بالكامل بالعربي — من أول متغير لحد نواة نظام تشغيل.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Search,
    title: "شرح عربي + قاموس مصطلحات",
    desc: "كل مصطلح إنجليزي متشرح بالعربي وموجود في قاموس مخصص — مفيش حاجز لغوي قدامك.",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: Code2,
    title: "ملعب C++ تفاعلي",
    desc: "اكتب وشغّل كود C++ الحقيقي من المتصفح مباشرة، من غير تثبيت أي حاجة — جرّب كل الأمثلة بنفسك.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Target,
    title: "مشاريع حقيقية",
    desc: "من آلة حاسبة بسيطة لحد لعبة Snake بمحرك خاص ونواة نظام تشغيل بتشتغل في QEMU.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Trophy,
    title: "تتبع التقدم",
    desc: "اعرف وصلت فين بالظبط، كام درس خلصت، وإيه المرحلة الجاية — محفوظ على جهازك.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Users,
    title: "مسار مهني واضح",
    desc: "المنهج مصمم لسوق العمل في مصر والعالم العربي: مهارات مطلوبة فعلاً في هندسة الأنظمة والألعاب.",
    color: "from-sky-400 to-indigo-500",
  },
];

const LEVEL_ICONS = [Sparkles, Layers, Cpu, Rocket];

const WHY_CPP = [
  { icon: Zap, title: "السرعة والأداء", desc: "C++ من أسرع اللغات في العالم — بيستخدمها كل ما هو حساس للأداء." },
  { icon: Gamepad2, title: "محركات الألعاب", desc: "Unreal Engine ومحركات الألعاب الكبرى مبنية بـ C++." },
  { icon: Cpu, title: "أنظمة التشغيل", desc: "Windows وLinux وmacOS كلها فيها ملايين أسطر C++." },
  { icon: Shield, title: "تحكم في الذاكرة", desc: "C++ بتعطيك تحكم كامل في الهاردوير والذاكرة — قوة حقيقية." },
];

const SOURCES = [
  { name: "OSSU", desc: "المنهج الأساسي — تعليم جامعي كامل مجاني", url: "https://github.com/ossu/computer-science" },
  { name: "CS50 — Harvard", desc: "أشهر كورس مقدمة لعلوم الكمبيوتر في العالم", url: "https://cs50.harvard.edu/x/" },
  { name: "MIT OpenCourseWare", desc: "دورات MIT المفتوحة: خوارزميات، رياضيات، معمارية", url: "https://ocw.mit.edu/" },
  { name: "Nand2Tetris", desc: "ابنِ كمبيوتر كامل من بوابة NAND", url: "https://www.nand2tetris.org/" },
  { name: "OSTEP", desc: "كتاب أنظمة التشغيل الأشهر — مجاني بالكامل", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
  { name: "Learn C++", desc: "مرجع شامل لتعلم اللغة من الصفر", url: "https://www.learncpp.com/" },
];

const FAQS = [
  {
    q: "مفيش خبرة برمجة خالص. هل المنهج مناسب لي؟",
    a: "أيوه بالظبط. المنهج بيبدأ من الصفر المطلق: أول درس بيعلمك تثبيت المترجم، وتاني درس بيكتب أول سطر كود. المستوى الأول مصمم خصيصاً للي ميسفتوش يتعامل مع الكمبيوتر البرمجي قبل كده.",
  },
  {
    q: "ليه C++ وليست لغة تانية زي Python؟",
    a: "C++ أقوى لغات البرمجة وأصعبها فعلاً — وده سبب قوتها. لما تفهم C++ بعمق، هتفهم إزاي الكمبيوتر بيشتغل من جوا، وأي لغة تانية هتبقى سهلة. وكمان هي اللغة الأساسية في هندسة الأنظمة ومحركات الألعاب، وهي من المهارات الأعلى طلباً في السوق.",
  },
  {
    q: "المنهج مبني على OSSU؟ إيه ده؟",
    a: "OSSU (Open Source Society University) منهج مجاني معتمد بيعادل بكالوريوس علوم كمبيوتر كامل من مصادر عالمية (Harvard, MIT, Stanford). إحنا خدنا هيكل المنهج ومصادره، وكتبناه من جديد بالعربي مع تبسيط وتطبيقات C++.",
  },
  {
    q: "كم وقت محتاج في الأسبوع؟",
    a: "لو بتدفع 10 ساعات أسبوعياً، تقدر تخلص المستوى الأول في شهرين تقريباً. المنهج كامل ممكن ياخد من سنة ونص لسنتين، زي أي شهادة جامعية. المهم الاستمرارية مش السرعة.",
  },
  {
    q: "هل هقدر أشتغل بعد المنهج؟",
    a: "الهدف النهائي هو إنك تبقى مهندس برمجيات قادر على العمل. المشاريع في المرحلة الرابعة (محرك ألعاب، نواة نظام تشغيل، مترجم) هي أقوى مشاريع تقدر تضعها في الـ Portfolio بتاعك وتفتح بيها أبواب الشغل.",
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-semibold text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  منهج OSSU العالمي — بالعربية بالكامل
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.25] text-white">
                  تعلّم البرمجة من{" "}
                  <span className="gradient-text">الصفر</span>
                  <br />
                  إلى بناء{" "}
                  <span className="gradient-text">نظام تشغيل</span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-lg leading-9 text-slate-400 max-w-xl">
                  منصة <strong className="text-white">ETM</strong> بتعلّمك لغة{" "}
                  <strong className="text-cyan-300">C++</strong> بمنهج جامعي كامل،
                  بشرح عربي مبسّط وأمثلة تفاعلية ومشاريع حقيقية — من أول
                  &quot;مرحباً بالعالم&quot; لحد محرك ألعاب ونواة نظام تشغيل بتشتغل
                  فعلاً.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/curriculum"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                  >
                    ابدأ الرحلة مجاناً
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    <Play className="h-5 w-5 text-cyan-400" />
                    جرّب ملعب C++
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2 space-x-reverse">
                    {["أحمد", "سارة", "محمود", "نور"].map((n) => (
                      <span
                        key={n}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-950 bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-xs font-bold text-white"
                      >
                        {n[0]}
                      </span>
                    ))}
                  </div>
                  <span>
                    انضم لآلاف المتعلّمين العرب —{" "}
                    <span className="text-white font-semibold">مجاني للأبد</span>
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="hidden lg:block">
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
            <Stat value={lessonCount} label="درس تفاعلي" />
            <Stat value={courseCount} label="كورس متكامل" />
            <Stat value={projects.length} label="مشروع حقيقي" />
            <Stat value={4} label="مستويات صعوبة" />
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-cyan-400">ليه ETM؟</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              منصة متكاملة الأركان، مش مجرد فيديوهات
            </h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              كل حاجة محتاجها عشان تتعلم من مكان واحد: الدروس، الأمثلة، الملعب،
              المشاريع، والتقدم.
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
              <span className="text-sm font-bold text-cyan-400">مسار التعلم</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                4 مستويات: من سهل جداً لمنتهى الصعوبة
              </h2>
              <p className="mt-4 text-lg text-slate-400 leading-8">
                مسار تدريجي مدروس. كل مستوى بيبني على اللي قبله، وكل درس بيقربك
                خطوة من الاحتراف.
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
                        المستوى {stage.level}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-black text-white">
                      {stage.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-cyan-300">
                      {stage.tagline}
                    </p>
                    <p className="mt-3 text-sm text-slate-400 leading-6 line-clamp-3">
                      {stage.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {stage.courses.length} كورسات · {lessonCountStage} درس
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:gap-2 transition-all">
                        ابدأ
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
            <span className="text-sm font-bold text-cyan-400">طريقة التعلم</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              اتعلم بمنهج مثبت علمياً
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              step: "1",
              title: "اتعلم بالدرس",
              desc: "شرح عربي واضح + أمثلة كود حقيقية + كويز تفاعلي عشان تتأكد إنك فاهم.",
            },
            {
              icon: Code2,
              step: "2",
              title: "طبّق في الملعب",
              desc: "انسخ المثال أو اكتب من دماغك، شغّله في ملعب C++، وجرّب عدّل بنفسك.",
            },
            {
              icon: Target,
              step: "3",
              title: "ابنِ مشروع",
              desc: "في نهاية كل كورس مشروع حقيقي بيجمع كل حاجة اتعلمتها — ودي أحسن طريقة للتثبيت.",
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
                <span className="text-sm font-bold text-cyan-400">ليه C++؟</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
                  اللغة اللي بتفتح لك أبواب{" "}
                  <span className="gradient-text">هندسة الأنظمة</span>
                </h2>
                <p className="mt-4 text-lg text-slate-400 leading-8">
                  C++ مش مجرد لغة برمجة — دي الأداة اللي بتستخدمها أشهر شركات
                  العالم في بناء أقوى الأنظمة. لما تتعلمها، بتتعلم إزاي الكمبيوتر
                  بيشتغل فعلاً.
                </p>
                <Link
                  href="/curriculum"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300"
                >
                  ابدأ بالمستوى الأول
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
            <span className="text-sm font-bold text-cyan-400">مصادر المنهج</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              مبني على أقوى مصادر العالم
            </h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              هيكل المنهج مأخوذ من OSSU، ومدعوم بمصادر Harvard وMIT وStanford
              وNand2Tetris.
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
              <span className="text-sm font-bold text-cyan-400">أسئلة شائعة</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                كل اللي محتاج تعرفها
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
                رحلتك نحو الاحتراف تبدأ بخطوة واحدة
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-8">
                أول درس بعد ساعة من دلوقتي هتكون بايت أول سطر كود في حياتك.
                ومِن هناك، ما له حدود.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-8 py-4 font-bold text-ink-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                >
                  ابدأ أول درس مجاناً
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Link
                  href="/sources"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  استعرض المصادر
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
