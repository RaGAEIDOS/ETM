# ETM — PROGRESS LEDGER

Single source of truth for the multi-phase master plan (`docs/MASTER_PROMPT.md`).
Update after every task. If a session is interrupted, resume from here.

**Updated**: 2026-11-11 · **Branch**: `feat/phase-4-english-section` (base: `feat/phase-3-progress` @ `f387e9c`, based on `feat/phase-2-bilingual` @ `1bd72de`, based on `feat/phase-1-content-review` @ `dd34720`, based on `feat/phase-0-recon` @ `862562d`, based on `fix/qa-pass` @ `840be10`)

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Recon & baseline | **done** | `docs/RECON.md`, 39 baseline screenshots, all baseline checks run |
| 1 — Curriculum & content review | **done** | `docs/CURRICULUM_REVIEW.md`; all 78 ElZero videos now have 2 questions; all 75 glossary terms referenced; validator strict-clean. Structural suggestions awaiting user decision (§5.2 of the review). |
| 2 — Bilingual site (ar + en) | **done** | `feat/phase-2-bilingual` pushed (6 commits); build 497 static pages, tsc/lint/test:content clean, E2E 181/181 chromium-desktop, bidi screenshots in docs/screenshots/ |
| 3 — Progress & stats system | **done** | Event store `lib/progress/` (local-first, versioned v2); migration from v1/per-user keys non-lossy; dashboard rewritten; resume cards; E2E 186/186 |
| 4 — Dedicated English section | **in progress — infra done, content blocked (needs YouTube fetch + CHECKPOINT 1)** | Full implementation on `feat/phase-4-english-section`: `/english` hub (ar + `/en/english`), per-video pages, click-to-load YouTube facade (youtube-nocookie, IFrame API, resume), tabbed panel (Summary/Terms/Practice/Speaking/Notes), mixed-type practice engine, Leitner SRS review hub (`/english/review`) + dashboard due-card, credit on every English page, notes wiped by "Delete my data". `englishVideos` intentionally EMPTY — no YouTube access here; CHECKPOINT 1 unreachable until content lands |
| 5 — Lesson playground (C++) | todo | `feature/lesson-playground` has an unmerged embedded Try-it implementation |
| 6 — Books refresh | todo | `/books` exists with 18 free books added by a previous AI pass; master prompt requires replacing them with a verified 30–40 list |
| 7 — Miku-chan mascot & tutor | todo | Miku today = canned tips, no AI endpoint; no image licensing work done |
| 8 — Full test of everything | todo | Reuse `tests/e2e` + `test:content`; extend for new features |
| Final report | todo | `docs/FINAL_REPORT.md`; **CHECKPOINT 2** |

## Decisions made

