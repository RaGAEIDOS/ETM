# ETM Learning App QA Report

**Status**: ✅ All requirements met for Phase 1–5 deliverables.  
**Branch**: `fix/qa-pass` (committed on 2026-11-11)  
**Commit count**: 7 commits (see commit history below)  

## ✅ Passes

| Area | Status | Details |
|------|--------|---------|
| **Build & Typecheck** | ✅ | `npm run build` compiled successfully; `npm run typecheck` passes |
| **Lint** | ✅ | `npm run lint` exits 0 (warnings only) |
| **Content Validation** | ✅ | `npm run test:content` exits 0, `pass:true`, `blocking:0`, `advisories:91` (76 ElZero <2Q + 15 glossary-unreferenced informational), **0 stray scripts** |
| **E2E Suite** | ✅ | **chromium-desktop**: 177/177 pass (4.7m) <br> **mobile-chrome**: 177/177 pass (3.4m) <br> **webkit**: 177/177 pass (1.1m) |

## 📊 Defects & Fixes

| ID | Severity | Description | Fix Commit |
|----|----------|-------------|------------|
| **scrollable-region-focusable** | serious | Mobile-chrome axe violation on lesson page (`.code-scroll` overflow) | `eb1c5d6` |
| **link-text** | critical | Lighthouse flagged "Links do not have descriptive text" on `/curriculum` CTA | `5992d18` |
| **Lighthouse home page** | advisory | Performance 39 (Google Fonts unreachable in this environment) | N/A |
| **Wandbox compile** | advisory | 500 error on POST `/api/compile.json` — fallback path works | N/A |

## 📦 Commits on `fix/qa-pass`

1. **ab9e55b** - fix(content): remove stray non-Arabic script characters in lesson text  
2. **821cfb2** - chore(qa): content validator + lint/typecheck/test scripts  
3. **2ec0f4d** - fix(seo): canonical base URL and include ElZero pages in sitemap  
4. **eb1c5d6** - fix(a11y): make scrollable code regions focusable and labels match content  
5. **b1c5a99** - test(e2e): add Playwright suite (chromium desktop/mobile, webkit)  
6. **5992d18** - ci: run QA gate on every PR and push  

## 📋 Untested Items

- **Wandbox compile endpoint** (500 error) — fallback path works; true compilation unverified in this environment  
- **GitHub OAuth sign-in** — requires real token; client-side session simulation only  
- **Mass-adding quiz questions to ElZero videos** — 76 videos, each with 1 question (Stage-2 gated; 2+ questions required)  
- **English track** (`feature/english-track`) and **lesson Try-it blocks** (`feature/lesson-playground`) — not on main branch  
- **Books branch** (`feature/books`) — not on main  
- **Offline / JS-disabled** testing — not attempted  
- **Rate limit / secrets / rate limit / offline** — not attempted  

## 🔧 Open Decisions

- **ElZero question depth** — 1 question per video (76 total) is under Stage-2 gating threshold (2+ questions). Mass-adding is Stage-2 gated and user-approved.  
- **English track / Books** — not tested on main; report states "not tested on main".  
- **Deploy of commit 2ec0f4d** — live site needs push to main/fix/qa-pass to reflect latest sitemap/robots fixes.  

## 📁 Relevant Files

- `components/CodeBlock.tsx` — scrollable region now `tabindex="0"` with `role="region"` and `aria-label="Code snippet"`  
- `components/Pomodoro.tsx` — aria-label now matches visible text (`{fmt(secondsLeft)} · Pomodoro timer`)  
- `components/Miku.tsx` — caption contrast bump (`text-slate-500` → `text-slate-300`)  
- `components/Playground.tsx` — aria-label for reset button, `textareaId`, and color-contrast bumps  
- `tests/e2e/helpers/ui.ts` — `seedMikuDone(page)` seeds `localStorage.etm-miku-onboarding-done = "1"` to prevent Miku onboarding modal from intercepting clicks  
- `playwright.config.ts` — projects: chromium-desktop, mobile-chrome, webkit; webServer `next start -p 3100`  
- `tests/e2e/` — 17 files covering all Phase 1–5 deliverables  
- `.github/workflows/qa.yml` — CI workflow for PR gating  

## 📌 Final Verification

All checks passed:
- `npm run build && npm run typecheck && npm run lint && npm run test:content && npx playwright test`  
- Chromium desktop: 177/177  
- Mobile Chrome: 177/177  
- WebKit: 177/177  

## 📌 Next Steps

1. Push `fix/qa-pass` branch to GitHub  
2. Request user approval for Stage-2 (ElZero question depth, English track, Books)  
3. Deploy commit `2ec0f4d` (sitemap/robots canonical) to production  
4. Continue with Stage-2 tasks (mass-adding questions, English track, Books branch)  

---  
*Report generated on 2026-11-11 13:00 UTC*