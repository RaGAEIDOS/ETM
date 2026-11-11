# Phase 0 — RECON & Baseline

**Date**: 2026-11-11 · **Branch**: `feat/phase-0-recon` (from `fix/qa-pass`) · **Baseline commit**: `840be10`

## Stack

Next.js 14.2 (App Router) · React 18.3 · TypeScript 5.6 · Tailwind 3.4 · lucide-react · react-markdown · react-syntax-highlighter · react-simple-code-editor. No database or server persistence. Node 22.23.4 / npm 10.9.9 (Node ≥22.6 required by the content validator's `--experimental-strip-types`).

## Routes (page.tsx files)

`/` (client redirect: guests → `/landing`) · `/landing` · `/curriculum` · `/learn/[stage]` · `/learn/[stage]/[course]` · `/learn/[stage]/[course]/[lesson]` · `/elzero` · `/elzero/[video]` · `/playground` · `/projects` · `/glossary` · `/books` · `/dashboard` · `/progress` · `/profile` · `/login` · `/guide` · `/sources` · 404 (`not-found.tsx`). APIs: `/api/auth/{github,logout,me}` only.

## Where the data lives

| Area | File | Size today |
|---|---|---|
| Curriculum metadata | `lib/stages.ts` → assembled in `lib/data.ts` | 4 stages, 19 courses, 128 lessons |
| Lesson content | `lib/content/*.ts` (19 files) | e.g. `cpp-basics.ts`, `elzero-fundamentals.ts` |
| ElZero videos | `lib/elzero-videos.ts` (type + 78 records inline) | 10 sections, 78 videos |
| Glossary | `lib/glossary.ts` | 75 terms, 8 categories |
| Books | `lib/free-books.ts` | 18 entries, 9 categories |
| Projects | `lib/projects.ts` | 13 projects |
| Shared types | `lib/types.ts` (`QuizQuestion`, `Lesson`, `Course`, `Stage`) | — |
| Quiz UI | `components/Quiz.tsx` (reused by lessons + ElZero) | — |

## How progress, auth and persistence work

- **Progress** (`lib/progress.ts`): localStorage only. Guest map `etm-progress-v1`; per-user `etm-progress-<uid>` merged over guest on read. Lesson completion = boolean map entry. Stats in `lib/stats.ts`: `etm-activity-days` (streak), `etm-focus-log` (Pomodoro minutes).
- **ElZero progress is dead code**: `saveElzeroProgress()` / `isElzeroDone()` are defined but never called; no UI writes `elzero-*` keys, yet the Dashboard counts them.
- **Auth** (`lib/auth.tsx`, `lib/session.ts`): user pastes a GitHub token → `/api/auth/github` verifies it against `api.github.com` → HMAC-signed, httpOnly `etm_session` cookie (30 days) + localStorage mirror `etm-auth-session-v1`. No OAuth redirect, no DB, no server-side progress. `AUTH_SECRET` falls back to a dev default.
- **Miku** (`components/Miku.tsx`, `lib/miku.ts`): deterministic contextual tips, onboarding tour, Pomodoro messages. **There is no AI/LLM endpoint** — "AI study buddy" is marketing language for the canned helper.
- **Playground** (`components/Playground.tsx`): browser POSTs code directly to `https://wandbox.org/api/compile.json` (`gcc-head`, `-std=c++2a`). No server proxy, no stdin box, no code-size/timeout/output limits, no rate limit; third-party availability is a hard dependency (HTTP 500 observed here).
- **i18n**: none. `app/layout.tsx` hardcodes `<html lang="en" dir="ltr">`; Arabic content zones set `dir="rtl"` per page. UI chrome English, lesson prose Arabic, no locale switcher.
- **SEO**: `metadataBase` = `https://etm-learning.vercel.app`; `app/sitemap.ts` (237 URLs), `app/robots.ts`.
- **CI**: `.github/workflows/qa.yml` on PR + push to `main`/`fix/qa-pass`: npm ci → typecheck → lint → test:content → build → Playwright chromium-desktop.

## Baseline results (all run, not assumed)

| Check | Result |
|---|---|
| `npm ci` | ✅ 521 packages, 55 s — **14 vulnerabilities** (9 moderate, 4 high, 1 critical) |
| `npm run typecheck` | ✅ pass |
| `npm run lint` | ✅ pass — 1 warning (`no-page-custom-font`, fonts via `<link>` in layout) |
| `npm run test:content` | ✅ pass — 0 blocking, 91 advisories (76 ElZero <2Q, 15 glossary-unreferenced) |
| `npm run build` | ✅ pass — 252 static pages |
| `npx playwright test --project=chromium-desktop` | ✅ 177/177 (3.6 m) |
| `next start -p 3100` | ✅ 200; sitemap 237 URLs |
| Live site | ✅ 200, but sitemap/robots still emit `etm.vercel.app` |
| Screenshots | `docs/recon/screenshots/` — 39 JPEGs (19 pages × 1280/390 + onboarding) |

## Problems found

1. **Live deploy is stale**: `etm-learning.vercel.app/sitemap.xml` and `/robots.txt` still serve the old `etm.vercel.app` host; the repo fix (`2ec0f4d`) is not deployed.
2. **Security debt**: `npm audit` = 14 vulns; the critical one is Next 14 and only clears with a Next ≥16 major upgrade (`npm audit fix --force` would break the app — do not run). No CSP/security headers in `next.config.mjs` or `vercel.json`.
3. **Miku onboarding overlay** covers the first visit and intercepts pointer clicks until dismissed; E2E specs must seed `etm-miku-onboarding-done=1`.
4. **Google Fonts unreachable in this environment** (curl 000): `page.goto(..., {waitUntil:"load"})` hangs; tests use `domcontentloaded`. The font `<link>` is also render-blocking in `<body>`.
5. **Playground limits**: C++/Wandbox-only, no stdin, no size/time/output caps, no server-side rate limiting; Wandbox 500 seen.
6. **ElZero progress is unwired** (dead functions above) — video pages cannot mark themselves complete, so Dashboard's "ElZero videos" counter never moves from real use.
7. **Content depth**: 76/78 ElZero videos have only 1 quiz question (Phase 1 requires ≥2); 15 glossary terms are unreferenced. Both are validator advisories, deliberately non-blocking until content approval.
8. **Language metadata mismatch**: `lang="en"` while the course content is Arabic; no i18n architecture (Phase 2 will need one).
9. **Guest root flash**: `/` renders then client-redirects guests to `/landing`; no server redirect, so the root route is JS-dependent.
10. **Quiz/ElZero attempts are not persisted**: quiz state is component-local; no score history feeds progress.
11. **Unmerged branches exist**: `feature/english-track` (English scaffold: routes, `lib/english-videos.ts`, fetch script — 12 files), `feature/lesson-playground` (embedded C++ Try-it), `feature/books-refresh` (identical to `main` at HEAD).
12. **No English nav entry**; home/footer copy is C++-only (Phase 4 scope).

## Commands

```powershell
npm ci
npm run typecheck ; npm run lint ; npm run test:content ; npm run build
npx next start -p 3100
npx playwright test --project=chromium-desktop
node scripts/recon-screenshots.mjs          # baseline screenshots (server on :3100)
```
