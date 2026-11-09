import Link from "next/link";
import { Terminal, Github, Heart } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-ink-900/60 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950">
                <Terminal className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-black text-white">ETM</span>
            </div>
            <p className="text-slate-400 leading-7 max-w-md">
              منصة عربية مجانية لتعلّم البرمجة بلغة C++ من الصفر حتى بناء نظام
              تشغيل ومحرك ألعاب. مبنية على منهج{" "}
              <a
                href="https://github.com/ossu/computer-science"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline"
              >
                OSSU
              </a>{" "}
              العالمي، ومُعدّلة بعناية لتناسب سوق العمل في مصر والعالم العربي.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">المنصة</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/curriculum" className="hover:text-cyan-300 transition-colors">المنهج الكامل</Link></li>
              <li><Link href="/playground" className="hover:text-cyan-300 transition-colors">ملعب C++</Link></li>
              <li><Link href="/projects" className="hover:text-cyan-300 transition-colors">المشاريع</Link></li>
              <li><Link href="/glossary" className="hover:text-cyan-300 transition-colors">قاموس المصطلحات</Link></li>
              <li><Link href="/progress" className="hover:text-cyan-300 transition-colors">تتبع التقدم</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">مصادر مفتوحة</h4>
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
            صُنع بـ <Heart className="h-4 w-4 text-rose-400 fill-rose-400" /> للمجتمع العربي — معرفة مجانية للجميع
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <Github className="h-4 w-4" />
            مفتوح المصدر على GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