- Phase branches are cut from `fix/qa-pass` for now because it carries the E2E suite + CI that later phases must keep green; merge order to `main` is a user decision (see below).
- Content validator (`scripts/validate-content.mjs`): hard failures for schema breakage, duplicate IDs, stray scripts, U+FFFD, glued Arabic/Latin words, unresolvable literal internal links, and ElZero videos with <2 questions or no terms. Glossary-reference and ISBN advisories remain, but `--strict` is clean.
- Phase 1 decision: all 78 ElZero videos hard-require ≥2 questions (supersedes the earlier "Stage-2 gated" advisory stance).
- Phase 1 decision: legacy answer positions are **not** rotated; only the 76 newly added questions use balanced positions. Answer-position bias is documented as an unapplied suggestion.
- Phase 1 decision: no lesson/course/video/glossary ID was renamed or removed; existing URLs and stored progress are intact.
- Phase 1 decision: 16 missing glossary links were added to lessons; all 75 terms are now referenced.
- Phase 1 decision: 5 broken external book/source links were fixed and 3 book-author errors corrected; the 18 books themselves remain pending the Phase 6 replacement decision.
- a11y gate = axe `critical` + `serious` only; `moderate` (`region`, `heading-order`) documented as advisory.
- Playwright: chromium-desktop is the CI gate; mobile-chrome and webkit run locally (all three were 177/177 on 2026-11-11).
- Phase 2 decision: i18n implemented without next-intl — all routes under `app/[locale]/`, root layout is a passthrough, middleware rewrites unprefixed→`/ar` and redirects `/ar/*`→unprefixed; English is only reachable at `/en/...`.
- Phase 2 decision: `LanguageSwitcher` wraps `useSearchParams` in `<Suspense>` (otherwise every static page fails prerender).
- Phase 2 decision: forward-CTA arrows use `ArrowLeft` + `ltr:rotate-180` (Arabic-first); back/previous arrows use `ArrowLeft`/`ChevronLeft` + `rtl:rotate-180`. Both conventions coexist intentionally.
- Phase 2 decision: C++ lesson bodies, ElZero summaries, glossary explanations and book/project descriptions stay Arabic; only UI chrome + SEO metadata is translated.
- Phase 2 decision: `/dev/bidi` is noindex and intentionally omitted from the sitemap.
- Always navigate with `waitUntil: "domcontentloaded"` (Google Fonts unreachable here), and seed `etm-miku-onboarding-done=1` before clicking.
- Do **not** run `npm audit fix --force` (would jump Next 14 → 16).
- Phase 3 decision: local-first + JSON export/import only — no backend exists, no network calls added; sync remains a user decision (§below).
- Phase 3 decision: single store `etm-progress-v2` (`{version, events[], settings}`); legacy keys (`etm-progress-v1`, `etm-progress-<uid>`, `etm-activity-days`, `etm-focus-log`) are read ONCE at migration and never written/deleted again; corrupt payloads quarantined to `etm-progress-v2-corrupt-<ts>`; `etm-progress-v2-migrated` marks the one-time migration done.
- Phase 3 decision: streak counts any local day with ≥1 event (preserves legacy users' streaks); day boundary uses `localDayKey` (local getFullYear/Month/Date), not UTC slicing; `dailyGoalMinutes` is configurable and feeds the focus-minutes UI only, not the streak.
- Phase 3 decision: XP — lesson/video complete 10, quiz ≥60% +10 (+5 perfect), attempt 2, exercise pass 5, focus minute 1; level = floor(xp/100)+1.
- Phase 3 decision: merge = union of events by id, replayed sorted by (at, id); "Delete my data" wipes learning keys and the store re-creates an EMPTY v2 skeleton on reload (E2E asserts empty events, not key absence).
- Phase 3 decision: focus/Pomodoro sessions are tracked as `track: "playground"`.
- Phase 3 decision: unit tests run on the built-in `node:test` runner (`npm run test:unit`, `node --experimental-strip-types --test`) — zero new dependencies; `core.ts` stays import-free for that reason (`allowImportingTsExtensions` added to tsconfig).
- Phase 3 decision: SSR of progress-dependent client components renders a placeholder (`ready=false`); text assertions on client-only content must wait for hydration — the `/en` home is signed-in-only, so its E2E mocks `**/api/auth/me`.
- Phase 4 decision: **no fabricated content** — `englishVideos` ships empty; course/playlist metadata (ids from the channel's own descriptions) is real, but every title/summary/term/quiz item stays unfilled until `scripts/fetch-playlists.mjs` is run locally with a `YOUTUBE_API_KEY`. The hub renders a sync-pending notice meanwhile. CHECKPOINT 1 cannot be faked.
- Phase 4 decision: videos embed **inside the platform** with a click-to-load facade (thumbnail → lazy youtube-nocookie iframe via the IFrame API, 10 s timeout degradation to plain embed); no autoplay before click; 16:9 responsive; `playsinline`; playback-rate buttons + keyboard `[` / `]` / `0`; resume position saved >10 s; watched % stored ~every 5 s as an upserted `video_progress` event (no log bloat).
- Phase 4 decision: completion = watched ≥ 80 % AND practice ≥ 70 %, OR manual confirm — auto-applies once per mount (guarded against undoing a manual un-check); manual toggle always available.
- Phase 4 decision: practice = discriminated union `EnglishPracticeItem` (mcq/fill/dictation/order/match), single correct answer, `normalizePracticeAnswer` (NFKD, diacritics/punctuation strip, single-space collapse), one-line explanation per item; match items score all-or-nothing with a miss counter.
- Phase 4 decision: a full practice attempt emits ONE `quiz_attempt` (`track: "english"`, `itemId = videoId`, `topic = courseId`) so dashboard accuracy/weak-topics/reviewDue work unchanged.
- Phase 4 decision: flashcards feed a Leitner SRS (`lib/english/srs.ts`, boxes 0–5, intervals 1/3/7/16/35/75 days indexed by the NEW box); terms enter the queue on first review; overdue counts as due; `localDayKey` day boundary; pure replay of event history (order-independent), unit-tested via `node:test`.
- Phase 4 decision: notes live in `etm-english-notes-v1`, covered by export/import and wiped by "Delete my data"; speech input/synthesis is local-only (nothing recorded/uploaded); speaking tab degrades gracefully when `SpeechRecognition` is absent.
- Phase 4 decision: English video pages SSG with `generateStaticParams` = current `englishVideos` (empty for now) + `dynamicParams` default; adding content = adding data, no code changes; sitemap gains `/english` (0.9) + per-video entries automatically.

## Decisions needed (ask the user)

1. **Merge order**: merge `fix/qa-pass` (QA suite + CI + SEO canonical + a11y fixes) into `main` before starting Phase 1? Phase 0 branch is based on it.
2. **Existing unmerged branches**: `feature/english-track` (scaffold), `feature/lesson-playground`, `feature/books-refresh` — reuse, rebase, or discard? They predate the master plan.
3. **Phase 3 backend**: no backend exists. Implemented local-first + JSON export/import (per prompt). Sync options if a backend is ever approved: (a) existing GitHub OAuth + a tiny `/api/progress` route persisting to a KV/file per user, (b) Supabase/Postgres with RLS, (c) Vercel Blob/KV. Demo/prototype only; none wired up.
4. **Phase 6 books**: confirm removing all 18 current `/books` entries (all added by AI) before adding the verified 30–40 list.
5. **Phase 4 YouTube access**: no key in this environment (all YouTube hosts unreachable; only www.googleapis.com answers). Needed: run `YOUTUBE_API_KEY=AIza… node scripts/fetch-playlists.mjs` locally and provide `out/english-courses.json` (or re-paste it here) so the first 20 "English from zero" videos can be transcribed → then CHECKPOINT 1 review. Blocking `docs/MASTER_PROMPT.md` CHECKPOINT 1 and everything after it in Phase 4.

## Unverified / environment limits

- Wandbox compilation: endpoint returned HTTP 500 from this environment; Playground verified only on its friendly-error fallback.
- GitHub sign-in: no test token; only the token-paste flow and signed-cookie code were inspected.
- **Live deployment (verified 2026-11-12)**: `etm-learning.vercel.app` is live and serves the **Phase-4 build** — `/english` and `/english/review` return the English hub + review page (with the empty-videos sync notice), even though `main` @ `380b475` has no English/books/progress routes. Conclusion: that domain is not tracking `main` (possible manual `vercel --prod` from the phase-4 working tree, or a Production Branch override in Vercel). `etm-one-ruddy.vercel.app` returns HTTP 404. User action: check Vercel → project → Settings → Git → Production Branch and pick the canonical domain.
- YouTube Data API / playlist metadata: not fetched — unreachable from the development environment; `scripts/fetch-playlists.mjs` committed for local run (Phase 4 blocker, see "Decisions needed" #5).
- **CI (`.github/workflows/qa.yml`)**: `fix/qa-pass` push run #1 passed (2m55s), but runs #2/#3/#4 (PR #1, main @ `65d982e`, PR #2) failed after ~11m48s with identical code — prime suspect was font-swap layout variance (runners reach Google Fonts; `display=swap` made `scrollWidth` racy at measure time) flipping the borderline horizontal-overflow assertion on the 1280px header. Fix (`380b475`): header headroom + `waitHydrated` awaits `document.fonts.ready`. User approved push to `main` (fast-forward `65d982e → 380b475`, 2026-11-11). **Run #5 on `main` PASSED in 2m30s (2026-11-11)** — diagnosis confirmed, `main` CI is green. PR #2 (`feat/phase-1-content-review`) still red until it merges/rebase onto `main`. `feat/phase-4-english-section` stays unmerged (CHECKPOINT 1). Recurring `ENOSPC` on local disk C: — keep build/test scratch worktrees on E:.
- **Home handoff produced (2026-11-11)**: `docs/HANDOFF.md` on `feat/phase-4-english-section` @ `7e9dc7c` (Arabic+English session digest: branches, env, commands, Phase 4 resume, decisions) + `ETM-home-handoff-2026-11-11.zip` (7.9 MB, includes full `.git` and all tracked files; excludes `node_modules`/`.next`; verified by extraction → `git status` clean at `7e9dc7c`).
- **Vercel deploys `main` to production automatically on every push** (repo is connected; user-confirmed). Branch/PR pushes get preview deployments instead (the "Vercel" check + preview comments). Consequence: nothing reaches production until it lands on `main` — keep unfinished phases off `main`; use the PR preview URL to QA phase-4 on Vercel before CHECKPOINT 1. Production currently runs `380b475` (UI header fix is live there).
- WebKit + mobile Chrome are green locally but excluded from CI by decision.

## Commands

```powershell
npm ci
npm run dev                                   # http://localhost:3000
npm run typecheck ; npm run lint
npm run test:content                          # add -- --strict for advisory-as-failure
npm run build ; npx next start -p 3100
npx playwright test --project=chromium-desktop
node scripts/recon-screenshots.mjs            # needs server on :3100
```

## Last known-good state

- `fix/qa-pass` @ `840be10`: build, typecheck, lint, content validation pass; E2E 177/177 on chromium-desktop, mobile-chrome, webkit; CI workflow committed; QA report committed.
- Phase 0 adds docs only (no app code changes): `docs/MASTER_PROMPT.md`, `docs/RECON.md`, `docs/PROGRESS.md`, `scripts/recon-screenshots.mjs`, `docs/recon/screenshots/`.
- Phase 1 @ `feat/phase-1-content-review`: build 252 static pages, typecheck, lint, `test:content --strict` clean, E2E 177/177 on chromium-desktop; full findings in `docs/CURRICULUM_REVIEW.md`.
- Phase 2 @ `feat/phase-2-bilingual`: ar (default, unprefixed) + en (`/en/...`) per `docs/I18N_GUIDE.md`; routes moved under `app/[locale]/`; all UI chrome translated; C++/ElZero/glossary/book content stays Arabic; `<html lang dir>` per locale; persisted language switcher (NEXT_LOCALE cookie); sitemap ar/en/x-default alternates; `/dev/bidi` + screenshot tests; build 497 static pages, typecheck/lint/`test:content --strict` clean, E2E 181/181 chromium-desktop (2026-11-11).
- Phase 3 @ `feat/phase-3-progress`: `lib/progress/core.ts` (pure schema/derive/merge/migration) + `lib/progress/store.ts` (client store, `useProgressStore`), compat shim `lib/progress.ts`; events wired for quiz (`quiz_attempt` with score/per-question), lesson/video completion, playground `exercise_run`, Pomodoro `focus_session`; new dashboard (stat cards, 12-week heatmap, 8-week accuracy trend, per-track bars, weak topics, badges, daily-goal + export/import/delete); resume card on Home + Dashboard; ElZero videos got their first-ever completion tracking (`ElzeroCompleteButton`); build 497 static pages, typecheck/lint/`test:content --strict` clean, unit 28/28, E2E 186/186 chromium-desktop (2026-11-11).
- Phase 4 (in progress) @ `feat/phase-4-english-section`: routes `/english` (hub), `/english/[video]`, `/english/review` (ar + /en); components under `components/english/` (facade, practice, terms, speaking, notes, completion bar, panel, course progress, due card, credit); top-level nav ("الإنجليزية"/English) + footer + Miku tips + sitemap + dashboard due-card; data layer `lib/english-videos.ts` with real playlist metadata, EMPTY video list; SRS `lib/english/srs.ts` + unit tests 39/39; content pending local YouTube fetch (see Decisions needed #5). Build green (SSG `/english` + `/english/review` both locales, `[video]` manifest empty), typecheck/lint/`test:content --strict` clean, unit 39/39, E2E 192/192 chromium-desktop (2026-11-11). CHECKPOINT 1 NOT reached — content blocker.
