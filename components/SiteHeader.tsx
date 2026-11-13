"use client";


import { useEffect, useRef, useState } from "react";
import { Terminal, Menu, X, Flame, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "@/lib/i18n/navigation";
import { useCanonicalPathname } from "@/lib/i18n/navigation";
import { useCopy } from "@/lib/i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV = [
  { href: "/", key: "home" },
  { href: "/curriculum", key: "curriculum" },
  { href: "/cs50x", key: "cs50x" },
  { href: "/playground", key: "playground" },
  { href: "/projects", key: "projects" },
  { href: "/glossary", key: "glossary" },
  { href: "/books", key: "books" },
  { href: "/dashboard", key: "dashboard" },
  { href: "/leaderboard", key: "leaderboard" },
] as const;

/** Course tracks grouped under the "Courses" dropdown (URLs unchanged). */
const COURSE_LINKS = [
  { href: "/elzero", key: "elzero" },
  { href: "/english", key: "english" },
  { href: "/linux", key: "linux" },
] as const;

const COPY = {
  ar: {
    home: "الرئيسية",
    curriculum: "المنهج",
    courses: "الدورات",
    elzero: "ElZero",
    english: "الإنجليزية",
    cs50x: "CS50x من Harvard",
    linux: "لينكس",
    playground: "المحرر",
    leaderboard: "صدارة المتعلمين",
    projects: "المشاريع",
    glossary: "المصطلحات",
    books: "الكتب",
    dashboard: "لوحتي",
    signIn: "تسجيل الدخول",
    start: "ابدأ التعلم",
    menu: "القائمة",
    signInGithub: "الدخول بحساب GitHub",
    profile: "الملف الشخصي",
  },
  en: {
    home: "Home",
    curriculum: "Curriculum",
    courses: "Courses",
    elzero: "ElZero",
    english: "English",
    cs50x: "CS50x — Harvard",
    linux: "Linux",
    playground: "Playground",
    leaderboard: "Front-Runners",
    projects: "Projects",
    glossary: "Glossary",
    books: "Books",
    dashboard: "Dashboard",
    signIn: "Sign in",
    start: "Start learning",
    menu: "Menu",
    signInGithub: "Sign in with GitHub",
    profile: "Profile",
  },
} as const;

export default function SiteHeader() {
  const canonical = useCanonicalPathname();
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const coursesRef = useRef<HTMLDivElement>(null);
  const { user, ready } = useAuth();
  const c = useCopy(COPY);
  // Guest-only marketing landing: no app navigation tabs at all
  const bare = canonical === "/landing";

  // Close menus on navigation
  useEffect(() => {
    setOpen(false);
    setCoursesOpen(false);
  }, [canonical]);

  // Close the courses dropdown on outside click / Escape
  useEffect(() => {
    if (!coursesOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (coursesRef.current && !coursesRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCoursesOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [coursesOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? canonical === "/"
      : canonical === href || canonical.startsWith(`${href}/`);

  const coursesActive = COURSE_LINKS.some((l) => isActive(l.href));
  const navBeforeCourses = NAV.slice(0, 2); // home + curriculum
  const navAfterCourses = NAV.slice(2);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-16 items-center justify-between gap-2 py-2">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              ETM
              <span className="hidden md:inline text-xs font-medium text-slate-400 ms-2">
                Education Technology Miku
              </span>
            </span>
          </Link>

          {!bare && (
            <nav
              aria-label={c.menu}
              className="hidden lg:flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {navBeforeCourses.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? "text-cyan-300 bg-cyan-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {c[item.key]}
                  </Link>
                );
              })}
              <div className="relative" ref={coursesRef}>
                <button
                  type="button"
                  onClick={() => setCoursesOpen((v) => !v)}
                  aria-expanded={coursesOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 px-2 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                    coursesActive
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {c.courses}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${coursesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {coursesOpen && (
                  <div
                    role="menu"
                    aria-label={c.courses}
                    className="absolute start-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-xl backdrop-blur"
                  >
                    {COURSE_LINKS.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                            active
                              ? "font-bold text-cyan-300 bg-cyan-500/10"
                              : "font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {c[item.key]}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              {navAfterCourses.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? "text-cyan-300 bg-cyan-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {c[item.key]}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            {ready && user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 min-h-[44px]"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 text-xs font-black">
                    {user.name[0] || "?"}
                  </span>
                )}
                <span className="hidden sm:inline max-w-24 truncate">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 min-h-[44px]"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{c.signIn}</span>
              </Link>
            )}
            {!bare && (
              <Link
                href="/curriculum"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-3 sm:px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-90 transition-opacity min-h-[44px]"
              >
                <Flame className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{c.start}</span>
              </Link>
            )}
            {!bare && (
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2.5 rounded-lg text-slate-300 hover:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={c.menu}
                aria-expanded={open}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {open && !bare && (
        <nav className="lg:hidden border-t border-white/5 bg-ink-900/95 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <div className="px-3 pb-2 sm:hidden">
            <LanguageSwitcher />
          </div>
          {navBeforeCourses.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center ${
                  active
                    ? "text-cyan-300 bg-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {c[item.key]}
              </Link>
            );
          })}
          <p className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
            {c.courses}
          </p>
          <div className="ms-3 border-s border-white/10 ps-3 space-y-1">
            {COURSE_LINKS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center ${
                    active
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {c[item.key]}
                </Link>
              );
            })}
          </div>
          {navAfterCourses.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center ${
                  active
                    ? "text-cyan-300 bg-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {c[item.key]}
              </Link>
            );
          })}
          {!user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
            >
              {c.signInGithub}
            </Link>
          )}
          {user && (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-semibold min-h-[48px] flex items-center text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
            >
              {c.profile} — {user.name}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
