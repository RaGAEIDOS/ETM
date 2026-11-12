import type { Metadata } from "next";
import { ExternalLink, Github, Heart, BookOpen } from "lucide-react";
import { stages } from "@/lib/data";
import { OSSU } from "@/lib/stages";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const MAIN_SOURCES: {
  name: string;
  desc: Record<Locale, string>;
  url: string;
  badge: "core" | "reference";
}[] = [
  {
    name: "OSSU — Open Source Society University",
    desc: {
      ar: "المنهج الأساسي. تعليم أكاديمي مجاني كامل في علوم الحاسوب من مصادر معتمدة.",
      en: "The core curriculum. A complete university education in computer science from accredited, free sources.",
    },
    url: OSSU,
    badge: "core",
  },
  {
    name: "CS50 — Harvard",
    desc: {
      ar: "أشهر مقدمة في علوم الحاسوب في العالم — مصدر الإلهام للمستوى الأول.",
      en: "The most famous introduction to computer science in the world, the source of inspiration for level one.",
    },
    url: "https://cs50.harvard.edu/x/",
    badge: "core",
  },
  {
    name: "MIT OpenCourseWare",
    desc: {
      ar: "مقررات MIT المفتوحة: الخوارزميات، رياضيات علوم الحاسوب، وبنية الحاسوب.",
      en: "MIT's open courses: algorithms, math for CS, computer architecture.",
    },
    url: "https://ocw.mit.edu/",
    badge: "core",
  },
  {
    name: "Nand2Tetris",
    desc: {
      ar: "بناء حاسوب كامل من بوابة NAND حتى Tetris — أساس مرحلة البنية المعمارية.",
      en: "Building a complete computer from a NAND gate to Tetris — the foundation of the architecture stage.",
    },
    url: "https://www.nand2tetris.org/",
    badge: "core",
  },
  {
    name: "OSTEP — Operating Systems: Three Easy Pieces",
    desc: {
      ar: "أشهر كتاب في أنظمة التشغيل في العالم، ومجاني بالكامل.",
      en: "The most popular operating systems book in the world, free.",
    },
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    badge: "reference",
  },
  {
    name: "Algorithms Illuminated — Tim Roughgarden",
    desc: {
      ar: "أشهر سلسلة في تحليل وتصميم الخوارزميات في العالم.",
      en: "The most famous series on algorithm analysis and design.",
    },
    url: "https://www.algorithmsilluminated.org/",
    badge: "reference",
  },
  {
    name: "Crafting Interpreters",
    desc: {
      ar: "المرجع في بناء المفسرات والمترجمات — أساس كورس المترجمات.",
      en: "The reference for building interpreters and compilers — the basis of the compilers course.",
    },
    url: "https://craftinginterpreters.com/",
    badge: "reference",
  },
  {
    name: "OSDev Wiki",
    desc: {
      ar: "أشهر ويكي في بناء أنظمة التشغيل من الصفر.",
      en: "The most famous wiki for building operating systems from scratch.",
    },
    url: "https://wiki.osdev.org/",
    badge: "reference",
  },
  {
    name: "Learn C++",
    desc: {
      ar: "مرجع شامل وعملي لتعلم C++ من الصفر.",
      en: "A comprehensive and practical reference for learning C++ from zero.",
    },
    url: "https://www.learncpp.com/",
    badge: "reference",
  },
  {
    name: "Game Engine Architecture — Jason Gregory",
    desc: {
      ar: "المرجع في برمجة محركات الألعاب الاحترافية.",
      en: "The reference for programming professional game engines.",
    },
    url: "https://www.gameenginebook.com/",
    badge: "reference",
  },
  {
    name: "Designing Data-Intensive Applications",
    desc: {
      ar: "المرجع في الأنظمة الموزعة وقواعد البيانات.",
      en: "The reference for distributed systems and databases.",
    },
    url: "https://dataintensive.net/",
    badge: "reference",
  },
  {
    name: "The Missing Semester — MIT",
    desc: {
      ar: "أدوات المطورين: سطر الأوامر، Git، ومحررات الأكواد.",
      en: "Developer tools: the command line, Git, and code editors.",
    },
    url: "https://missing.csail.mit.edu/",
    badge: "reference",
  },
];

