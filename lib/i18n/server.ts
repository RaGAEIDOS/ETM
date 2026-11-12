import type { Metadata } from "next";
import {
  defaultLocale,
  dirFor,
  htmlLangFor,
  localePath,
  type Locale,
} from "./config";

export function localeFromParams(params: { locale?: string }): Locale {
  return params.locale === "en" ? "en" : defaultLocale;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = localePath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ar: localePath("ar", path),
        en: localePath("en", path),
        "x-default": localePath("ar", path),
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      url: canonical,
    },
  };
}

export function dirProps(locale: Locale) {
  return { lang: htmlLangFor(locale), dir: dirFor(locale) };
}
