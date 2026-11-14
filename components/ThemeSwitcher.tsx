"use client";

/**
 * Four-theme pill: sun / moon / terminal prompt / cup.
 * - Persists the choice in `etm-theme-v2` (with migration from the old key).
 * - Applies the theme via `lib/theme.ts`, which also notifies Miku.
 * - Themes only change presentation tokens: never URLs, content or progress.
 */

import { useEffect, useState } from "react";
import { Coffee, Moon, SquareTerminal, Sun } from "lucide-react";
import { useCopy } from "@/lib/i18n/context";
import {
  applyTheme,
  isThemeId,
  readAppliedTheme,
  readStoredTheme,
  syncThemeColor,
  THEME_EVENT,
  THEME_IDS,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/lib/theme";

const ICONS = {
  light: Sun,
  dark: Moon,
  terminal: SquareTerminal,
  cozy: Coffee,
} as const;

const COPY = {
  ar: {
    label: "المظهر",
    light: "فاتح",
    dark: "داكن",
    terminal: "Terminal",
    cozy: "Cozy",
    note: "المظهر يغيّر الألوان فقط — لا يمس تقدمك أو الروابط.",
  },
  en: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    terminal: "Terminal",
    cozy: "Cozy",
    note: "Themes only change colours — never your progress or links.",
  },
} as const;

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const c = useCopy(COPY);
  const [theme, setTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    // The pre-paint script already applied a theme; mirror it in the UI and
    // make sure the browser-chrome colour matches.
    const initial = readStoredTheme() ?? readAppliedTheme();
    applyTheme(initial, { persist: false, animate: false });
    setTheme(initial);
    // Next hydrates <head> after this effect in some cases; re-sync the
    // browser-chrome colour once the document head is complete.
    const metaTimer = window.setTimeout(() => syncThemeColor(initial), 0);

    const onThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: ThemeId }>).detail;
      if (detail && isThemeId(detail.theme)) setTheme(detail.theme);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (isThemeId(event.newValue)) {
        document.documentElement.dataset.theme = event.newValue;
        setTheme(event.newValue);
      }
    };

    document.addEventListener(THEME_EVENT, onThemeChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(metaTimer);
      document.removeEventListener(THEME_EVENT, onThemeChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const choose = (next: ThemeId) => {
    const same = next === theme;
    applyTheme(next, { animate: !same });
    setTheme(next);
  };

  return (
    <div
      role="group"
      aria-label={c.label}
      title={c.note}
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-0.5 ${className}`}
    >
      {THEME_IDS.map((id) => {
        const Icon = ICONS[id];
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            aria-pressed={active}
            aria-label={`${c.label}: ${c[id]}`}
            title={c[id]}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:h-8 lg:w-8 ${
              active
                ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
