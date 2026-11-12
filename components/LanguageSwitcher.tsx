"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  localePath,
  locales,
  stripLocale,
  type Locale,
} from "@/lib/i18n/config";
import { persistLocale, useLocale } from "@/lib/i18n/context";

const LABELS: Record<Locale, string> = { ar: "العربية", en: "EN" };

function Switcher({
  query,
  className = "",
}: {
  query?: string;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const canonical = stripLocale(pathname || "/");

  return (
    <div
      role="group"
      aria-label={locale === "ar" ? "تغيير اللغة" : "Change language"}
      className={`inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5 ${className}`}
    >
      {locales.map((item) => {
        const active = item === locale;
        const href = `${localePath(item, canonical)}${query ? `?${query}` : ""}`;
        return (
          <a
            key={item}
            href={href}
            hrefLang={item}
            lang={item}
            dir={item === "ar" ? "rtl" : "ltr"}
            onClick={() => persistLocale(item)}
            aria-current={active ? "true" : undefined}
            className={`rounded-[10px] px-2.5 py-2 text-xs font-black transition-colors min-h-[36px] flex items-center ${
              active
                ? "bg-cyan-500/20 text-cyan-200"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {LABELS[item]}
          </a>
        );
      })}
    </div>
  );
}

function SwitcherWithQuery({ className }: { className: string }) {
  const searchParams = useSearchParams();
  return <Switcher query={searchParams?.toString()} className={className} />;
}

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  // useSearchParams requires a Suspense boundary during static prerendering.
  return (
    <Suspense fallback={<Switcher className={className} />}>
      <SwitcherWithQuery className={className} />
    </Suspense>
  );
}
