"use client";

import NextLink, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { localePath, stripLocale, type Locale } from "./config";
import { useLocale } from "./context";

type LocaleLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: LinkProps["href"];
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: false;
};

function localizeHref(locale: Locale, href: LinkProps["href"]): LinkProps["href"] {
  if (typeof href === "string") return localePath(locale, href);
  if (href && typeof href === "object" && typeof href.pathname === "string") {
    return { ...href, pathname: localePath(locale, href.pathname) };
  }
  return href;
}

/** Drop-in replacement for next/link that keeps the active locale prefix. */
export default function Link({ href, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  return <NextLink href={localizeHref(locale, href)} {...props} />;
}

/** Returns a function that turns an unprefixed path into a locale-aware path. */
export function useLocaleHref() {
  const locale = useLocale();
  return (href: string) => localePath(locale, href);
}

/** Router helpers that automatically keep the active locale. */
export function useLocaleRouter() {
  const locale = useLocale();
  const router = useRouter();
  return {
    push(href: string) {
      router.push(localePath(locale, href));
    },
    replace(href: string) {
      router.replace(localePath(locale, href));
    },
    back() {
      router.back();
    },
  };
}

/** Current path without the locale prefix (for the language switcher). */
export function useCanonicalPathname(): string {
  const pathname = usePathname();
  return stripLocale(pathname || "/");
}