const COPY = {
  ar: {
    metaTitle: "المصادر",
    metaDescription:
      "كل المصادر والمراجع التي بُني عليها منهج ETM — OSSU و CS50 و MIT و Stanford و Nand2Tetris والمزيد.",
    eyebrow: "مصادر المنهج",
    titleLead: "مبني على",
    titleHighlight: "أقوى المصادر في العالم",
    intro1: "منهج ETM متجذر في منهج",
    intro2: "، مدعوماً بمصادر من Harvard و MIT و Stanford — مع إعادة كتابة كاملة بالعربية وتطبيقات C++.",
    core: "أساسي",
    reference: "مرجع",
    perStage: "المصادر حسب المستوى",
    level: (n: number) => `المستوى ${n}`,
    disclaimerTitle: "إخلاء المسؤولية",
    disclaimer:
      "المحتوى التعليمي في ETM مكتوب أصلاً بالعربية، لكن الهيكل والمنهجية مستوحاة من المصادر المفتوحة أعلاه ومذكورة بأسماء مؤلفيها. كل مصدر مرتبط بصفحته الرسمية، ونحترم حقوق الملكية الفكرية لكل طرف.",
    ossuLicense: "رخصة OSSU (MIT)",
  },
  en: {
    metaTitle: "Sources",
    metaDescription:
      "All the sources and references ETM curriculum is built on — OSSU, CS50, MIT, Stanford, Nand2Tetris, and more.",
    eyebrow: "Curriculum sources",
    titleLead: "Built on",
    titleHighlight: "the strongest sources",
    intro1: "The ETM curriculum is rooted in the",
    intro2:
      "curriculum, supported by sources from Harvard, MIT and Stanford — with a full Arabic rewrite and C++ applications.",
    core: "Core",
    reference: "Reference",
    perStage: "Sources per stage",
    level: (n: number) => `Level ${n}`,
    disclaimerTitle: "Disclaimer",
    disclaimer:
      "The ETM educational content is originally written in Arabic, but the structure and methodology are inspired by the open sources above and mentioned by their authors' names. Every source is linked to its official page, and we respect the intellectual property rights of each party.",
    ossuLicense: "OSSU license (MIT)",
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
    path: "/sources",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function SourcesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold text-cyan-400">{c.eyebrow}</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          {c.titleLead}{" "}
          <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          {c.intro1}{" "}
          <a
            href={OSSU}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            OSSU
          </a>{" "}
          {c.intro2}
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
                {s.badge === "core" ? c.core : c.reference}
              </span>
              <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h3 className="mt-3 font-bold text-white group-hover:text-cyan-300 transition-colors leading-7" dir="auto">
              {s.name}
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-6 flex-1">
              {s.desc[locale]}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-cyan-400" />
          {c.perStage}
        </h2>
        <div className="space-y-8">
          {stages.map((stage) => (
            <div key={stage.id}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-cyan-300 mb-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full bg-gradient-to-l ${stage.color}`}
                />
                {c.level(stage.level)}: {stage.nameEn}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {stage.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <h4 className="font-bold text-white text-sm" dir="rtl">
                      {course.title}
                    </h4>
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
        <h2 className="text-2xl font-black text-white">{c.disclaimerTitle}</h2>
        <p className="mt-3 text-slate-400 leading-8 max-w-2xl mx-auto">
          {c.disclaimer}
        </p>
        <a
          href="https://github.com/ossu/computer-science/blob/master/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline"
        >
          <Github className="h-4 w-4" />
          {c.ossuLicense}
        </a>
      </div>
    </div>
  );
}
