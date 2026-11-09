"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X, Flame, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/curriculum", label: "المنهج" },
  { href: "/elzero", label: "فيديوهات الزيرو" },
  { href: "/playground", label: "الملعب" },
  { href: "/projects", label: "المشاريع" },
  { href: "/glossary", label: "المصطلحات" },
  { href: "/progress", label: "تقدّمك" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, ready } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-16 items-center justify-between py-2">
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
            {ready && user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 min-h-[44px]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 text-xs font-black">
                  {user.name[0] || "؟"}
                </span>
                <span className="hidden sm:inline max-w-24 truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 min-h-[44px]"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">دخول</span>
              </Link>
            )}
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-3 sm:px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <Flame className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">ابدأ الرحلة</span>
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-lg text-slate-300 hover:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="القائمة"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/5 bg-ink-900/95 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center ${
                  active
                    ? "text-cyan-300 bg-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {!user && (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center text-white bg-white/5 border border-white/10"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
              >
                إنشاء حساب
              </Link>
            </>
          )}
          {user && (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
            >
              ملفي الشخصي — {user.name}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
