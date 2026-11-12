# ETM — Home Handoff (transfer of this session to the home machine)

**Date**: 2026-11-11 · **Author**: this OpenCode session (you asked to carry everything to the home machine)
**Answers**: everything below is the distilled memory of the whole working session. The raw chat transcript is **not stored anywhere** — this digest is the authoritative handoff, kept in the repo so a fresh AI session at home can continue without it.

اقرأ بالترتيب: `docs/MASTER_PROMPT.md` → `docs/PROGRESS.md` → `docs/ENGLISH_SECTION.md` → هذا الملف.
التعليمات بالعربي للمستخدم، والأوامر والملفات بالإنجليزي.

---

## 1) الريبو والفروع (كلها push على GitHub)

- **`main` @ `380b475`** — production. Vercel بيعمل deploy تلقائي على أي push لـ main. **أي push لـ main = نشر فوري للمستخدمين.**
- **`feat/phase-4-english-section` @ `c056a5d`** — الشغل الجاري: Phase 4 (قسم الإنجليزية) كاملة كبنية، **بدون فيديوهات** (CHECKPOINT 1 متحققش). **ما يندمجش لـ main لسه.**
- `feat/phase-3-progress` @ `f387e9c` · `feat/phase-2-bilingual` @ `1bd72de` · `feat/phase-1-content-review` @ `dd34720` · `feat/phase-0-recon` @ `862562d`
- `fix/ci-green` @ `380b475` (merged into main by fast-forward, user-approved)
- فروع قديمة لم تُدمج وقرار مصيرها معلق (شاور المستخدم قبل أي خطوة): `feature/english-track` · `feature/lesson-playground` · `feature/books-refresh` · `fix/qa-pass`
- **Vercel**: main → production auto. فروع/PRs → preview deploys (زر Vercel في الـ PR). ظهر الـ branch banner في صفحة الريبو لأن الـ phase-4 فرع معمولو push لكن مفيش PR لسه — افتح PR (الزر "Compare & pull request") لو عايز preview + CI أخضر من غير ما تمس البرودكشين.

## 2) هل كل اللي اتعمل منشور؟

**نعم.** كل تعديلات الجلسة اتعملها commit → push. اللي على GitHub هو أحدث نسخة. `.next/` و`node_modules/` مش متسجلة في git (تتبنى من الأوامر تحت).
اللي مش على GitHub ومش محتاجه: ملفات مؤقتة في `%TEMP%\opencode` (scanner للـ mojibake وغيره) — موجودة بس لو لزم.

## 3) حالة التشغيل المعتمدة (البيت لازم يعيد إنتاجها)

### المتطلبات
- Node.js **≥ 22.6** (محليًا: v22.23.4) — مطلوب لسبب `node --experimental-strip-types` في `test:content` و`test:unit`.
- npm (محليًا 10.x). Windows أو Linux أو macOS — الاتنين تمام. تحذيرات PowerShell عادية على Windows.
- قرص: الفرع الصغير (~10 MB + تاريخ git ~120 MB). **تحذير من الجهاز الأصلي: قرص C: فضي تمامًا (0.0 GB) — الـ builds فشلت بـ ENOSPC. اعمل أي شغل كبير على E: أو أي قرص فيه مساحة.**
- Git مع اعتماد GitHub (في البيت أول push هيسأل عن تسجيل الدخول عبر المتصفح أو Personal Access Token بـ scope `repo`).

### أوامر التشغيل من الصفر
```powershell
git clone https://github.com/RaGAEIDOS/ETM.git
cd ETM
git checkout feat/phase-4-english-section   # أو main
npm ci                                      # تثبيت بالضبط حسب package-lock.json
npm run typecheck                           # tsc --noEmit
npm run lint                                # next lint (warnings موجودة موجودة، الـ gate هو "no errors")
npm run test:content -- --strict            # الـ content validator
npm run test:unit                           # node --experimental-strip-types --test tests/unit/*.test.ts (39/39)
npm run build                               # next build
npx playwright install chromium              # مرة واحدة
npx playwright test --project=chromium-desktop   # 192/192 (الويبسايت هيتطلب من الـ webServer في الـ config تلقائيًا على :3100)
```
ملاحظة: الـ `webServer` في `playwright.config.ts` بيشغل `next start -p 3100` تلقائيًا — اعمل `npm run build` الأول.

