# Phase 1 — Curriculum & Content Review

**Date:** 2026-11-11
**Branch:** `feat/phase-1-content-review` (base: `feat/phase-0-recon`)
**Scope:** 4 stages · 19 courses · 128 lessons · 78 ElZero videos · 75 glossary terms · 18 books · 13 projects

This review covers lesson order/prerequisites, gaps, duplicates, difficulty jumps, terminology
consistency with the Glossary, technically wrong statements, broken links, garbled or
machine-translated Arabic, and stray script characters. No lesson, course, video, or glossary ID
was renamed or removed, so existing URLs and stored progress keep working.

---

## 1. Method

1. **Inventory.** Dumped every ElZero video (number, title, summary, terms, quiz) and every lesson
   quiz into temporary review files; compared each group lesson in `elzero-fundamentals` with the
   videos it claims to cover.
2. **Programmatic checks.** Extended `scripts/validate-content.mjs` (see §6) and ran it with
   `--strict` after every batch of edits.
3. **Manual read.** Read all 78 video summaries, all 156 video questions, all 128 lesson bodies, and
   all 382 lesson questions. Technical claims were checked against the C++ standard/library
   behaviour; Arabic was checked for machine-translation artifacts and Egyptian-Arabic consistency.
4. **Link audit.** Resolved every literal internal `href` against the real `app/` routes and against
   stage/course/lesson/video IDs. Checked 39 unique external source/book URLs over the network
   (YouTube IDs are validated by the content validator).
5. **Glossary audit.** Every lesson term was matched to a glossary entry; every glossary entry was
   checked for at least one inbound lesson reference.

---

## 2. Inventory (after the review)

| Item | Count |
|---|---|
| Stages / courses | 4 / 19 |
| Lessons | 128 |
| Lesson quiz questions | 382 |
| ElZero videos | 78 |
| ElZero questions | 156 (2 per video) |
| Glossary terms | 75 (all referenced) |
| Books | 18 |
| Projects | 13 |

---

## 3. User-flagged ElZero samples — verified and fixed

| # | Reported problem | What was wrong | Final state |
|---|---|---|---|
| 004 | `Ger?` | Stray `Ger?` at the end of the summary (`الأقل حجم Ger?`) | Removed; summary now ends with the VS Code vs Visual Studio comparison |
| 008 | wrong word | `ومتى تعبّق الكود نفسه` (not a word) | `ومتى تحذف الكود نفسه بدل تعليقه؟` |
| 022 | wrong words | `المعدّلات ... تضاعف النطاق للوجب` — broken grammar and wrong claim | `المعدّل unsigned يخصص كل البتات للقيم الموجبة، فيبدأ النطاق من 0 بدل السالب ويقترب من ضعف المدى الموجب` |
| 043 | unclear sentence | `القاعدة: العبّار عن حجم المصفوفة كثابت لعدم تكرار الأرقام` | `القاعدة: استخدم ثابتًا لحجم المصفوفة حتى لا تكرر الرقم في الكود` |
| 056 | wrong word | `(جاية قدام)` | `(ستأتي لاحقًا)` |
| 064 | unclear sentence | `أكبر ثلاث، وهمية حول مضلعات؟` — meaningless fragment | `أكبر ثلاثة أرقام، والقيمة المطلقة` and a corrected description of the three apps |

---

## 4. Problems found and fixed

### 4.1 ElZero track (`lib/elzero-videos.ts`)

- **Summaries:** 34 rewritten. Most were machine-translation artifacts, dropped words, or wrong
  technical claims (e.g. "المتغيرات بتتغير" statements that contradict static typing, wrong
  descriptions of `unsigned`, arrays, and pointers).
- **Questions:** 30 fixed — wrong answer key, ambiguous wording, two options saying the same thing,
  or a garbled option. Examples: `#004` IDE vs editor question, `#008` comment types, `#022`
  `unsigned char` range, `#043` array-size constant, `#056` pass-by-value, `#064` `abs(-7)`.
- **Coverage:** every one of the 78 videos previously had a single question. A codemod added a
  second, video-specific question to 76 videos (the two that already had two were left alone), for
  **156 questions**. New questions use balanced answer positions (0/1/2/3); legacy positions were
  not rotated (see §7.4).
