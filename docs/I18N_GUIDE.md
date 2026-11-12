# Phase 2 i18n implementation rules

Two locales only: `ar` (default, unprefixed URLs) and `en` (`/en/...`).
`<html lang dir>` is set by `app/[locale]/layout.tsx`; never hardcode it in pages.

## Client components

```tsx
"use client";
import Link from "@/lib/i18n/navigation";
import { useCopy } from "@/lib/i18n/context";

const COPY = {
  ar: { title: "…", button: "…" },
  en: { title: "…", button: "…" },
} as const;

export default function Thing() {
  const c = useCopy(COPY);
  return <Link href="/curriculum">{c.button}</Link>;
}
```

- `useLocale()` from `@/lib/i18n/context` returns `"ar" | "en"`.
- `useLocaleHref()` returns a function that prefixes `/en` when needed.
- `useLocaleRouter()` gives locale-aware `push` / `replace`.
- Replace every `next/link` import with `@/lib/i18n/navigation` in UI files.
- Keep `usePathname` only when needed; compare against `useCanonicalPathname()`
  (it strips `/en`).

## Server pages

```tsx
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = { ar: {…}, en: {…} } as const;

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  return pageMetadata({ locale, path: "/curriculum", title: COPY[locale].metaTitle, description: COPY[locale].metaDescription });
}

export default function Page({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return <section>{c.title}</section>;
}
```

- Dynamic pages keep their own params (`stage`, `course`, `lesson`, `video`) and add `locale`.
- `generateStaticParams` stays as-is for content; the locale layout supplies locale params.
- Every internal `<a href="/...">` for in-app navigation must use the locale-aware
  `Link` or `localePath(locale, path)`.

## Translation scope

- Translate **all** UI chrome, navigation, buttons, labels, empty states, errors,
  loading states, dashboard copy, quiz instructions, and SEO titles/descriptions.
- Do **not** translate C++ lesson bodies, ElZero summaries, glossary explanations,
  book descriptions, project descriptions, or curriculum descriptions. These are
  learning content and stay Arabic. When an English title exists (`titleEn`,
  `nameEn`) use it in the English locale for headings/breadcrumbs; otherwise keep
  the Arabic title as an inline `<bdi>`-safe value.
- Never change item IDs, localStorage keys, or URL slugs.

## Bidi / direction

- Use logical Tailwind utilities: `text-start`, `ms-*`, `me-*`, `ps-*`, `pe-*`,
  `start-*`, `end-*`, `border-s`, `border-e`. Replace `text-right`, `ml-*`,
  `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `border-r`, `border-l`.
- Direction icons must flip with the locale — current conventions in this repo:
  forward CTAs (Arabic-first design) use `ArrowLeft` with `ltr:rotate-180`
  (renders → in English), and back/previous links use `ArrowLeft`/`ChevronLeft`
  with `rtl:rotate-180`. Keep both conventions consistent within each component.
- English-only fragments inside Arabic text: wrap in `<bdi dir="ltr">` or
  `<span dir="ltr" className="inline-block">`.
- Code blocks always LTR. English quiz options/answers: `dir="auto"` and
  `text-start` so they render left-aligned inside an RTL page.
- Numbers: Western digits only. Use `formatNumber()` from
  `@/lib/i18n/config`, not `toLocaleString()`.
- Arabic UI copy in this project is simple Modern Standard Arabic (MSA). The
  existing Miku copy uses Egyptian dialect; keep that voice for Miku only.

## Arabic copy conventions

- Use « » or plain quotes sparingly; keep the existing visual style.
- Prefer short, direct sentences.
- Technical terms keep their English form in Latin letters, wrapped in
  `<bdi dir="ltr">` when inline in Arabic.
