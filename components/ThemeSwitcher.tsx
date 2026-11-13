"use client";

/**
 * Site theme switcher. Themes only change presentation tokens (background,
 * accent, selection, scrollbar, gradient text); they never touch URLs,
 * content or stored progress.
 *
 * Default: "miku" — the existing cyan/violet look.
 * "bootcamp"  — deep navy + warm orange, inspired by coding bootcamps.
 * "codecademy" — near-black + bright yellow, inspired by Codecademy.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { Check, Palette } from "lucide-react";

export type ThemeId = "miku" | "bootcamp" | "codecademy";

const THEME_KEY = "etm-theme-v1";

const THEMES: { id: ThemeId; swatch: string }[] = [
  { id: "miku", swatch: "from-cyan-400 to-violet-500" },
  { id: "bootcamp", swatch: "from-orange-400 to-indigo-500" },
  { id: "codecademy", swatch: "from-yellow-300 to-sky-400" },
];

const COPY = {
  ar: {
    label: "المظهر",
    miku: "Miku",
    bootcamp: "Bootcamp",
    codecademy: "Codecademy",
    note: "المظهر يغيّر الألوان فقط — لا يمس تقدمك أو الروابط.",
  },
  en: {
    label: "Theme",
    miku: "Miku",
    bootcamp: "Bootcamp",
    codecademy: "Codecademy",
    note: "Themes only change colours — never your progress or links.",
  },
} as const;

function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage may be blocked */
  }
}

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const c = useCopy(COPY);
  const [theme, setTheme] = useState<ThemeId>("miku");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "bootcamp" || saved === "codecademy" || saved === "miku") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: ThemeId) => {
    setTheme(next);
    applyTheme(next);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${c.label}: ${c[theme]}`}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/10 min-h-[44px]"
      >
        <Palette className="h-4 w-4 text-[rgb(var(--etm-accent))]" />
        <span className="hidden xl:inline">{c[theme]}</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label={c.label}
          className="absolute end-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-xl backdrop-blur"
        >
          {THEMES.map((item) => {
            const active = item.id === theme;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                  active
                    ? "bg-white/10 font-bold text-white"
                    : "font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`h-5 w-5 shrink-0 rounded-full bg-gradient-to-br ${item.swatch}`}
                  aria-hidden
                />
                <span className="flex-1">{c[item.id]}</span>
                {active && <Check className="h-4 w-4 text-[rgb(var(--etm-accent))]" />}
              </button>
            );
          })}
          <p className="px-3 py-2 text-[10px] leading-4 text-slate-500">{c.note}</p>
        </div>
      )}
    </div>
  );
}
