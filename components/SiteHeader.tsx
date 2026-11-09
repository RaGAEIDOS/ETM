"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X, Flame } from "lucide-react";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/curriculum", label: "المنهج" },
  { href: "/playground", label: "الملعب" },
  { href: "/projects", label: "المشاريع" },
  { href: "/glossary", label: "المصطلحات" },
  { href: "/progress", label: "تقدّمك" },
  { href: "/sources", label: "المصادر" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              ETM
              <span className="hidden sm:inline text-sm font-medium text-slate-400 mr-2">
                تعلّم البرمجة
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/curriculum"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-90 transition-opacity"
            >
              <Flame className="h-4 w-4" />
              ابدأ الرحلة
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5"
              aria-label="القائمة"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/5 bg-ink-900/95 px-4 py-3 space-y-1">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? "text-cyan-300 bg-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
