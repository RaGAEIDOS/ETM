export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const localeLabels: Record<Locale, string> = {
  ar: "AR",
  en: "EN",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

/**
 * Arabic (the default locale) keeps the legacy, unprefixed URLs so every
 * existing link and bookmark keeps resolving to Arabic content. English lives
 * under `/en/...`.
 */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (locale === "ar") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Strip an optional locale prefix, returning a canonical unprefixed path. */
export function stripLocale(path: string): string {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  if (path === "/ar") return "/";
  if (path.startsWith("/ar/")) return path.slice(3) || "/";
  return path;
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function htmlLangFor(locale: Locale): string {
  return locale === "ar" ? "ar" : "en";
}

/** Western digits everywhere, regardless of the device locale. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