### الـ CI (GitHub Actions — `.github/workflows/qa.yml`)
- بيشتغل على **pull requests** وعلى **push لـ main و fix/qa-pass**. push لأي فرع تاني **مش هيعيد تشغيل الـ CI** (غير لو فتحت PR).
- الـ runs الحالية: #1 (fix/qa-pass) ✓، #2/#3/#4 فاشلة (تسرّب layout font-swap)، **#5 على main نجح ✓ في 2m30s** — التفاصيل: https://github.com/RaGAEIDOS/ETM/actions
- السبب الجذري للفشل وتم إصلاحه في `380b475`: قياس `scrollWidth` أثناء `display=swap` لتبادل الخطوط. الإصلاح: هيدر بـ `px-2`/`13px` + `waitHydrated` بيستنى `document.fonts.ready`. على GitHub runners (فيها Google Fonts) النص أوسع — وكان ده بيقلب الـ overflow assertion على حافة 1280px.
- **التاريخ الأحمر للـ commit القديم مش هيتمحى — اللي يهم هو الـ status على آخر commit.**
- PR #2 (`feat/phase-1-content-review`) هيفضل فاشل لحد ما يعمل merge لـ main داخله أو rebase.

## 4) خريطة الشغل — إيه خلص وإيه لسه

### المسارات
| Phase | الحالة |
|---|---|
| 0 | ✅ done (`docs/RECON.md`) |
| 1 | ✅ done — كل ملخصات ElZero بقالها ≥ سؤالان، كل المصطلحات الـ 75 مذكورة (`docs/CURRICULUM_REVIEW.md`) |
| 2 | ✅ done — bilingualar (unprefixed) + en (`/en/...`)، بدون next-intl (`docs/I18N_GUIDE.md` إن وُجد) |
| 3 | ✅ done + مدموج على الخريطة للـ branches — progress store `lib/progress/` (v2، local-first، يدعم export/import/delete my data) |
| **4** | **بنية كاملة (infra) على `feat/phase-4-english-section` — بلا محتوى. CHECKPOINT 1 متحققش** |
| 5+ | القادم بعد CHECKPOINT 1 وفقًا لـ MASTER_PROMPT §5 |

### Phase 4 — التفاصيل اللي لازم تعرفها في البيت
- البنية على `feat/phase-4-english-section`: مسارات `/english` و`/english/[video]` و`/english/review` (ar + /en)، facade مع IFrame API على youtube-nocookie، resume position، SRS Leitner (`lib/english/srs.ts`)، practice engine مختلط (mcq/fill/dictation/order/match)، notes محلي (`etm-english-notes-v1`)، completion = watched≥80% AND practice≥70% أو تأكيد يدوي.
- **`lib/english-videos.ts` → `englishVideos` فاضي على purpose.** ممنوع اختراع youtubeIds. القرص: courses فيها playlist ids حقيقية (من وصف القناة — تُفحَّص دومًا من الـ Playlists tab).
- **CHECKPOINT 1** = أول 20 فيديو من "English from zero" (PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ) بعد ما تتحول من `out/english-courses.json` وانت تراجعها — **توقف إلزامي** ودي نقطة المردود، مش نقطة اجتياز.

### كيف تستأنف Phase 4 في البيت (أهم جزء)
البيت عنده إنترنت عادي — غالبًا الـ YouTube هيكون شغال هناك. خطوة بخطوة:

1. **الوصول لـ YouTube**: `Invoke-WebRequest https://www.youtube.com` أو `curl -sI https://www.youtube.com` (في هذا الجهاز كانت كل hosts بتفشل: youtube.com, www.youtube.com, youtube-nocookie embed كان شغال، www.googleapis.com كان آخر واحد بيرد).
2. **لو متاح**: أنشئ YouTube Data API v3 key من Google Cloud Console (enable "YouTube Data API v3").
3. شغّل:
   ```powershell
   $env:YOUTUBE_API_KEY = "AIza..."
   node scripts/fetch-playlists.mjs
   ```
   المخرجات: `out/english-courses.json` بالـ playlists كاملة (ids، الترتيب، العناوين، مدد مع embedding).
4. **لو مش متاح أو بدون key**: `yt-dlp --flat-playlist -J <playlist-url>` لكل playlist وتغذية JSON بنفس الشكل (الـ script بيدعم الوضع ده؛ راجع رأس `scripts/fetch-playlists.mjs`).
5. **Transcribe أول 20 فيديو** من English from zero في `lib/english-videos.ts`:
   - `youtubeId` = نفس لاحقة `id` من JSON (بدون تخمين).
   - `titleEn` حكاية النص كما هو، `title` ترجمة عربية.
   - ملخص 2–4 جمل عربي **بكلماتك** من العنوان+الوصف. لو لا يمكن التأكد بدون مشاهدة → `reviewed: false` وتقبل.
   - 1–5 مصطلحات `{en, ar, example?{en, ar}}` / 3–5 أسئلة practice وفق نوع الكورس (grammar→mcq/fill، vocab→mcq/fill، listening/conversation→mcq/dictation، phonetics→mcq minimal pairs) مع `explanation` سطر واحد وإجابة صحيحة واحدة فقط.
   - `youtube` = `https://youtu.be/<id>?list=<playlistId>`، والمدة من JSON.
