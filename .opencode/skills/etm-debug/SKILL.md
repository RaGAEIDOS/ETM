---
name: ETM Debug
description: Systematic search-and-debug workflow for the ETM platform (Next.js 14 + TypeScript + Tailwind). Use when asked to audit, debug, fix or health-check the whole project.
---

# ETM Debug Workflow

Goal: find real breakage across the whole platform, fix it, and verify the fix in the browser. Do not stop at "it compiles".

## Project map

- Next.js 14 App Router in `app/`, shared code in `lib/`, UI in `components/`.
- Content lives in `lib/content/*.ts` (Arabic lesson bodies, markdown, code samples, quizzes, terms).
- `lib/stages.ts` (course metadata) and `lib/data.ts` (lesson wiring) must stay in sync with `lib/content/`.
- Auth is client-side (`lib/auth.tsx`) with localStorage progress (`lib/progress.ts`, `lib/stats.ts`).
- RTL: Arabic prose renders with `dir="rtl"`; code chips stay `dir="ltr"` with `unicode-bidi: isolate`.
- Guest-only marketing page is `/landing` (no app nav). `/` redirects guests to it.

## Non-negotiable rules

1. **Never run `npm run build` while `npm run dev` is running** — it corrupts `.next` (MODULE_NOT_FOUND, `GET / 500`). Check port 3000 first; if the dev server is up, either stop it before building, or rely on `tsc` + browser checks.
2. After a build, restart the dev server with a clean `.next` if it misbehaves.
3. Arabic bodies inside double-quoted strings must escape newlines as `\n`. Raw line breaks inside `"..."` are a syntax error — see `scripts/fix-strings.cjs` history. Always template `\n` when generating content files.
4. Set spread is not supported by the TS target — use `Array.from(...)`.
5. Progress keys: lessons use plain ids, ElZero videos are prefixed `elzero-{id}`.

## Procedure

### 1. Static checks

```powershell
npx tsc --noEmit
```

Zero errors required. There is no ESLint config — treat TypeScript and the browser as the source of truth.

### 2. Content integrity (lib/content + stages/data)

- Every `lib/content/*.ts` export is wired in `lib/data.ts`.
- Every course id in `lib/stages.ts` has lessons in `lib/data.ts` (and vice versa).
- Lesson `id` unique per course; quiz `answer` index within `options` range; `duration` present.
- Arabic strings escape newlines (`\n`), code samples use backtick templates.

### 3. Dev-server smoke test (browser)

Start `npm run dev` (if not already on port 3000), then visit every route and read the console for errors:

`/`, `/landing`, `/login`, `/curriculum`, `/guide`, `/glossary`, `/sources`, `/elzero`, `/elzero/001`, `/elzero/078`,
`/learn/stage-1`, `/learn/stage-1/cpp-basics`, `/learn/stage-1/cpp-basics/hello-world`,
`/learn/stage-1/git-github/git-why`,
`/dashboard`, `/playground`, `/projects`, `/progress`, `/profile`, and a bogus route like `/definitely-not-a-page` (expect the styled 404).

For each page record: did it render, console errors/warnings, obviously broken layout (RTL mix-ups, overflow).

### 4. Production build (only when the dev server is stopped)

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen   # must be empty
npm run build
```

Inspect `.next/prerender-manifest.json` for the expected routes (stage pages, courses, lesson pages). Confirm no route is missing.

### 5. Fix policy

- Fix root causes, not symptoms. Keep diffs minimal and consistent with existing style (Tailwind, RTL-aware `ms-`/`me-` logical properties, `dir` attributes).
- Re-run the relevant check after every fix (tsc, then reload the page and re-read the console).
- Arabic content must render RTL; English/code stays LTR.

### 6. Report

Summarize: what was checked, what broke (with file:line), what was fixed, what still needs the user (e.g. Vercel redeploy, external paste of YouTube playlist lists).
