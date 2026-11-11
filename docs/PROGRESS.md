# ETM — PROGRESS LEDGER

Single source of truth for the multi-phase master plan (`docs/MASTER_PROMPT.md`).
Update after every task. If a session is interrupted, resume from here.

**Updated**: 2026-11-11 · **Branch**: `feat/phase-1-content-review` (base: `feat/phase-0-recon` @ `862562d`, which is based on `fix/qa-pass` @ `840be10`)

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Recon & baseline | **done** | `docs/RECON.md`, 39 baseline screenshots, all baseline checks run |
| 1 — Curriculum & content review | **done** | `docs/CURRICULUM_REVIEW.md`; all 78 ElZero videos now have 2 questions; all 75 glossary terms referenced; validator strict-clean. Structural suggestions awaiting user decision (§5.2 of the review). |
| 2 — Bilingual site (ar + en) | todo | No i18n exists today; `<html lang="en">` hardcoded |
| 3 — Progress & stats system | todo | Current: localStorage booleans + streak/focus logs; no unified event API |
| 4 — Dedicated English section | todo | English scaffold exists on `feature/english-track` (unmerged, no video data). **CHECKPOINT 1** after first 20 videos of "English from zero" |
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
- Always navigate with `waitUntil: "domcontentloaded"` (Google Fonts unreachable here), and seed `etm-miku-onboarding-done=1` before clicking.
- Do **not** run `npm audit fix --force` (would jump Next 14 → 16).

## Decisions needed (ask the user)

1. **Merge order**: merge `fix/qa-pass` (QA suite + CI + SEO canonical + a11y fixes) into `main` before starting Phase 1? Phase 0 branch is based on it.
2. **Existing unmerged branches**: `feature/english-track` (scaffold), `feature/lesson-playground`, `feature/books-refresh` — reuse, rebase, or discard? They predate the master plan.
3. **Phase 3 backend**: no backend exists. Default = local-first + JSON export/import (per prompt), sync only if a backend is approved.
4. **Phase 6 books**: confirm removing all 18 current `/books` entries (all added by AI) before adding the verified 30–40 list.
5. **Phase 4 YouTube access**: is a YouTube Data API v3 key available in env, or should content collection rely on `scripts/fetch-playlists.mjs` run locally?

## Unverified / environment limits

- Wandbox compilation: endpoint returned HTTP 500 from this environment; Playground verified only on its friendly-error fallback.
- GitHub sign-in: no test token; only the token-paste flow and signed-cookie code were inspected.
- Live deployment: `etm-learning.vercel.app` is reachable but serves the pre-fix sitemap/robots (`etm.vercel.app`); repo fix `2ec0f4d` awaits deploy.
- YouTube Data API / playlist metadata: not fetched yet (Phase 4).
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
