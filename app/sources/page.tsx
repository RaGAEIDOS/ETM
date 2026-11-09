import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Github, Heart, BookOpen } from "lucide-react";
import { stages } from "@/lib/data";
import { OSSU } from "@/lib/stages";

export const metadata: Metadata = {
  title: "المصادر",
  description:
    "كل المصادر والمراجع اللي بُني عليها منهج ETM — OSSU وCS50 وMIT وStanford وNand2Tetris وغيرهم.",
};

const MAIN_SOURCES = [
  {
    name: "OSSU — Open Source Society University",
    desc: "المنهج الأساسي. تعليم جامعي كامل في علوم الكمبيوتر من مصادر مجانية معتمدة.",
    url: OSSU,
    badge: "أساسي",
  },
  {
    name: "CS50 — Harvard",
    desc: "أشهر كورس مقدمة لعلوم الكمبيوتر في العالم، مصدر إلهام المستوى الأول.",
    url: "https://cs50.harvard.edu/x/",
    badge: "أساسي",
  },
  {
    name: "MIT OpenCourseWare",
    desc: "دورات MIT المفتوحة: خوارزميات، رياضيات لعلوم الكمبيوتر، معمارية الحاسب.",
    url: "https://ocw.mit.edu/",
    badge: "أساسي",
  },
  {
    name: "Nand2Tetris",
    desc: "بناء كمبيوتر كامل من بوابة NAND لحد لعبة Tetris — أساس مرحلة المعمارية.",
    url: "https://www.nand2tetris.org/",
    badge: "أساسي",
  },
  {
    name: "OSTEP — Operating Systems: Three Easy Pieces",
    desc: "كتاب أنظمة التشغيل الأشهر في العالم، مجاني بالكامل.",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    badge: "مرجع",
  },
  {
    name: "Algorithms Illuminated — Tim Roughgarden",
    desc: "السلسلة الأشهر في تحليل وتصميم الخوارزميات.",
    url: "https://www.algorithmsilluminated.org/",
    badge: "مرجع",
  },
  {
    name: "Crafting Interpreters",
    desc: "مرجع بناء المترجمات والمفسّرات — أساس كورس المترجمات.",
    url: "https://craftinginterpreters.com/",
    badge: "مرجع",
  },
  {
    name: "OSDev Wiki",
    desc: "الموسوعة الأشهر لبناء أنظمة التشغيل من الصفر.",
    url: "https://wiki.osdev.org/",
    badge: "مرجع",
  },
  {
    name: "Learn C++",
    desc: "مرجع شامل وعملي لتعلم لغة C++ من الصفر.",
    url: "https://www.learncpp.com/",
    badge: "مرجع",
  },
  {
    name: "Game Engine Architecture — Jason Gregory",
    desc: "المرجع الأساسي لبرمجة محركات الألعاب الاحترافية.",
    url: "https://www.gameenginebook.com/",
    badge: "مرجع",
  },
  {
    name: "Designing Data-Intensive Applications",
    desc: "المرجع الأساسي للأنظمة الموزعة وقواعد البيانات.",
    url: "https://dataintensive.net/",
    badge: "مرجع",
  },
  {
    name: "The Missing Semester — MIT",
    desc: "أدوات المبرمج: سطر الأوامر، Git، ومحررات الأكواد.",
    url: "https://missing.csail.mit.edu/",
    badge: "مرجع",
  },
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold text-cyan-400">مصادر المنهج</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          مبني على <span className="gradient-text">أقوى مصادر العالم</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          منهج ETM متجذر في منهج{" "}
          <a
            href={OSSU}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            OSSU
          </a>{" "}
          المعتمد، ومدعوم بمصادر من Harvard وMIT وStanford — مع إعادة صياغة
          كاملة بالعربي وتطبيقات C++.
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
          مصادر كل مرحلة
        </h2>
        <div className="space-y-8">
          {stages.map((stage) => (
            <div key={stage.id}>
              <h3 className="flex items-center gap-2 text-lg font-bold text-cyan-300 mb-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full bg-gradient-to-l ${stage.color}`}
                />
                المستوى {stage.level}: {stage.name}
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
        <h2 className="text-2xl font-black text-white">إخلاء مسؤولية</h2>
        <p className="mt-3 text-slate-400 leading-8 max-w-2xl mx-auto">
          محتوى ETM التعليمي مكتوب أصالةً بالعربية، لكن الهيكل والمنهجية
          مستوحاة من المصادر المفتوحة أعلاه والمذكورة بأسماء أصحابها. كل مصدر
          مرتبط بصفحته الرسمية، ونحترم حقوق الملكية الفكرية لكل جهة.
        </p>
        <a
          href="https://github.com/ossu/computer-science/blob/master/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline"
        >
          <Github className="h-4 w-4" />
          ترخيص OSSU (MIT)
        </a>
      </div>
    </div>
  );
}
