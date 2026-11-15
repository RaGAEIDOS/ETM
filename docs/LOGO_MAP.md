# ETM — LOGO / ICON / SHARE-IMAGE MAP

Audit of every current logo, favicon, manifest and social-image reference.
Snapshot taken on `feat/new-logo` from `main` @ `2deff84` (2026-11-15), before
the new-logo integration. **Final status** was reconciled on `feat/rebrand-assets`
after the real artwork landed (see §10).

Legend: **replace** = must point at the new logo pipeline · **keep** = not a
logo reference · **delete** = old brand asset, removed after the swap.

## 1. Logo images (`<img>`)

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 1 | `components/SiteHeader.tsx` | 129 | `<Link … aria-label="ETM — Education Technology Maryam">` wrapping the logo | keep label, swap image for `<SiteLogo>` |
| 2 | `components/SiteHeader.tsx` | 130–136 | `<img src="/brand/main-logo.png" width={768} height={512} className="h-11 sm:h-12 …">` | **replace** with theme-aware `<SiteLogo>` |
| 3 | `components/SiteFooter.tsx` | 61 | `<Link … aria-label="ETM — Education Technology Maryam">` wrapping the footer logo | keep label, swap image for `<SiteLogo>` |
| 4 | `components/SiteFooter.tsx` | 62–69 | `<img src="/brand/main-logo.png" width={768} height={512} loading="lazy" className="h-16 …">` | **replace** with theme-aware `<SiteLogo>` |
| 5 | `app/[locale]/landing/page.tsx` | 256–263 | `<img src="/brand/etm-banner.jpg">` (marketing brand banner) | **delete** — section removed; the new `HeroBanner` owns all landing artwork |

## 2. Favicon / browser icons

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 6 | `app/[locale]/layout.tsx` | 82 | `icons: { icon: "/favicon.svg" }` | **replace** with generated favicon set + manifest |
| 7 | `app/favicon.ico/route.ts` | 8 | reads `public/favicon.svg`, serves it as `/favicon.ico` | **replace** with `/icons/favicon.ico` when generated, SVG/PNG fallback |
| 8 | `public/favicon.svg` | whole file | old code-bracket icon on navy square | **delete** — no runtime reference remains; `public/icons/favicon.svg` is the only SVG fallback |
| 9 | `middleware.ts` | 39 | matcher excludes `favicon.ico`, `favicon.svg`, `og.svg`, `brand/`, `mascot/` | **replace** exclusions so `icons/` and `manifest.webmanifest` are served directly |

## 3. Open Graph / Twitter share images

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 10 | `app/[locale]/layout.tsx` | 89–96 | `openGraph.images = [{ url: "/brand/etm-banner.jpg", width: 1600, height: 900 }]` | **replace** with `LOGO_ASSETS.og` (new full logo, absolute URL) |
| 11 | `app/[locale]/layout.tsx` | 98–103 | `twitter.images = ["/brand/etm-banner.jpg"]` | **replace** with the same new full logo URL |
| 12 | `tests/e2e/seo.spec.ts` | 27–28 | asserts `meta[property="og:image"]` exists | **extend** to assert the new logo path |
| 13 | `public/brand/etm-banner.jpg` | file | old 1600×900 marketing banner, also used by landing page | **delete** — both the landing section and OG/Twitter now use the new artwork |
| 14 | `public/og.svg` | file | unused hand-made 1200×630 OG card | **delete** — unreferenced legacy social card removed |

## 4. Web app manifest / PWA metadata

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 15 | — | — | **no manifest exists** (`site.webmanifest`, `manifest.json` and `app/manifest.ts` all absent) | **add** `app/manifest.ts` with `name`/`short_name` = `ETM` and the generated icon array |
| 16 | `app/[locale]/layout.tsx` | 65–105 | `generateMetadata` owns title/description/OG/Twitter/icons | **add** `manifest: "/manifest.webmanifest"` and absolute logo URLs |

## 5. CSS backgrounds and embedded assets

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 17 | `app/globals.css` | 369–371 | `background-image` = two radial gradients (theme glow) | **keep** — no logo/image URL |
| 18 | `app/globals.css` | 592 | `background-image` = gradient (cozy theme texture) | **keep** — no logo/image URL |
| 19 | `components/MaryamAvatar.tsx` | 44–89 | inline SVG gradients `url(#maryam-*)` | **keep** — mascot avatar, not the site logo |
| 20 | `components/ProgressDashboard.tsx` | 126 | inline SVG gradient `url(#grad)` | **keep** — chart gradient |

No CSS `background-image` or module import points at the old logo/icon files.

## 6. Docs and README