- **Terms:** every video has at least one key term; duplicate term pairs and duplicate summaries were
  removed.

### 4.2 Lesson content (18 files under `lib/content/`)

**Technically wrong or misleading statements**

- `thinking-computer`: the `maxVal` explanation was inverted ("الصفر مش هيبقى أصغر من كلهم") and is
  now the correct reason (starting at 0 would make `maxVal` larger than every negative value).
  `while (true)` was described as suitable when the iteration count *is* known; corrected to
  "when the count is not known in advance".
- `elzero-fundamentals`: replaced the undefined-behaviour example `int b = a++ + ++a;` with two
  separate statements; corrected the `if / else if` walkthrough (`score = 85`), the `const` question
  wording, the `[2][3]` array option, the `sqrt` library question, and the pointer definition
  ("مؤشر ضال" → uninitialized pointer pointing at an arbitrary address).
- `algorithms`: DP was said to reduce exponential complexity "للوغاريتمي أو الخطي"; corrected to
  polynomial complexity (`O(n)` / `O(n×W)`). Greedy explanation no longer contains the English word
  `decision`.
- `architecture`: stack-machine `ADD` now says it *pops* the top two values (not "brings back").
- `compilers`: Maximum Munch wording corrected.
- `cpp-basics`: `s.length()` question no longer has a contradictory `s.size() فقط` option; value
  categories (`بتتبر` → `بتعتبر`) and parameter wording fixed.
- `data-structures`: BST speed explanation now states the real reason (`O(log n)` halving), the
  "tree is always balanced" distractor is no longer accidentally plausible, and `متداخللتين` was
  corrected.
- `security`: the Salt exercise now says two different Salt values produce two different hashes
  (the old `Saltين` was not a word); "ت Rail كود سليم" became a real false-positive explanation.
- `pointers-memory`: `unique_ptr` answer no longer claims "no overhead at all"; leak/delete wording,
  `نسبيت`, `محروقة`, `بيتساوى`, and `السيب فاضي` fixed.
- `git-github`: `ما جيهاتش للـ staging` → `ما اتضافتش للـ staging`; `عدّلتهم` → `عدّلوا`; `الإسطول`
  → `السيرفر`; `GitHub ما متاحش` → `GitHub مش متاح`.

**Machine-translation / foreign-language artifacts**

- `networking-db`: removed `partage`, `خserver`, `programming`, `conect`, `mugin` (4×), `بيشdlbi`,
  `جOIN`, `satisfy`, `هتshow`, `program متقفش`, `biblioteca`, `choix`, `quindi`, `جتر`, and a stray
  French `ici`. Example: "مكتبات تتصل بقواعد البيانات" instead of "مكتبات conect بقواعد البيانات".
- `distributed`: `النديم المحلي` → `النداء المحلي`; `متوجودة` → `موجودة`.
- `os` / `os-dev` / `game-engine`: `استقراراً` → `استقرارًا`; spacing around `Concurrency`, `LRU`,
  and `Mutex`.
- `stages.ts`: removed the English `just` from an Arabic sentence (`مش just كاتبع كود` → `مش مجرد
  كاتب كود`).
- `projects.ts`: `تطبيق real-world` → `تطبيق عملي`; `عميل ي connects` → `عميل يتصل`.

**Arabic typos / spacing / terminology consistency**

- `الشفرة المزيفة` → `الكود الزائف (Pseudocode)` everywhere in `thinking-computer`.
- `تريتيب` → `ترتيب`, `تحفّص` → `تفحص`, `بيتحديث` → `بيتحدّث`, `مب بيبانش` → `مش بيبان`, and
  similar.
- Removed duplicated spaces and glued Arabic/Latin words; a validator rule now blocks the general
  case (see §6).
- Standardized `std::array`, `std::vector`, `Mutex`, `LRU`, `Concurrency` spacing.

**Broken code/text details**

- `zero-variables`: `\\تTab` (an invalid escape inside the C++ string) → `\\tTab`.
- `pointers-memory` dynamic-memory prose now matches the code (`new` / `delete[]`, nulling the
  pointer after `delete`).
- `elzero-fundamentals` post/pre-increment example now prints `c` and is well-defined.

### 4.3 Glossary (`lib/glossary.ts`)

