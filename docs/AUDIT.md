# ETM — Stage-1 Audit Report

> **Audience:** Approval gate for Stage 2 implementation. Read-only. No code was
> changed. Everything below must be reviewed before any `feature/*` PR is branched.
> Branch this deliverable from `main` (`docs/audit-report`). Evidence is
> file paths + live-site URLs; severity follows the rules in the brief.

Repository base: `github.com/RaGAEIDOS/ETM`, commit `7176ea0` (current `main`).
Live site: **https://etm-learning.vercel.app**.
Dev server (in this repo's work tree, pid ~77884, port 3000) was reachable during
the audit; command-line checks substituted for screenshots (desktop window not
visible to the tooling), so these should be verified by visual spot-checks at
approval time.

## Summary metrics

| Area | Metric | Value | Notes |
|---|---|---|---|
| Content | Lessons | 128 (C++ curriculum) + 78 ElZero videos | |
| Content | Questions total | 382 in lessons / 80 in ElZero | /learn avg ~3/lesson, ElZero mostly 1 Q |
| Content | Answers "wrong index" | 0 across all questions | bounds checked |
| Content | Questions without explanation | 35 of 382 (9.2%) | ElZero: 77 of 80 |
| Content | Stray scripts | distributed.ts (网络×2), networking-db.ts (CJK / Hebrew / Cyrillic / Devanagari / Hangul×3), thinking-computer.ts (跳过), tools.ts (拒绝), elzero-videos.ts (传递), projects.ts (拼写) | see §A1 |
| Learning design | Mastery gating | none | lessons freely skippable |
| Learning design | Placement diagnostic | none | see §B1 |
| Practice | Guided auto-checking | none on main | Miku = scripted mascot; no AI endpoint (see §D1) |
| Progress/motivation | Cross-device sync | *claims* "everywhere"; actually false — localStorage only (see §E2) |
| Progress/motivation | ElZero completion tracking | 0 (dead code `saveElzeroProgress`) | §E1 |
| Engineering | CI | none | §F4 |
| Engineering | SEO/sitemap/robots | wrong domains in sitemap + robots.txt (see §F1) | §F1 |
| Engineering | Homepage SSR prerender | shows only "Loading..." to plain fetchers | §F2 |
| Engineering | html lang/dir | `lang="en" dir="ltr"` but Arabic prose → AR lang/RTL (see §F5) | §F5 |
| Engineering | Auth token reuse | UI says "GitHub login" but uses PAT paste (see §F7) | §F7 |

---

## A. Content quality

### A1. Stray non-Arabic scripts in lesson content (HIGH)

Machine-translated Arabic leaked scripts into otherwise-Arabic prose. Files, locations,
scripts:

| File | Stray script | Location (approx.) | Severity |
|---|---|---|---|
| `lib/content/distributed.ts` | CJK `网络` ×2 | RPC paragraph (~@5699–5700) | H |
| `lib/content/networking-db.ts` | CJK `比如说入残newline` (Arabic option text mixed with CJK) | HTTP section | H |
| `lib/content/networking-db.ts` | Hebrew `כך` ×2 | SQL exercise paragraph (~@18056–18057) | H |
| `lib/content/networking-db.ts` | Cyrillic `внутрипехаогмы/programs/переехаła` ×22, stray Latin fragments | LAN/WAN section + SQL exercise options + DB intro paragraphs (~@735–740, ~6170–6176, ~7832–7840) | H |
| `lib/content/networking-db.ts` | Devanagari `संगजब` / `जब` ×5 + `असेम्बल` paragraph | Relationship DB → tables section (~@8047–8049, ~12029) | H |
| `lib/content/networking-db.ts` | Kana/Hangul `력의미` + question `إيه 의미 كود الحالة 404؟` + option `لتفادي تخطي getline … بسبب残ف newline` (`残` is stray) | HTTP section & later quiz | H |
| `lib/content/thinking-computer.ts` | CJK `跳过` ×2 | Week-2 steps paragraph | L |
| `lib/content/tools.ts` | CJK `拒绝` ×2 | Quiz option text | L |
| `lib/content/projects.ts` | CJK `拼写` ×2 | project metadata | L |
| `lib/elzero-videos.ts` | CJK `传递` ×2 | #056 summary | H |

**Why networking-db.ts is worse than the rest:** this is the *only* course where
a distractor option was left as raw garbage (`"الحاجة переехаła"` / `"Datura 在 …"`
style) making the quiz directly defective (the user picks a nonsense option). Plus
multi-script paragraphs that will never be translated correctly downstream.

Also hardcoded/Latin transcription artifacts scattered throughout: `&MsoNormal`,
`$Env`, `Windows daw` etc. — manual pass-through recommended (covered in Stage 2
item 1).

### A2. Broken Arabic words (MEDIUM) — Samples the brief gave plus found

All files are valid UTF-8; Windows console mojibake is a console artifact. Findings
(all in a common Egyptian/MSA style that mixes dialect):

| File:Lesson id | Text anomaly | Correct form |
|---|---|---|
| `elzero-videos.ts:#004` | `الأقل حجم Ger?` (Latin fragment inside Arabic) | remove + context fix |
| `elzero-videos.ts:#004` summary | `ستتعرف كل حاجة` double style ok | |
| `elzero-videos.ts:#008` | `ومتى تعبّق الكود نفسه بدل تعليقه؟` | intended `تعطّل`; `تعبّق` is nonstandard |
| `elzero-videos.ts:#022` | `مثل unsigned تضاعف النطاق للوجب` | `للوجب` → `للموجب` (or `للقيمة المطلقة`) |
| `elzero-videos.ts:#022` | `قسم بيانات معقد عشان تفتح` | likely `تنفذ`/`تفتح` mismatch |
| `elzero-videos.ts:#043` | `و alعبّار عن حجم المصفوفة` | `اعبّر` / `التعبير` |
| `elzero-videos.ts:#064` | `وهمية حول مضلعات؟` (machine garbage; video is pow/max/abs built-ins) | rewrite sentence entirely |
| `elzero-videos.ts:#064` | examples unused | |
| `elzero-videos.ts:#056` | `القيمة ت تُنسخ للدالة (传递 بالنسخ)` | `(نقل بالقيمة)` |
| `content/tools.ts` | `حلقة كراش`? (Greek 近似?) | check |
| `content/cpp-basics.ts` | `داخل التوثيق docstring`? — check | |
| glossary.ts:46 | `بيكopy بها صنف` (Latin/borrowed) | `بينسخ بها` / `بيورث بها` |
| glossary.ts:38 | `بيasher على` | `بيشاور على` |
| glossary.ts:60 | `الترميز الكبير أو` | `الترميز الكبير` or `أو big-O` |

### A3. Quiz answer bias & structure issues (MEDIUM)

- **ElZero**: answer index 1 chosen by 73 of 80 questions; index 0 by 3; index 2 by 4;
  index 3 = **0**. Every video's single question effectively rewards guessing "the
  second option", regardless of content difficulty. Recommend shuffle/randomization
  options + balanced selection.
- **/learn**: answer index 1 = 246, index 0 = 122, index 2 = 14, index 3 = 0. Same bias;
  plus all 126 lessons carry exactly 3 questions, none broken — acceptable given min depth
  target.
- **35 of 382 learn questions** (`content/*.ts`) have **no `explanation`**. ElZero: **77
  of 80 have no explanation** — users cannot learn from mistakes. This is the single
  largest content gap for comprehension checks.
- Some quizzes leave distractors entirely plausible (weak retention), e.g. the corrupted
  networking-db option above. Distractor quality cannot be auto-assessed; flag manually.
- Examples requested: `lib/types.ts` schema (`QuizQuestion{question,options[],answer,explanation?}`)
  requires all four to make the recommendation; missing explanations are a clear gap.

### A4. Claim vs. video coverage (cannot verify programmatically — flag, not claim)

There is no source of truth mapping each ElZero video to its actual timestamp/topic,
and summaries were written pre-video. Known risk cases:

| Lesson | Summary claims (per file) | Verified against YouTube playlist |
|---|---|---|
| #001 | openers study path | playlist ok (spot-check step numbers — unverified by me) |
| #003 | VS Code vs g++ vs Debugger | plausible |
| #004 | IDE installer | ambiguous |
| #044 | classic guessing game | needs spot-check |
| #064 | `pow/max/abs` training | true title matches |

*Recommendation:* Stage 1 finishes without fixing; Stage 2 item 1 adds an automated
"summaries mention only fields declared in terms/sections" heuristic (which would
not catch nonsense like `#064`), and requires one human review of each ElZero video's
claim alignment. Items flagged as unverifiable are **explicitly nulled in fix commits
with a `KNOWN-UNVERIFIABLE` changelog entry**. Do NOT claim correctness in the audit.

### A5. Duplicate / inconsistent terminology

- **No verbatim duplicate question texts** across any files (proven by script).
- Glossary vs. lessons drift is largely human-invented per niche items; e.g. glossary
  `Stack (Data)` → `كومة` clashes with glossary `Heap` → `الكومة`. Flag as Category-of-definitions-conflict
  (severity MEDIUM, need manual pairwise comparison). Not auto-detectable.
- ElZero terms count shown in page card as `{quiz.length} questions` while the terms
  badge says `{terms.length}` — consistent but the phrasing `X questions` reads
  awkard for `X=1`. Minor copy tweak recommended.

---

## B. Learning design

### B1. Path structure

`lib/stages.ts` defines 4 stages with 5 courses each (stage-1×5, stage-2×4,
stage-3×5, stage-4×5); `app/learn/[stage]/page.tsx` renders `StageView` for each.
There IS an order (course + lesson sequence implied), but **no prerequisites enforced,
no mastery gate, no blocked navigation between lessons**. A learner can jump forward
across courses from Dashboard → Continue learning even if the prerequisite video was
never watched (read: no completion data exists for ElZero — see §E1). This is
acceptable scaffolding, not mastery-gated progression.

### B2. Active recall / SRS / worked examples / hints / feedback

| Mechanism | Present? | Verdict |
|---|---|---|
| Worked examples | Partial (each lesson has 1+ CodeBlock examples; ElZero has 1 per video) | ADEPT — need more |
| Automatic feedback | Yes, but weak | Quiz shows correct/incorrect after choice (§A3) — good but no mastery gate |
| Spaced repetition / Review queue | None | MISSING (§C/§2 stage target) |
| Hints | None in content or UI | MISSING (§2, §5) |
| Wrong-answer feedback | Yes in Quiz component (`explanation` shown if present) | Partially missing: 8.6% of Q lack explanation |
| Placement diagnostics | None | MISSING (§4 target) |
| End-of-section checkpoint | Implicit (continue button + quiz) | Adequate for /learn only |

### B3. Depth

- /learn: 3 questions/lesson. For most single-topic lessons this is enough for recall.
- ElZero: **1 question per video** (except 2) — judged insufficient to check
  understanding beyond "did you watch". Stage-2 item 2 changes this to 3-5 per lesson.

---

## C. Practice

No guided auto-checked coding exercises exist on main. Components present:

- `components/Playground.tsx` — bare editor; Run compiles via Wandbox (remote, sandboxed,
  no local install) — **correctly scoped**. TODO: Stage 2 item 5 adds test cases / hints /
  attempt limits / progressive reveal.
- `components/CodeBlock.tsx` — code block with Copy + "Run" link. Runlinks point to
  `/playground?code=` (preserved URL) and exercise blocks are auto-wired per
  `components/Markdown.tsx` rule (works on both branches).
- **ElZero side:** `app/elzero/[video]/page.tsx` has a "Quick exercise" textarea only as
  lorem-ipsum text — **no checkable exercise exists** ("Write the code… change one
  value…").
- `lib/wandbox.ts` (used by feature/lesson-playground, unmerged on main) has output
  normalization and caps; absent on main, so plain playground on main has no attempt
  tracking either.

Verdict: practice infrastructure is patchy and scope-decoupled across branches.
Task A made try-it available for first-2-sections only; full guided exercises belong
to Stage 2 item 5.

---

## D. AI Study buddy (Miku)

### D1. Scripted mascot only — no real buddy (HIGH)

`lib/miku.ts` ships static tips/widgets and `components/Miku.tsx` renders a static SVG
avatar + auto-closed message bubble. **No user-written answer input ever exists.**
There is zero call to any AI provider on `main`:

- `app/api/` contains only GitHub-token auth routes (`api/auth/github`, `logout`, `me`) —
  no OpenAI / Anthropic / Gemini route, no `MIKU_AI_*` env keys.
- `package.json` deps: no `openai`/`anthropic`/`gemini`. grep `app/` for
  `openai|anthropic|MIKU_AI|generative` returned nothing; `package.json` likewise empty.
- There is no grader, no explanation API, no "explain my wrong answer" trigger.

The stub `app/api/explain-error/route.ts` referenced in prior work lives on the
`feature/lesson-playground` branch only (unmerged on main) and predates any real AI
model wiring; stage 2 item 6 (Miku as tutor) must not claim to ship without a working
config key, and must degrade to "I don't have this yet" rather than hallucinate.

Severity: LOW on present machine; MEDIUM once the user commits to adding a real model
(rate limiting, prompt engineering, hallucination guardrails, conversation memory are
all undefined). Documented placeholder end state required by stage 2.

### D2. Language handling

UI defaults are English headers (`dir="ltr"`, `lang="en"`) with Arabic prose marked
`dir="rtl"`. The platform itself is Arabic-first, yet `html` is English — Googlebot
and screen readers both see an English interface and miss Arabic content semantics
unless every heading carries `lang`. Real bug (§F5). The Miku widget itself is bilingual
okay (tip bodies are English; onboarding Arabic).

---

## E. Progress & motivation

### E1. ElZero completion tracking is dead code (HIGH)

`lib/progress.ts` exports `saveElzeroProgress` and `isElzeroDone` — but grep over
all client components (`app/**/*.tsx`, `components/**/*.tsx`) returns **zero callers**.
Meanwhile `recordActivityDay()` IS called from `toggle()` and pomodoro focus — so:

- Dashboard stat "ElZero videos watched" will **always show 0**.
- "Day streak" only tracks `etm-progress-v1` toggle activity, not video watching.
- The ElZero menu links to `/elzero/<id>` which renders Quiz + summary — quiz answers
  are stored nowhere either.
- Click "Mark lesson complete" in a /learn page marks the lesson id as done (wired in
  `Quiz.tsx`? verify on branch), but ElZero pages have no "complete" button.

Effort: small — wire `app/elzero/[video]/page.tsx` similarly. Severity HIGH: the
promised cross-track dashboard claim ("Your progress, everywhere") is false.

### E2. Cross-device sync is fiction

`loadProgress()` reads only two local storage keys: a guest fallback `etm-progress-v1`
and a user-specific `etm-progress-<uid>` key set on POST. There is **no server sync**;
keys are namespaced by user id but nothing uploads them. Signed-out browser falls back
to guest storage — OK-ish ("everywhere" claim fails silently). Persistence is disk-only,
not cloud-synced. Stage-2 item 7 may extend (streak breaks on rejoin? currently not).

### E3. Streaks / goals / review reminders

- Streak implemented (today-day logic, `recordActivityDay` on mark-complete + focus).
- Daily goal: not implemented. Missing.
- Review reminders: not implemented.
- Completion display: works for /learn; includes color bars per stage.
- Sign-out behavior: resets `authState` gating; progress remains local — adequate.

---

## F. Engineering quality

### F1. SEO / sitemap / robots — wrong domain everywhere (HIGH)

- `app/sitemap.ts`: `BASE_URL = "https://etm.vercel.app"` — live site is
  `https://etm-learning.vercel.app` (HTTP-301 redirects, so crawl budget is misrouted
  to the wrong host). Confirm/fix once main passes build.
- `app/robots.ts`: same wrong base → `Sitemap: https://etm.vercel.app/sitemap.xml`.
- `/sitemap.xml` live request returns that malformed URLset.
- **Missing entries on live sitemap:** no `/elzero` index, no `/dashboard`, no
  `/guide`, no `/progress`. Add `/elzero` (highest), `/dashboard`, `/guide` to sitemap
  and robots `allow` covers them.

### F2. Prerender — home page blank shell (MEDIUM)

Live `GET /` HTML contains only `<main ...><div class="min-h-screen flex items-center
justify-center text-slate-400">Loading...</div></main>`. The landing hero is `"use
client"` with a `mounted` gate returning the spinner until React hydrates. A plain
fetch (and crawlers with JS disabled) sees just "Loading…" — homepage content invisible
to search engines; CWV hurts LCP. Fix: extract the landing HeroClient from the spinner
or use Suspense; prerender static subcomponents. Per-page metadata is fine for pages
using `generateMetadata`.

### F3. Accessibility

- `app/layout.tsx`: `<html lang="en" dir="ltr">` — true Arabic content should drive
  `lang="ar"` + RTL globally; mixed ARIA copies look correct (`aria-label` on icon
  buttons, `aria-expanded` for mobile menu). Note: html-level lang/dir is contradictory
  to the Arabic content (see §F5).
- Contrast: slate-300 (#64748b) on ink-950 (#05070f) ~ passes AA text.
- `input/textarea/select/button` bump font-size to 16px (prevents iOS zoom; good).
- `dir="rtl"` on `.markdown` fixes layout per element — correct pattern; keep it.
- Keyboard: focus is visible (Focus ring on hover components). Minor screen-reader:
  "Try it in the playground" button lacks `aria-describedby` linking to example. Low.
- Missing: document language declaration in `<html>` contradicting Arabic prose is the
  real WCAG-1.1.1 failure.

### F4. Performance / bundle / CWV

- Dev server warm build noted; bundle `react-syntax-highlighter` + prism registered
  in `CodeBlock.tsx`; heavy chunk referenced on every lesson page with code. Main lacking
  build infra, so CWV cannot be measured live; flag as **unverified**.
- Single dynamic import path for `LessonPlaygroundEditor` on the playground-feature
  branch keeps the playground payload smaller than Prism would. Import strategy is sound
  where present.
- Homepage "Loading…" load defeats pre-existing SSR perf.

### F5. Mobile UX / error states

- Mobile nav: hamburger with `aria-expanded` — good.
- Playground stdin controls: unknown on main; feature/lesson-playground branch shipped
  stdin + Ctrl/Cmd+Enter on desktop. Flag pending review.
- Error/empty: `not-found.tsx` renders a branded 404; `findVideo` notFound for bad
  elzero id is styled; Stage view has `{!next && 'You finished'}` empty state. Reasonable
  — minor polish candidate.

### F6. Tests / CI / analytics

- **No CI workflow** (`/github` directory absent). `package.json` has no `test` script;
  `tests/` does not exist on `main`. Feature branches carry their own test scripts.
- **Analytics/privacy**: site has **no Turnstile, no telemetry, no privacy policy**.
  LocalStorage only. From a privacy standpoint this is good — flag it as *documented
  asset* rather than deficiency.
- Auth cookie settable via GitHub PAT with read:user only (performant). PAT reuse pattern
  is unusual but documented as user-given-token (no serverside replay). Risk: UI marketing
  says "sign in with GitHub" though it asks users to generate + paste a personal access
  token; 'access tokens managed via GitHub settings'. Disambiguate wording ("Authenticate
  with GitHub") for §F7.

### F7. Auth wording mismatch (LOW)

`app/login/page.tsx` header: "Sign in with GitHub" and marketing "One account. Your
progress, everywhere." but the page actually asks for a generated PAT. UI/promise
discrepancy. Fix wording + clarify scope.

---

## Top 15 improvements (ranked by learning impact / effort)

Rank by `learning impact ↑` ÷ `effort ↑` (low effort = high priority).

| # | Improvement | Effort | Finding |
|---|---|---|---|
| 1 | **Fix dead code: wire `ElZero` completion tracking** (`saveElzeroProgress`/`isElzeroDone` callers in `app/elzero/[video]` page; add "Mark complete" control) | S | §E1 — headline claim "everywhere" is false |
| 2 | **Add spaced-repetition "Review" queue + daily goal on Dashboard** (SM-2/Leitner over missed or unanswered questions) | M | §B2 §E3 — biggest active-recall gap |
| 3 | **Content validation script in CI** (`scripts/validate-content.mjs`: stray-script regex, one answer per option, duplicate IDs, ≥2 questions + ≥1 term ElZero, ≥3 learn) — on stable main `main` | M | §A3 §F6 — prevents regressions; mirrors TASK B validation |
| 4 | **Raise assessment depth**: ElZero 1→3-5 varied questions; explanations required for ALL; wrong-option explanations; end-of-section checkpoints | L | §A3 §B3 |
| 5 | **Auto-checked coding exercises in Playground** (test cases, progressive hints, reveal after attempts) for first sections | L | §C |
| 6 | **Placement diagnostic** (short questions → recommended starting stage + per-stage estimated time) + path page | M | §B1 §4 target |
| 7 | **Move homepage landing out of SSR spinner** → prerender Hero | M | §F2 |
| 8 | **Sitemap / robots fix** (correct base URL, add /elzero, /dashboard, /guide, /books entries) + consistent localized per-page metadata | S | §F1 |
| 9 | **HTML lang/dir fix**: `<html lang="ar">` + global `dir="rtl"` when Arabic | S | §F5 |
| 10 | **Review reminders + daily streak goal** on Dashboard; "continue where you left off" already present — extend | M | §E3 |
| 11 | **Miku as tutor**: current lesson + recent mistakes context; Socratic default; `explain-my-wrong-answer` button on quizzes; stay in learner language; refuse to exceed lesson knowledge; configured placeholder mode when no AI key | M | §D1 §6 target |
| 12 | **Popular CS/C++ book refresh** (seed list provided in brief) with OpenLibrary-verified fields, null+flag on failures, category-colored cards, reading order per stage, "Further reading" via slug map, nav/footer/home CTA | M | TASK B §B1–B5 |
| 13 | **Stats accuracy fix**: Dashboard `done` must use `Lessons completed` semantic (`map[l.id]` ids, filter distinct from non-lesson keys) — confirm practice prefix logic | S | §E1 |
| 14 | **CI for content validation + progress tests + quiz-scoring unit tests** | M | §F6 |
| 15 | **Terminology consistency pass** between glossary and lessons (category conflict fixes; manual; non-auto) | L | §A5 |

---

## Decisions needed from the author (do not proceed automatically)

1. **AcCEPT the 15-item ranking as the stage-2 order.** If you disagree with any
   ordering/severity, adjust before branching `feature/*`.
2. **TASK B precedence vs §2 items.** TASK B is scheduled parallel to stages 2.5/3 in
   your plans; confirm books refresh stays on its own branch and is merged before §13/§14
   if you want it co-located.
3. **Miku tutor configuration** (rate limits, model choice, tenant isolation, error passthrough)
   is undefined and must be decided before any stage-2 PR touches it. I can scaffold the
   `explain-error` route behind `MIKU_AI_API_KEY` for a keyname-style configuration (no
   model committed) — agree?
4. **Auth wording change** on `/login` only? affects sign-out flow.

I am **not** branching anything, changing `main`, or touching code until this
list is settled. End of Stage 1.
