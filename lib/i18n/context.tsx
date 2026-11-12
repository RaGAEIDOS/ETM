"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  dirFor,
  htmlLangFor,
  type Locale,
} from "./config";

const LocaleContext = createContext<Locale>(defaultLocale);

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function persistLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem("etm-locale", locale);
  } catch {
    // storage can be unavailable in private mode; the URL still carries the locale
  }
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  // Keep <html> in sync during client-side navigations between locales.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLangFor(locale);
    root.dir = dirFor(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * Pick the active translation from a component-local ar/en copy object.
 * Keeping copy next to the component makes it obvious when a string is still
 * untranslated, and avoids one giant dictionary drifting out of sync.
 */
export function useCopy<T extends { ar: unknown; en: unknown }>(
  copy: T
): T[Locale] {
  return copy[useLocale()] as T[Locale];
}