- Fixed two garbled descriptions caught by the new mixed-script rule:
  - `Reference`: `بيasher` → `بيشاور`
  - `Inheritance`: `بيكopy` → `بتكتسب`
- Added the missing lesson links for previously unreferenced terms (16 term entries across
  `algorithms`, `architecture`, `cpp-basics`, `data-structures`, `elzero-fundamentals`,
  `git-github`, `math-cs`, `networking-db`, `pointers-memory`, `thinking-computer`, `tools`).
  **All 75 glossary terms are now referenced by at least one lesson** (strict validator: 0
  advisories).

### 4.4 Links

- **Internal links:** the validator now resolves every literal internal `href` in `app/` and
  `components/` against the actual route table, including dynamic stage/course/lesson/video IDs.
  All resolve.
- **YouTube:** all 78 ElZero video links decode to a valid video ID.
- **External sources and books:** 39 unique URLs checked. Fixed 5 broken/wrong destinations:
  - `Think C++ Volume 1`: dead GitHub Pages URL → university-hosted free HTML edition; title
    corrected to *Thinking in C++, Volume 1 (2nd Edition)*.
  - `SICP`: `mitpress.mit.edu/sicp/` (404) → the MIT Press catalogue page for the book.
  - `learncpp.com` OOP chapter: old URL (404) → `introduction-to-object-oriented-programming/`.
  - `Discrete Mathematics: An Open Introduction`: `discrete.openmath.us` (dead) →
    `discrete.openmathbooks.org/dmoi3.html`.
  - *Mathematics for Computer Science*: OCW resource URL (redirect loop) → the course readings page.
- **Book metadata corrected:** *Crafting Interpreters* was credited to "Rob Pike & Dave Beyer" →
  Robert Nystrom; *How to Design Programs* was credited to "MIT Press" → its four authors;
  *Hello, Algo* was credited to "Alan Ts & others" → Yudong Jin (krahets) & contributors.
- Two sites return bot-block/rate-limit responses from this environment (`wiki.osdev.org` 403,
  `hello-algo.com` 429) but are valid; two timeouts (`gaia.cs.umass.edu`, `cs.bham.ac.uk` PDF)
  passed on retry.

---

## 5. Order, prerequisites, duplication, gaps

### 5.1 Findings