| # | File | Line | Current reference | Action |
|---|---|---|---|---|
| 21 | `README.md` | 94 | `api/auth/` tree comment (contains “logout”) | **keep** — false positive |
| 22 | `docs/REBRAND_MAP.md` | 203–206, 390 | historical inline-SVG audit notes | **keep** — historical record |
| 23 | `docs/PROGRESS.md` | 135 | historical “logo” mention in an English-section note | **keep** — historical record |

No README badge, `<img>`, or markdown image embed uses the old logo.

## 7. Old brand files

| # | File | Action |
|---|---|---|
| 24 | `public/brand/main-logo.png` (768×512 RGBA, 520 KB) | **deleted** — old header/footer logo, fully replaced |
| 25 | `public/brand/etm-banner.jpg` (1600×900, 265 KB) | **deleted** — the `public/brand/` directory is gone |
| 26 | `public/favicon.svg` (651 B) | **deleted** — no compatibility URL is needed because the icon links use `/icons/` |
| 27 | `public/og.svg` (1.1 KB) | **deleted** — unused legacy social card |

## 8. Target pipeline (new references)

- Source-of-truth files the designer drops into `public/mascot/`:
  `logo_full.png` (horizontal wordmark + icon), `logo_icon.png` (square ≥512),
  `logo_dark.png` (optional full logo for light backgrounds).
- `scripts/generate-logo-assets.mjs` runs on `predev`/`prebuild`, detects real
  PNGs, generates WebP (sharp/cwebp when available) + favicons + ICO, and writes
  `lib/logo-assets.ts`.
- When a PNG is absent, the same script falls back to the labelled SVG
  placeholders in `public/mascot/` (`logo_full.svg`, `logo_icon.svg`,
  `logo_dark.svg`). No component or metadata file needs editing when the real
  PNGs arrive.
- Generated favicon targets in `public/icons/`: `favicon.ico` (16/32/48),
  `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180),
  `android-chrome-192x192.png`, `android-chrome-512x512.png`,
  `favicon.svg` (placeholder fallback).
- Header/footer use `components/SiteLogo.tsx`; it shows `logo_full` on
  dark/terminal/cozy and `logo_dark` on light when that variant exists.
- `og:image` / `twitter:image` use the absolute URL of the real
  `/mascot/logo_full.png` (750×192).
- `/favicon.ico` serves the generated `public/icons/favicon.ico` (16/32/48) with
  `Content-Type: image/x-icon`; the route returns 404 only if the file is missing.
- `app/manifest.ts` exposes `name`/`short_name` `ETM` plus the generated 192 and
  512 PNG icons.

## 9. Final asset state (`feat/rebrand-assets`, 2026-11-15)

| Path | Size / format | Role |
|---|---|---|
| `public/mascot/logo_full.png` + `.webp` | 750×192 | Header/footer logo on dark, terminal and cozy; OG/Twitter image |
| `public/mascot/logo_dark.png` + `.webp` | 750×192 | Light-theme logo |
| `public/mascot/logo_icon.png` + `.webp` | 512×512 | Square mark; source for favicons |
| `public/mascot/maryam_banner.png` + `.webp` | 1920×600 | Hero banner |
| `public/mascot/maryam_banner-{480,768,1280,1920}.webp` | 480–1920 px wide | Responsive banner `srcSet` |
| `public/mascot/maryam_cutout.png` + `.webp` | 389×922 | Hero cutout and mobile avatar |
| `public/mascot/maryam_icon.png` | 256×256 | Maryam avatar raster |
| `public/mascot/maryam_icon.svg` | 128×128 embedded PNG | Required quote avatar path |
| `public/icons/favicon.ico` | 16/32/48 | `/favicon.ico` |
| `public/icons/favicon-16x16.png`, `favicon-32x32.png` | 16/32 | Browser icon links |
| `public/icons/apple-touch-icon.png` | 180 | iOS home screen |
| `public/icons/android-chrome-{192,512}.png` | 192/512 | Manifest icons |
| `public/icons/favicon.svg` | SVG | Placeholder fallback only |

Deleted: `public/brand/main-logo.png` (earlier logo phase),
`public/brand/etm-banner.jpg`, `public/favicon.svg`, `public/og.svg` and
`components/HeroTerminal.tsx`.

## 10. Grep commands used

```powershell
rg -n -i "logo|favicon|og:image|apple-touch-icon|manifest|twitter:image" `
  -g "*.{ts,tsx,js,jsx,mjs,json,css,md,html}" .
rg -n -i "brand/|main-logo|etm-banner|favicon|og\.svg|apple-touch|webmanifest|manifest\.json|twitter:image|background-image|url\(" `
  -g "*.{ts,tsx,css,md,json}" .
Get-ChildItem public -Recurse -File
```