6. `npm run test:content` (لا قيود ElZero هنا) → `npm run build` → تأكد من فيديو واحد يدويًا (facade → click → embed → resume → practice → completion).
7. **انشر التغييرات** (الفروع) ثم التقرير للمستخدم مع **CHECKPOINT 1** — ولا تتقدم لـ Phase 5 قبل موافقته.

## 5) القرارات المطروحة على المستخدم (اللي لسه معلقة)

1. دمج فروع المراحل إلى `main` (الترتيب والموافقة) — لم يُحسم. ممنوع بدون إذن صريح.
2. مصير الفروع قبل التخطيط: `feature/english-track` · `feature/lesson-playground` · `feature/books-refresh` — استخدام/إعادة بناء/تجاهل.
3. ~~Phase 3 backend~~ — محسوم: local-first + JSON export/import؛ لا backend حاليًا.
4. Phase 6: تأكيد إزالة الـ 18 كتاب الموجودين على `/books` قبل إضافة القائمة الموثقة الـ 30–40.
5. Phase 4 YouTube: عالق في هذه البيئة؛ **جرّب في البيت** (انظر §4).
6. دفع لـ `main` = نشر برودكشين فوري (Vercel) — أي merge/push لـ main يلزمه موافقة المستخدم.

## 6) اشتراطات وفيس حقائق الوفاء بالبيئة الأصلية (للـ AI في البيت)

- **Google Fonts عبر `<link>` مع `display=swap`** — أي قياس layout (scrollWidth) لازم يسبق `document.fonts.ready`.
- Wandbox (المترجم الخارجي للـ playground) بيرد HTTP 500 من هنا — اختبر في البيت.
- GitHub sign-in ما اتحققش (مفيش test token) — الـ fallback فقط موجود.
- موقع `etm-learning.vercel.app` لسا بديل old sitemap معطوب على `2ec0f4d` (deploy معلق). النطاق الحالي في About: `etm-one-ruddy.vercel.app`.
- استعمال command `npm run test:content -- --strict` مش بدون `--strict` للتحقق الكامل من المحتوى.
- وقت الاختبار: `waitUntil: "domcontentloaded"` + seed `etm-miku-onboarding-done=1` (الـ helper موجود في `tests/e2e/helpers/ui.ts`).
- **لا تدفع إطلاقاً لـ `main`** بدون موافقة المستخدم — main ينشر برودكشين.

## 7) أوامر Git المرجعية (في البيت)

```powershell
# مشاركة عملك مع GitHub:
git add <paths>                        # اجعلها مسارات محددة وليس -A لو الريبة مش واضح
git status                             # تأكد مما ستدفع
git commit -m "type(scope): subject"
git push                               # للفروع الحالية (push تلقائي للفرع)
git push -u origin <branch>            # أول push لفرع جديد
# مرجع: main آمن Fast-forward فقط بعد موافقة المستخدم:
git push origin fix/ci-green:main      # هيك اللي حصل — بلا force-push
```
- لا تستخدم `--force` على أي فرع. Loses commits.
- لا تعمل `git push origin main --force` أبداً.
- قبل أي commit: `node C:\Users\miami.togo\AppData\Local\Temp\opencode\mojibake-scan.js` (في الجهاز الأصلي) — ملف غير متوقع U+FFFD في النصوص ملفوفة بالعربية لازم يتوقف.

## 8) ماذا عن ZIP في هذه الجلسة؟

هتستلم ملفًا `ETM-home-handoff-2026-11-11.zip` على أحد الأقراص — يعمل `.git` + الملفات المُتبعة في git فقط، **بدون** `node_modules` (nؤخدها بـ `npm ci` في البيت)، بدون `.next`، بدون `test-results/` أو `playwright-report/`. لو فتحت في البيت واشتغل مباشرة، جاهز للشغل والـ commit/push مباشرة.

> هذا الملف موثق في الريبو نفسه (`docs/HANDOFF.md`) ومربوط ضمن `feat/phase-4-english-section`. في البيت: `git show HEAD:docs/HANDOFF.md` يعرضه.