1. **Two parallel beginner tracks in Stage 1.** `cpp-basics` (8 text lessons) and
   `elzero-fundamentals` (13 lessons covering videos #001–#078) teach the same core material
   (variables, types, operators, conditions, loops, functions, arrays, strings, pointers).
   Today `elzero-fundamentals` comes last in Stage 1, after `git-github`, so a learner meets the
   same topics twice with no signposting.
2. **`git-github` overlaps `tools/git`.** `tools` contains a single Git/GitHub lesson, immediately
   followed by a six-lesson `git-github` course. The short lesson is a subset of the course.
3. **Stage 2 ordering issue.** `data-structures` comes before `recursion`, but its tree lesson uses
   recursive `insertNode`, `searchNode`, `inorder`, and `destroy` without having taught recursion
   yet. (The `recursion` course also owns sorting/searching and file I/O, so it is broader than its
   name.)
4. **Answer-position bias.** Lesson questions: index 0 = 122, index 1 = **246**, index 2 = 14,
   index 3 = **0**. ElZero: index 0 = 22, index 1 = **93**, index 2 = 22, index 3 = 19. New
   questions are balanced, but the legacy bank is not; a test-wise learner can guess "the second
   option" far too often.
5. **ElZero track stops at #078 (pointers).** References, OOP, virtual functions, templates, and the
   STL are only in the text courses. The video track ends without a hand-off to Stage 2.
6. **No dedicated build/test course.** `tools` covers compiler/CLI/debugging, and `git-github`
   covers collaboration, but CMake, unit testing, sanitizers, and CI are not taught as a unit —
   despite projects and the job-market pitch relying on them.
7. **Glossary breadth.** All 75 terms are now linked, but Stage 3/4 vocabulary (Raft, CAP,
   B-tree, LSM tree, sharding, etc.) is largely absent from the glossary.

### 5.2 Suggested structural changes (not applied — user decision)

These would change course order or content scope, so they are recorded here instead of being
applied silently. None of them requires deleting IDs or breaking URLs.

1. **Signpost the parallel tracks.** Keep both `cpp-basics` and `elzero-fundamentals`, but label the
   ElZero course as a *video reinforcement / alternative track* and add a short "if you already
   studied `cpp-basics`, skim these lessons" note. Alternatively move `elzero-fundamentals` directly
   after `cpp-basics` so the repetition is immediate reinforcement rather than a late surprise.
2. **Differentiate `tools/git` from `git-github`.** Keep `tools/git` as a 10-minute "what is version
   control" intro and link forward to the full course; or move `git-github` before `tools` so the
   intro lesson becomes the recap. Merging them would break URLs/progress, so it is not proposed.
3. **Teach recursion before trees.** Swap `data-structures` and `recursion` in Stage 2, or move the
   `trees` lesson after `recursion-intro` / `recursion-patterns`. This is the highest-value order
   fix in the plan.
4. **Rotate legacy answer positions in a separate pass.** Keep the correct answer text and
   explanation unchanged; rotate options deterministically per question so the distribution is
   roughly uniform. This is a content-quality change, not a correctness fix, so it is left to the
   user.
5. **Add a hand-off at the end of the ElZero track.** On `/elzero` and video #078, point to
   `oop`, `pointers-memory` (deep dive), and `data-structures` as the next step.
6. **Add a short "Build & Test" module** (CMake, one unit-test framework, ASan/UBSan, a CI
   workflow) — either as new lessons in `tools` or a new Stage 3 course. New IDs only; no existing
   URL changes.
7. **Expand the glossary for Stage 3/4** if the user wants full coverage; current 75 terms are
   consistent and all referenced.

---

## 6. Validator changes (`scripts/validate-content.mjs`)

Hard failures added (exit 1):

- **U+FFFD replacement character** anywhere in the repo (catches silent encoding damage).
- **Arabic/Latin words glued together** at runtime (2+ letters on each side), e.g. `بيasher` or
  `مugin`. Intentional prefixes such as `بـMutex` and `وGitHub` are not affected.
- **Literal internal `href` that does not resolve** to a static route or to an existing
  stage/course/lesson/video ID.
- **ElZero video with fewer than 2 questions** (promoted from advisory; the 78-video bank now
  satisfies it).
- **ElZero video with zero terms** or a term with an empty `en`/`ar`.

Fixed while extending it:

- The stage schema check referenced a non-existent `STAGES` export and silently checked nothing;
  it now uses `stageMetas`.
- The internal-link resolver initially matched route segments by index instead of by parameter
  name; corrected before it was trusted.

Advisories that remain (strict mode turns them into failures, and strict is currently clean):

- Glossary entries never referenced by a lesson.
- Invalid ISBN-13 checksums (no ISBN fields exist today).
- ElZero video outside its declared section range.

---

## 7. Verification

```text
npm run typecheck                         PASS
npm run lint                              PASS
npm run test:content -- --strict          PASS  (blocking 0, advisories 0)
npm run build                             PASS  (252 static pages)
npx playwright test --project=chromium-desktop   PASS (177/177)
```

Also checked:

- `git diff --check` — no whitespace errors.
- No lesson/course/video/glossary ID was renamed or removed.
- No quiz answer index left outside `0..options.length-1`; no duplicate options or questions in the
  ElZero bank.
- All 75 glossary terms have at least one inbound lesson reference.

---

## 8. Remaining risks / notes

- **External links rot.** The validator does not check external URLs on every run (network
  flakiness and rate limits); the audit in §4.4 was a one-off pass.
- **Answer-position bias** remains in the legacy question bank (§5.1.4). It does not affect
  correctness, but it weakens quiz quality.
- **ElZero progress helpers are dead code.** `saveElzeroProgress` / `isElzeroDone` are never called;
  video quiz attempts are not persisted. This belongs to Phase 3 (progress & stats), not Phase 1.
- **Books are provisional.** All 18 entries are AI-added and Phase 6 may replace them; the link and
  author fixes above keep the current page honest until that decision is made.
- **No i18n yet.** `app/layout.tsx` still hardcodes `<html lang="en" dir="ltr">`; Phase 2 owns the
  bilingual shell. Phase 1 only guarantees the Arabic content itself is clean.
