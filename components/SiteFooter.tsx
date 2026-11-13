"use client";

import { Github, Heart } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { useCopy } from "@/lib/i18n/context";

const COPY = {
  ar: {
    blurb:
      "منصة عربية مجانية لتعلم C++ من الصفر حتى بناء نظام تشغيل ومحرك ألعاب. مبنية على منهج OSSU، معاد كتابتها بالعربية مع أمثلة تفاعلية ومشاريع حقيقية.",
    platform: "المنصة",
    curriculum: "المنهج",
    elzero: "فيديوهات ElZero",
    elzeroWeb: "مسار الويب ElZero",
    english: "قسم الإنجليزية",
    programmingadvices: "Programming Advices",
    cs50x: "مسار CS50x",
    leaderboard: "صدارة المتعلمين",
    linux: "قسم لينكس",
    playground: "محرر C++",
    projects: "المشاريع",
    glossary: "المصطلحات",
    books: "كتب مجانية",
    dashboard: "لوحة التقدم",
    sources: "المصادر المفتوحة",
    made: "صُنعت بـ",
    forCommunity: "من أجل المجتمع العربي — معرفة مجانية للجميع.",
    openSource: "مفتوح المصدر على GitHub",
  },
  en: {
    blurb:
      "A free platform for learning C++ from zero to building an operating system and a game engine. Based on the OSSU curriculum, with interactive examples and real projects.",
    platform: "Platform",
    curriculum: "Curriculum",
    elzero: "ElZero Videos",
    elzeroWeb: "ElZero Web Track",
    english: "English Section",
    programmingadvices: "Programming Advices",
    cs50x: "CS50x Track",
    leaderboard: "Front-Runners",
    linux: "Linux Section",
    playground: "C++ Playground",
    projects: "Projects",
    glossary: "Glossary",
    books: "Free Books",
    dashboard: "Dashboard",
    sources: "Open Sources",
    made: "Made with",
    forCommunity: "for the Arabic community — free knowledge for everyone.",
    openSource: "Open source on GitHub",
  },
} as const;

export default function SiteFooter() {
  const c = useCopy(COPY);
  return (
    <footer className="border-t border-white/5 bg-ink-900/60 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center group" aria-label="ETM — Education Technology Miku">
              <img
                src="/brand/main-logo.png"
                alt="ETM — Education Technology Miku"
                width={768}
                height={512}
                loading="lazy"
                className="h-16 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-slate-400 leading-7 max-w-md">
              {c.blurb}{" "}
              <a
                href="https://github.com/ossu/computer-science"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline"
                dir="ltr"
              >
                OSSU
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{c.platform}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/curriculum" className="hover:text-cyan-300 transition-colors">{c.curriculum}</Link></li>
              <li><Link href="/elzero" className="hover:text-cyan-300 transition-colors">{c.elzero}</Link></li>
              <li><Link href="/elzero-web" className="hover:text-cyan-300 transition-colors">{c.elzeroWeb}</Link></li>
              <li><Link href="/english" className="hover:text-cyan-300 transition-colors">{c.english}</Link></li>
              <li><Link href="/programmingadvices" className="hover:text-cyan-300 transition-colors">{c.programmingadvices}</Link></li>
              <li><Link href="/cs50x" className="hover:text-cyan-300 transition-colors">{c.cs50x}</Link></li>
              <li><Link href="/leaderboard" className="hover:text-cyan-300 transition-colors">{c.leaderboard}</Link></li>
              <li><Link href="/linux" className="hover:text-cyan-300 transition-colors">{c.linux}</Link></li>
              <li><Link href="/playground" className="hover:text-cyan-300 transition-colors">{c.playground}</Link></li>
              <li><Link href="/projects" className="hover:text-cyan-300 transition-colors">{c.projects}</Link></li>
              <li><Link href="/glossary" className="hover:text-cyan-300 transition-colors">{c.glossary}</Link></li>
              <li><Link href="/books" className="hover:text-cyan-300 transition-colors">{c.books}</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">{c.dashboard}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{c.sources}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="https://github.com/ossu/computer-science" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">
                  OSSU Computer Science
                </a>
              </li>
              <li>
                <a href="https://cs50.harvard.edu/x/" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">
                  CS50 — Harvard
                </a>
              </li>
              <li>
                <a href="https://www.learncpp.com/" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">
                  Learn C++
                </a>
              </li>
              <li>
                <a href="https://www.nand2tetris.org/" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors">
                  Nand2Tetris
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p className="flex items-center gap-1.5">
            {c.made} <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />{" "}
            {c.forCommunity}
          </p>
          <a
            href="https://github.com/RaGAEIDOS/ETM"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <Github className="h-4 w-4" />
            {c.openSource}
          </a>
        </div>
      </div>
    </footer>
  );
}
