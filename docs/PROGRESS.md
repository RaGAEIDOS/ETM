# ETM — PROGRESS LEDGER

Single source of truth for the multi-phase master plan (`docs/MASTER_PROMPT.md`).
Update after every task. If a session is interrupted, resume from here.

**Updated**: 2026-11-13 · **Branch**: `feature/programmingadvices-free-courses` (from `fix/thumbnails-cs50-final-check`); Programming Advices pilot + site themes + Pomodoro lofi; all uncommitted on this branch

## Final check — thumbnails + CS50x pilot (2026-11-13, 15-line digest)

1. Scope: `fix/thumbnails-cs50-final-check` based on `0305b03`; merges ElZero Web data, Linux pilot, ProgrammingAdvices docs and the audit report.
2. Thumbnails: every wired card/page uses `https://i.ytimg.com/vi/{id}/hqdefault.jpg` with `mqdefault.jpg` fallback, `loading="lazy"` and a meaningful alt; no other image host.
3. ElZero C++: PASS — 78/78 lesson cards, hub cards and lesson page thumbnails; existing content is `reviewed:true`.
4. ElZero Web: BLOCKED (data only) — 6 courses / 390 lessons in `lib/elzero-web-*`, no routes/UI yet; the validator now checks the catalogue.
5. English: PASS — 36 courses / 458 lessons, hub + course + lesson thumbnails; content `reviewed:false`.
6. ProgrammingAdvices: BLOCKED — fetch plan + raw `out/` metadata only; no `lib/` data or routes, so there are no cards to wire or validate.
7. Linux: PASS — hub + course + 53 lesson thumbnails; content `reviewed:false`.
8. CS50x: PASS (pilot) — 12 weeks (0–10 + AI) + Final Project, with lecture → section → shorts → problem-set workflow; weeks 0–1 are the pilot.
9. CS50x hub certificate card: 10 problem sets + Final Project → submit via edX → free certificate at `cs50.harvard.edu/x/certificate/`; enrolment `cs50.edx.org`; optional edX verified note; no payment wording.
10. CS50x credit: exact required line + CC BY-NC-SA 4.0 license link on the hub, every lecture page and the review page.
11. CS50x integration: progress track `cs50x` feeds stats/resume and the Leitner review queue (`/cs50x/review`); sitemap wired.
12. Gates: `tsc --noEmit` clean; `lint` pre-existing warnings only; `test:content --strict` PASS (elzero-web 6/390, english 36/458, cs50x 13/0); unit 120/120.
13. Build: `npm run build` PASS, 1633 static pages; final E2E chromium-desktop 219/219 passed.
14. Fixes: ElZero lesson URLs backfilled with real video IDs via Invidious so all 78 hub cards get thumbnails; thumbnail helpers moved to `lib/youtube.ts` (client-module export crashed prerender); facade alts/badges trimmed for axe `label-content-name-mismatch`; `networkidle` replaced with bounded `waitHydrated` and `i.ytimg.com` noise tolerance.
15. Blockers/stop: `i.ytimg.com` is unreachable here, so thumbnails render black locally and YouTube playlists cannot be live-checked; remaining `reviewed:false` = 914 (ElZero Web 390, English 458, Linux 53, CS50x 13); STOP after pilot weeks 0–1 screenshots.

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
| CS50x — Harvard CS50x track (`feature/cs50x`) | **done (gates green; pushed after commit)** | Full official playlist embedded with original Arabic summaries (`reviewed:false`), certificate tracker, `/cs50x` hub + 13 SSG lecture pages; based on `main` @ `f557764` |
| صدارة المتعلمين — leaderboard (`feature/cs50x`) | **done** | `/leaderboard`: local-first front-runners board — real personal stats only; global competitive board deferred to the account/sync decision |

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
- **CS50x decision (2026-11-13)**: embed ONLY the official Harvard playlist `PLhQjrBD2T380hlTqAU8HfvVepCcjCqTg6` (13 lectures) via click-to-load youtube-nocookie facades; shorts/sections/notes/slides/psets are link-only, never re-hosted. License is CC BY-NC-SA 4.0 (https://cs50.harvard.edu/x/license/) — every CS50x page carries `Cs50xCredit` attribution + "changes: none to lecture videos" + non-affiliation. All summaries/terms/quizzes are ORIGINAL Arabic, `reviewed:false`. Official ids/durations verified via Invidious (`inv.nadeko.net`); embed validity per the noembed oEmbed pattern used for ElZero.
- **CS50x decision (2026-11-13)**: the free CS50 Certificate path = 10 problem sets + final project, each ≥ 70% via cs50.edx.org + cs50.dev; claim at cs50.harvard.edu/certificates; scores viewable at cs50.me/cs50x. ETM tracks this LOCALLY only (`etm-cs50x-certificate-v1`); the platform never submits anything on the learner's behalf and says so on the page.
- **CS50x decision (2026-11-13)**: `lib/english/srs.ts` `deriveSrs`/`srsDueCount` now take an optional `track` param (default `"english"`) so CS50x flashcards feed the same Leitner queue; no fork of the SRS engine.
- **Leaderboard decision (2026-11-13)**: «صدارة المتعلمين» is **local-first and honest** — weekly XP/events/focus minutes, total XP, level, current/longest streak, quiz accuracy, 12-week heatmap, per-track completion (cpp/elzero/english/cs50x), XP-threshold milestone ladder (مبتدئ → أسطورة ETM) and the CS50x certificate tracker inline. **No fake learner rows, no fabricated ranks.** A global competitive board needs the account/sync backend decision (Decisions needed #3); the page states this and lists exactly what it will rank (weekly XP, per-track boards, opt-in consent). Arabic display name «صدارة المتعلمين»; both locales.

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
- **Phase 4 batch 1 (2026-11-12, CHECKPOINT 1)**: playlist metadata pulled via Invidious `inv.nadeko.net` (YouTube hosts blocked locally; `/api/v1/playlists/PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ` returned 25 real videos; video-detail endpoint 403, captions empty). `lib/english-videos.ts` now holds the first 20 videos with real ids/titles/durations (`reviewed: false`), conservative Arabic summaries, 3–5 terms, 3 practice items each; generic Episodes 14–20 get a cautious "basics review" set. `/english` hub now lists lessons with duration + links to `/english/[id]` (list was missing entirely). A11y fix: `EnglishCourseProgress` progressbar named (`aria-progressbar-name`). Gates: typecheck/lint/`test:content --strict` clean, unit 39/39, build 20 SSG lesson pages × 2 locales, E2E 193/193 chromium-desktop (2026-11-12). Awaiting user review of the 20 lessons before Phase 5.
- **Phase 4 published to production (2026-11-12)**: user approved ("انشر"). Merged `feat/phase-4-english-section` into `main` → merge commit `1b5719f` (no conflicts; `git merge-tree` pre-checked), re-ran typecheck/lint/`test:content --strict`/build on the merge result (all green), pushed `main`. Vercel production is live: `etm-learning.vercel.app/english` now shows the 20-lesson list, `/english/002` renders tabs + `reviewed:false` banner, `/en/english` shows the English lesson list; the old "sync pending" notice is gone. CI run #6 on `main` triggered by the push (full gates on `main`). Home handoff ZIP @ `8a57a8e` remains available; `main` is now ahead of it.
- **Phase 4 full catalogue (2026-11-12)**: all 36 educational playlists on the @ZAmericanEnglish channel fetched via Invidious (`out/english-course-playlists.json`, 458 real videos / 427 unique ids) and generated into `lib/english-videos-bulk.ts` (31 new courses + 438 lessons, ids 021-458, `reviewed:false`, empty terms/practice by design; cross-playlist duplicates kept so each course is complete). `englishCourses` now carries a `group` (level1/level2/level3/special) and is sorted by curriculum level; the hub groups cards by level with a 36-course/458-video count and links to new `/english/course/[id]` pages (72 SSG pages) instead of listing 458 lessons inline. Sitemap gains the 36 course pages. E2E updated for the grouped hub + new course page + a11y route. Gates: typecheck/lint/`test:content --strict` clean, unit 39/39, build 1489 static pages (916 lesson pages), E2E 195/195 chromium-desktop (2026-11-12). Generated scripts: `scripts/fetch-english-courses.mjs`, `scripts/generate-english-catalogue.mjs`.
- **CS50x + leaderboard (2026-11-13) @ `feature/cs50x` (base `main` @ `f557764`)**: new routes `/cs50x`, `/cs50x/[video]` (13 SSG ×2 locales), `/leaderboard` «صدارة المتعلمين». Components under `components/cs50x/` + `components/LeaderboardClient.tsx`; data in `lib/cs50x.ts` + `lib/cs50x-lectures-1/2.ts` + `lib/cs50x-notes.ts`; progress track `"cs50x"` (doneCs50xVideoIds) persisted in the v2 event store; export/import/delete covers it. Hub: resume card variant=cs50x, per-course progress line, per-lecture done state, links to official week pages/psets/notes, certificate card (10 psets + final project ≥70%, local tracker `etm-cs50x-certificate-v1`). Miku tips + header/footer + sitemap (`/cs50x` 0.9, `/leaderboard` 0.8, 13 lecture URLs) + `validate-content.mjs` hard cs50x catalogue check and cs50x-aware internal links. Gates: tsc clean, lint (pre-existing warnings only), `test:content --strict` clean (`cs50x: 13 lectures, 0 problem(s)`), unit 49/49, build green (new SSG routes listed). E2E chromium-desktop extended for the new routes (a11y + responsive). Push of `feature/cs50x` explicitly authorized (branch push only — NOT merged to `main`; production untouched). **Post-push fix (`0305b03`)**: first full E2E run failed 131/207 — root-caused to (a) new header nav items pushing the 1280px header 111px past the viewport (horizontal-scroll gate) and (b) i.ytimg thumbnails hanging networkidle in this offline environment. Both fixed (scrollable nav; locally generated posters in both facades); responsive + phase1-routes re-ran green (151/151); full suite re-run pending at push time.
- **Programming Advices pilot (2026-11-13, branch `feature/programmingadvices-free-courses`, uncommitted)**: two free Dr. Mohammed Abu-Hadhoud courses wired end-to-end — `/programmingadvices` hub, `/programmingadvices/course/pa-foundations|pa-algorithms`, `/programmingadvices/pa1-01…10`, `/programmingadvices/review` (ar + `/en`). Data `lib/programmingadvices-videos.ts` + `lib/programmingadvices-course1.ts` + `lib/programmingadvices-notes.ts`; progress track `"programmingadvices"`; Miku hints/explain; site themes `miku|bootcamp|codecademy`; Pomodoro lofi links. Pilot = 10 of 20 course-1 lessons; course 2 verified card only (0/50). Gates: typecheck/lint clean (pre-existing warnings), `test:content --strict` PASS (2 courses / 10 videos), unit 126/126, build 1661 pages, PA E2E 12/12 chromium-desktop + 12/12 mobile-chrome, webkit hub green (full webkit needs `--workers=1`). Thumbnails/playback not visually verifiable here (`i.ytimg.com`/`youtube.com` ECONNRESET). STOP for pilot approval before lessons 11–20.
- **Linux course pilot (2026-11-12, branch `feature/linux-course`, merged into `fix/thumbnails-cs50-final-check`)**: one course added — «دورة تعلم نظام اللينكس 2021» by Linuxtopia (playlist PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg, 53 videos, all embeddable via noembed, 53/53 metadata via Invidious since YouTube hosts are unreachable here). Routes `/linux` (hub), `/linux/course/linux-2021` (section-grouped lesson index, 9 sections derived from titles), `/linux/[video]` (lnx-01..lnx-53, SSG), `/linux/review`. Components under `components/linux/` (facade, lesson panel w/ Summary/Terms/Practice/Terminal Lab/Notes tabs, key-terms flashcards, mixed-type practice engine, completion bar, review due-card + session, notes, course progress, credit). Terminal Lab = **simulated in-browser shell only** (`lib/linux/shell/*`: pure-TS parser/VFS/commands/pipes/chmod; 17 fresh-fixture-fail/solution-pass challenges) — never executes real commands. Progress layer extended with `track: "linux"` (`doneLinuxVideoIds`, export/import/delete incl. `etm-linux-notes-v1`); SRS parameterized by track; ResumeCard gains `variant="linux"`; nav groups ElZero/English/Linux under a «الدورات / Courses» dropdown (URLs unchanged); Miku tip + glossary «لينكس» category (12 referenced terms) + sitemap wired. Pilot = lessons 1–10 hand-curated; 11–53 ship `reviewed:false` with conservative Arabic summaries, empty terms/practice (generated `lib/linux-videos-bulk.ts`). Credit + non-affiliation line on every track page. Validator now scans Linux videos (lnx-NN ids, section coverage, exactly-one-correct-answer per practice type) and branches link params by locale-independent prefix; `out/` excluded from the stray-script scan.

## Task: Programming Advices free courses (new prompt, 2026-11-12)

Branch: `feature/programmingadvices-free-courses`. Prompt: add exactly two free courses by Dr. Mohammed Abu-Hadhoud, mirroring the ElZero/English pattern, with original (non-copied) Arabic content, YouTube embeds only, and credit on every page.

### Phase status (this task)

| Step | Status | Notes |
|---|---|---|
| 0 — Explore | **done** | ElZero page/lesson, English facade/panel/notes/progress/validator/nav read; plan below |
| 1 — Collect & verify | **done (metadata)** | 20/50 playlist items fetched; see findings |
| 1 — Content (pilot) | **done** | Course 1 lessons 1–10 written; captions unavailable → `reviewed:false`, summaries from published titles/descriptions only, all terms/drills original |
| 2 — Data model | **done** | `lib/programmingadvices-videos.ts` (both verified courses, 10 lessons) + `programmingadvices-course1.ts` + notes store |
| 3 — UI + learning features | **done (pilot)** | nav, hub, course pages, lesson pages, facade, 4 tabs, notes, progress, review queue, Miku wired |
| 4 — Rollout (pilot 10) | **done — awaiting approval** | STOP after first 10 of course 1; see pilot report below |
| 5 — Gates | **done (pilot)** | typecheck/lint/test:content/unit/build/E2E green; details below |

### Step 0 findings (reused building blocks)

- Route shape: `app/[locale]/elzero/page.tsx` (sections list) + `elzero/[video]/page.tsx` (summary/terms/quiz, `generateStaticParams` over `elzeroVideos`).
- English track is the closer template for embedded video: `components/english/EnglishVideoFacade.tsx` (click-to-load, youtube-nocookie IFrame API, resume from `video_progress`, ~5 s upsert, rate buttons, error → YouTube link), `EnglishLessonPanel.tsx` (Summary/Terms/Practice/Speaking/Notes tabs), `EnglishNotes.tsx` + `lib/english-notes.ts` (`etm-english-notes-v1`, export/delete), `lib/english/srs.ts` (Leitner), `components/english/EnglishCredit.tsx`.
- Progress: `lib/progress/core.ts` defines `Track` + `EventType` + `deriveProgress` (`doneVideoIds` for elzero, `doneEnglishVideoIds` for english); `store.ts` has `trackEvent/saveVideoProgress/toggleCompletion/isItemDone/exportMyData/importMyData`. New track = add `"programmingadvices"` to the union and the two done-arrays, or reuse `"elzero"`-style completion with a distinct track name.
- Nav: `components/SiteHeader.tsx` `NAV` array (add one entry + Arabic/English label).
- Validator: `scripts/validate-content.mjs` imports libs via `--experimental-strip-types`, checks stray scripts, duplicate ids, quiz answer keys, ElZero ≥2 questions/≥1 term, mixed Arabic/Latin glue, and (strict) internal hrefs. A Programming Advices block must be added with the same guarantees.
- i18n: `lib/i18n/config.ts` (`localePath`, `formatNumber`), `lib/i18n/server.ts` (`localeFromParams`, `pageMetadata`), `lib/i18n/context.tsx` (`useCopy`). All routes live under `app/[locale]/`.

### Step 1 findings (verified metadata)

- Both playlists fetched via Invidious (`inv.nadeko.net`), the only working source; counts match: course 1 = 20, course 2 = 50 (no duplicates inside a playlist).
- Source JSON: `out/programmingadvices/playlists.json` (ordered ids, titles, durations, per-video `problems`).
- Embeddability probed with `noembed.com` (returns oEmbed only for public, embeddable videos). All fetched videos pass except:
  - **`SKZyCrY6XEE` (course 2, position 37)** — `liveNow:true` on Invidious, `lengthSeconds:0`, no title/description, oEmbed 403. Needs a "Watch on YouTube" fallback lesson page (do not skip).
  - Two duplicate-looking durations (course 1 #5 and #16 both 38:28; #1 and #20 both 4:55) — confirmed by the transcript service's own `lengthSeconds`; kept as published.
- **No captions exist** for these videos (transcript service: `playabilityStatus: "OK", reason: "Transcript not available"` for 67/70; the 3 with captions are intro/update/lesson-12). Therefore every lesson stays `reviewed:false` with a conservative summary built from the **title + description only**; no transcript text is copied or published.
- Official course pages confirm the topic lists (used only as a checklist, not copied):
  - Course 1 `https://programmingadvices.com/p/00316b` — Data/Information/Knowledge/Wisdom → computers & components → binary/hex/octal → bytes/bits/nibbles → units of speed → programmer's calculator → networks → programming languages & translation → why C++ → operations → operator precedence → variables & constants.
  - Course 2 `https://programmingadvices.com/p/00316b1` — 50 flow-chart problems (inputs, arithmetic, conditions, loops, validation, number/letter printing, date/time, finance, ATM PIN), no code.
  - Terms of Use (read): personal non-commercial use only, no copying/mirroring/redistribution. Reinforces the prompt's legal boundaries: embed/link only, original content, credit + non-affiliation line.
- Author descriptions sometimes contain the author's own per-video timestamps (e.g. `00:39 Data Vs. Information`). Using them as a *topic checklist* is fine, but I will not copy the description text verbatim into summaries; summaries are written in our own words and flagged `reviewed:false`.

### Decisions for this task

1. **Content origin**: conservative Arabic summaries derived from the *title* + the author's *public description topic lines* (no transcript copying), `reviewed:false`. Terms and practice are original, written by me.
2. **Progress integration**: add `"programmingadvices"` as a new `Track` and `doneProgrammingAdvicesVideoIds` in `deriveProgress` (mirrors `doneEnglishVideoIds`); no existing URL or stored progress changes.
3. **Notes**: separate key `etm-programmingadvices-notes-v1` (same shape as English), included in Export/Delete.
4. **Video ids**: reuse the English track's scheme — course-prefixed stable ids; but since the prompt says "never break existing URLs", Programming Advices gets its own namespace (e.g. `pa1-01`…`pa1-20`, `pa2-01`…`pa2-50`) rather than continuing the English 021+ counter.
5. **Pilot**: build infrastructure + first 10 of course 1, then STOP for approval (prompt's CHECKPOINT).

### Files to add/change (plan)

- `lib/programmingadvices-videos.ts` (courses, videos, types, credit constants, finders)
- `lib/programmingadvices-notes.ts`
- `app/[locale]/programmingadvices/page.tsx` (hub, 2 cards)
- `app/[locale]/programmingadvices/[course]/page.tsx` (course page, grouped videos)
- `app/[locale]/programmingadvices/[course]/[video]/page.tsx` (lesson)
- `components/programmingadvices/` (video facade, lesson panel, terms, practice, notes, credit, completion)
- `components/SiteHeader.tsx` (nav entry), `components/SiteFooter.tsx` (link)
- `lib/progress/core.ts` + `store.ts` (new track + done array), `lib/progress` tests
- `app/sitemap.ts` (course + lesson entries)
- `scripts/validate-content.mjs` (Programming Advices block)
- `tests/e2e/programmingadvices.spec.ts`
- `docs/PROGRESS.md` (this section)

### Pilot report (2026-11-13)

**Shipped (uncommitted on `feature/programmingadvices-free-courses`).**

- Data: `lib/programmingadvices-videos.ts` holds both real, verified course cards (20 + 50 videos, official playlist ids) and the 10 shipped course-1 lessons; `lib/programmingadvices-course1.ts` holds the lessons; `lib/programmingadvices-notes.ts` is the private notes store (`etm-programmingadvices-notes-v1`).
- Progress: `programmingadvices` is a first-class track (`doneProgrammingAdvicesVideoIds`), fully covered by derive/toggle/export/import/delete and the shared Leitner queue. `isDone` also consults the PA done-set (bug found by E2E; fixed).
- UI: hub `/programmingadvices`, course pages `/programmingadvices/course/pa-foundations` + `/pa-algorithms`, lessons `/programmingadvices/pa1-01…10`, review `/programmingadvices/review` (ar + `/en`). Course 2 shows its verified card and 0/50, with an explicit "batches after pilot approval" note — no fake lessons.
- Lesson page: credit + non-affiliation, official video/playlist/course/channel links, click-to-load `youtube-nocookie` facade (`autoplay: 0`, resume, watched %), tabs Summary / Key terms / Practice / My notes. Summary shows the `reviewed:false` notice and the original published title.
- Practice types in the pilot: MCQ, ordering, matching, typed answer (binary/hex/octal conversion drills). Every item has bilingual hints + explanation; Miku exposes "hint" before answering and "explain my wrong answer", never the answer up front.
- Notes are local-first (no network request), exportable as JSON, deletable per lesson.
- Site themes: `miku` (default), `bootcamp`, `codecademy`; switcher in desktop + mobile headers; saved theme applied pre-paint via inline script; only presentation tokens change.
- Pomodoro: calm lofi links (Lofi Girl YouTube + Spotify playlist) added next to the existing SomaFM study radio; nothing autoplays.

**Gates (all rerun after the last code change):**

- `npm run typecheck` — clean.
- `npm run lint` — pre-existing warnings only (custom fonts in `app/not-found.tsx` + `app/[locale]/layout.tsx`; 3 `exhaustive-deps` in `Pomodoro.tsx`).
- `npm run test:content -- --strict` — PASS: elzero-web 6/390, english 36/458, programmingadvices 2 courses/10 videos, cs50x 13/0.
- `npm run test:unit` — 126/126 (new PA catalogue suite: 6 tests for course counts, playlist ids, ordered ids/urls, drills, credit, normalizers).
- `npm run build` — PASS, 1661 static pages (PA lesson pages = 10 × 2 locales).
- E2E `tests/e2e/programmingadvices.spec.ts` — 12/12 chromium-desktop, 12/12 mobile-chrome, hub re-verified on webkit; full webkit run is stable only with `--workers=1` (default 3 workers crashes the browser with "Target page, context or browser has been closed").

**Decisions recorded for this task (extend the list above):**

1. Course 2 stays a card + honest count until course 1 is finished; no placeholder lesson pages.
2. `SKZyCrY6XEE` (course 2 #37) is unavailable/private; when course 2 lands it ships a fallback "Watch on YouTube" lesson page, never a skipped position.
3. The validator counts *rendered* roadmap links (`href={ETM_PA_ROADMAP}` / literal URL), not imports, so the "max one" rule matches the UI.
4. Thumbnails still depend on `i.ytimg.com`, which is unreachable in this environment; the PA facade therefore renders a local poster/fallback and playback could not be visually verified here. `youtube.com`/`i.ytimg.com` `ECONNRESET` is environmental, not a code defect.
5. E2E asserts no-autoplay by aborting `https://www.youtube.com/iframe_api` and checking the plain embed mounts with `autoplay=0`.

**STOP point:** pilot ready for user review (hub, course page, lesson tabs, practice, notes, review, themes, mobile). Course 1 lessons 11-20 start only after approval.

## Themes + Lofi task - `feat/themes-lofi` (2026-11-14)

**Phase 0 - audit (read-only) - done.**

Pomodoro exists: `components/Pomodoro.tsx` (client) mounted once in `app/[locale]/layout.tsx`; floating chip bottom-end, collapsed by default, expands to the panel on every page (including lesson pages). Features today: focus/short/long modes (custom 15/25/50 focus lengths), start/pause/reset/skip, 4-session long-break cycle, chime + Miku message per phase, `focus_session` progress events (track `playground`), persistence (`etm-pomodoro-v1`), SomaFM study radio + 8 stations (`etm-radio-v1`), Spotify playlist embed + Lofi Girl YouTube link, and 5 synthesized ambient sounds (rain/night/ocean/space/campfire, `etm-ambient-v1`, Web Audio, added 2026-11-13).

Missing vs this task: desktop notification on phase change; a real music-source picker (Lofi Girl / Spotify compact / Off) with focus/break auto play-pause; per-theme volume; mute-during-quiz; now-playing title badge; credit line next to the player; cozy auto-enable + one-time tooltip; theme set is the old `miku/bootcamp/codecademy`, not the requested `light/dark/terminal/cozy`; tokens cover only accent/page/glow (no full ~25-token semantic layer).

Global audit (local production build, 6 most-visited pages `/`, `/curriculum`, `/elzero`, `/elzero-web`, `/playground`, `/dashboard`): all HTTP 200; axe critical/serious = 0; no stuck "Loading..."; sampled internal links (56) all resolve. Only recurring console noise: the two HilltopAds zone scripts 404 (`fond-appointment.com/...`) on every page - expected until the owner clicks "Verify" in the HilltopAds dashboard; not a code defect.

**Phase 1 - themes system - done.** Replaced the legacy 3-theme switcher with the requested 4 themes (`light`, `dark`, `terminal`, `cozy`); stored `etm-theme-v1` values migrate (miku/bootcamp -> dark, codecademy -> terminal) into `etm-theme-v2` so nobody loses their choice. Every colour utility used by the app now resolves to a CSS custom property in `app/globals.css` (Tailwind palette remapped in `tailwind.config.ts`), so all 2,449 prerendered pages restyle without content edits. Deliverables: `lib/theme.ts` (storage/migration/initial resolver/`applyTheme`/`THEME_EVENT`/`THEME_COLORS`/init script), 4 palettes + ~39 semantic tokens + per-theme RGB channels, terminal mono + CSS-only scanlines, 150 ms background/color/border transition via a temporary `theme-switching` class (disabled under `prefers-reduced-motion`), 4-icon `ThemeSwitcher` pill (44 px mobile / 32 px desktop, `aria-pressed`, localStorage + meta theme-color sync), Miku mood reactions (cozy -> sleepy, terminal -> thinking), and hardcoded UI colours removed from `TerminalLab`, `CodeBlock`, `HeroTerminal`, `Playground`, `ProgressDashboard`, `EnglishSpeaking` (new `lib/syntax-theme.ts`). Light theme keeps the required brand purple `#7C3AED`; AA fixes were done with dedicated `--color-link`/`--color-link-hover` tokens, a darker light `emerald-400` (`#047857`), and a light `slate-500` nudge to `#5E6C82` (4.48 -> 5.0 on the lesson-row background). Verified: build 2,449 prerendered routes; `typecheck` clean; `lint` only pre-existing warnings; unit 131/131; content pass 0 blocking; axe critical/serious = 0 on all 19 light-theme pages and on home/lesson/playground/dashboard/english-course/elzero-web-course/cs50x-lecture in dark/terminal/cozy; switcher persistence/migration probe; 360 px + 1280 px screenshots for all four themes at `docs/screenshots/themes/`.

**Phase 2 - lofi - done.** Three persisted sources (`lib/music.ts`): Lofi Girl official live on `youtube-nocookie` behind a click-to-load facade with metadata-only fallback + retry, Spotify playlist `2lbGxqs4WSMxVmMuIsolNr` as an 80 px embed, and Off. New `PomodoroMusic` engine starts on focus, pauses on break, resumes next focus, honours manual play/pause within a phase, caps at per-theme volume (30/30/25/40 stored in `etm-music-volume-v1`), pauses during quizzes when "mute during quiz" is ON (`etm-music-quiz-mute-v1`, `[data-quiz]` viewport detection), shows the now-playing title badge (`🎧 Lofi Girl - mm:ss - ...` / `⏳`), credit lines, and the one-time cozy tooltip (`etm-cozy-lofi-tip-v1`). `Pomodoro.tsx` adds the daily session counter (long break every 4th), desktop notifications on focus completion/break end (permission asked once, `etm-notif-asked-v1`), and the collapsed-by-default mini-timer on every page. Verified with fake-YT Playwright probes: no player before interaction; play/pause/resume across phases; single non-stacked title badge that clears on break; per-theme volume; Spotify 80 px; quiz mute on/off; cozy auto-enable + toast once; panel collapse keeps audio alive; notification ask-once + both phase messages; abort -> fallback links + retry -> nocookie host; mini-timer bottom-right EN / bottom-left AR with no Miku overlap. Real Lofi Girl live-stream embeddability and `youtube-nocookie` host support remain UNVERIFIED (YouTube is network-blocked in this environment); the fallback links are the live video, official uploads playlist and channel.

**E2E on the final build (2026-11-14).** Chromium desktop + Pixel 7 full matrix: 475 passed, 1 skipped, 4 failed - 2 are the protected user-WIP `programmingadvices.spec.ts` (legacy "Codecademy" theme assertions; and the facade test's global `iframe` count now collides with the pre-existing HilltopAds `fond-appointment.com` ad frames, confirmed by a DOM probe), 2 are pre-existing test assumptions that click the desktop "Courses" nav at mobile width without opening the hamburger (English + Linux nav tests). WebKit, run single-worker because parallel WebKit crashes under load: a11y 19/19, responsive 40/40, phase1-routes 120/120, remaining specs 60 passed / 1 failed (the same protected legacy theme test). Two earlier full-suite attempts were interrupted by environment restarts; the numbers above come from per-spec runs on the same final build. E2E helper fixes included: cap `document.fonts.ready` at 4 s (WebKit hangs when the font host times out) and filter generic WebKit `Timeout was reached` / `SSL connect error` console noise in `phase1-routes.spec.ts` (real 4xx/5xx still asserted through `badResponses`).

