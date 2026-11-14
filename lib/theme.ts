/**
 * Site theme engine (shared by the pre-paint script and the switcher).
 *
 * Four themes: light / dark / terminal / cozy.
 * - `dark` is the default look (deep navy + cyan/violet).
 * - `light` is the white + purple Codecademy-inspired look.
 * - `terminal` is green-on-black with a monospace body and CRT scanlines.
 * - `cozy` is warm dark with amber, made to pair with lofi music.
 *
 * Themes only touch presentation tokens. They never change URLs, content or
 * stored learning progress.
 */

export type ThemeId = "light" | "dark" | "terminal" | "cozy";

export const THEME_IDS: readonly ThemeId[] = ["light", "dark", "terminal", "cozy"] as const;

export const THEME_STORAGE_KEY = "etm-theme-v2";
export const LEGACY_THEME_STORAGE_KEY = "etm-theme-v1";

/** Fired on `document` whenever the theme changes. `detail.theme` is a ThemeId. */
export const THEME_EVENT = "etm:themechange";

/** Old 3-theme values -> new four-theme system. */
export const LEGACY_THEME_MAP: Record<string, ThemeId> = {
  miku: "dark",
  bootcamp: "dark",
  codecademy: "terminal",
};

/**
 * Browser chrome colours. These mirror the CSS token values (metadata cannot
 * read CSS custom properties at build time, so the canonical values live here).
 */
export const THEME_COLORS: Record<ThemeId, { page: string; accent: string }> = {
  light: { page: "#ffffff", accent: "#7c3aed" },
  dark: { page: "#05070f", accent: "#22d3ee" },
  terminal: { page: "#0a0a0a", accent: "#00ff41" },
  cozy: { page: "#1c1410", accent: "#f59e0b" },
};

/**
 * Initial default when the visitor has never picked a theme:
 * - 22:00–06:00 local time -> dark (night reading),
 * - otherwise follow `prefers-color-scheme` but only between light and dark;
 *   terminal and cozy are always explicit opt-ins.
 */
export function resolveInitialTheme(
  date: Date = new Date(),
  prefersLight = false
): ThemeId {
  const hour = date.getHours();
  if (hour >= 22 || hour < 6) return "dark";
  return prefersLight ? "light" : "dark";
}

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

/** Reads the theme saved by this version, migrating the legacy key if needed. */
export function readStoredTheme(): ThemeId | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(saved)) return saved;
    const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (legacy && LEGACY_THEME_MAP[legacy]) {
      const migrated = LEGACY_THEME_MAP[legacy];
      window.localStorage.setItem(THEME_STORAGE_KEY, migrated);
      return migrated;
    }
  } catch {
    /* storage blocked or unavailable */
  }
  return null;
}

/** Theme currently applied to <html> (set before paint by the inline script). */
export function readAppliedTheme(): ThemeId {
  if (typeof document === "undefined") return "dark";
  const value = document.documentElement.dataset.theme;
  return isThemeId(value) ? value : "dark";
}

function syncMetaThemeColor(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme].page);
}

/** Public so the switcher can re-sync after React hydrates the document head. */
export function syncThemeColor(theme: ThemeId) {
  syncMetaThemeColor(theme);
}

/**
 * Applies a theme to <html>, persists it and notifies the app (Miku listens for
 * the mood change). The optional `theme-switching` class enables the 150ms
 * background/colour-only transition without touching component transitions.
 */
export function applyTheme(
  theme: ThemeId,
  options: { persist?: boolean; animate?: boolean } = {}
) {
  if (typeof document === "undefined") return;
  const { persist = true, animate = true } = options;
  const root = document.documentElement;
  root.dataset.theme = theme;

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage blocked */
    }
  }

  if (animate) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 220);
  }

  syncMetaThemeColor(theme);
  document.dispatchEvent(
    new CustomEvent(THEME_EVENT, { detail: { theme } })
  );
}

/**
 * Pre-paint inline script: runs in <head> before the first paint so the correct
 * theme is present immediately (no flash of the wrong theme). Kept as a string
 * because it must execute before React hydrates.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;var t=null;var persisted=false;try{t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'&&t!=='terminal'&&t!=='cozy'){var o=localStorage.getItem('${LEGACY_THEME_STORAGE_KEY}');if(o==='miku'||o==='bootcamp'){t='dark';persisted=true;}else if(o==='codecademy'){t='terminal';persisted=true;}else{t=null;}}}catch(e){t=null;}if(t!=='light'&&t!=='dark'&&t!=='terminal'&&t!=='cozy'){var h=new Date().getHours();if(h>=22||h<6){t='dark';}else{var p=false;try{p=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches);}catch(e){}t=p?'light':'dark';}}if(persisted){try{localStorage.setItem('${THEME_STORAGE_KEY}',t);}catch(e){}}d.setAttribute('data-theme',t);})();`;
