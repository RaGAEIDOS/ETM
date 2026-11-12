// Content integrity validator for ETM.
//
// Guarantees (hard, exit 1):
//  - no stray characters from unexpected scripts anywhere in the repo
//    (CJK / Hebrew / Cyrillic / Devanagari / Thai / Hiragana-Katakana /
//     Hangul / Fullwidth)
//  - every (lesson, video) id unique; no empty ids
//  - every quiz: integer answer index inside options range, non-empty
//    question, non-empty options, no duplicate options, no placeholder-only
//    questions
//  - ElZero videos: id matches zero-padded number, in 001..078, unique,
//    and every video has at least 2 quiz questions and at least 1 key term
//  - glossary entries: unique `en`, valid category, non-empty fields
//  - free books: non-empty title/author/url, non-empty categories, level in 1..4
//  - courses/stages/sources: non-empty name + url on every source
//  - sitemap BASE_URL matches PASS_URL when PASS_URL is exported
//  - elzero-video youtube links from the real watcher list decode to a valid id
//  - no Arabic/Latin words glued together in runtime content strings
//  - every literal internal href in app/ and components/ resolves to a real
//    route (static page or a dynamic route with an existing stage/course/
//    lesson/video id)
//  - no Unicode replacement characters (U+FFFD) anywhere
//
// Advisory (never exit 1 by default; become failures with --strict):
//  - glossary entries never referenced by any lesson term
//  - book records with ISBN-13 whose checksum is invalid (only if isbn fields
//    exist; none today)
//  - elzero video listed outside its declared section range
//
// Exit code: 0 = pass (advisories printed but not blocking), 1 = failures.
// Usage:
//   node --experimental-strip-types scripts/validate-content.mjs [--strict]
//   PASS_URL=https://etm-learning.vercel.app node scripts/validate-content.mjs

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const cwd = process.cwd();
const PASS_URL = process.env.PASS_URL || '';
const strict = process.argv.includes('--strict');
const FAILURES = [];
const ADVISORIES = [];
const fail = (file, line, detail) => FAILURES.push({ file, line, detail });
const warn = (file, line, detail) => ADVISORIES.push({ file, line, detail });
const finish = () => {
  const maybeHard = strict ? ADVISORIES.map((a) => a.detail) : [];
  if (strict) FAILURES.push(...ADVISORIES);
  console.log(
    JSON.stringify(
      {
        summary: {
          pass: FAILURES.length === 0,
          strict,
          blocking: FAILURES.length,
          advisories: ADVISORIES.length,
        },
        failures: FAILURES,
        advisories: ADVISORIES,
      },
      null,
      2
    )
  );
  process.exit(FAILURES.length ? 1 : 0);
};

// ---------- stray scripts: whole repo ----------
const STRAY_RANGES = [
  [0x3400, 0x9fff, 'CJK Ideographs'],
  [0xf900, 0xfaff, 'CJK Compatibility'],
  [0x0590, 0x05ff, 'Hebrew'],
  [0x0400, 0x04ff, 'Cyrillic'],
  [0x0900, 0x097f, 'Devanagari'],
  [0x0e00, 0x0e7f, 'Thai'],
  [0x3040, 0x30ff, 'Hiragana/Katakana'],
  [0xac00, 0xd7af, 'Hangul syllables'],
  [0xff00, 0xffef, 'Fullwidth forms'],
];
const SCAN_EXCLUDE = new Set(['node_modules', '.next', '.git', 'test-results', 'playwright-report', 'out']);
const SCAN_EXT = new Set(['.ts', '.tsx', '.md', '.json', '.mjs', '.yml', '.css', '.html']);
function scanStray(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (SCAN_EXCLUDE.has(entry)) continue;
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    if (st.isDirectory()) { scanStray(p); continue; }
    if (!SCAN_EXT.has(path.extname(p))) continue;
    const rel = path.relative(cwd, p);
    const src = fs.readFileSync(p, 'utf8');
    const lines = src.split(/\r?\n/);
    for (let li = 0; li < lines.length; li++) {
      for (const ch of lines[li]) {
        const cp = ch.codePointAt(0);
        if (cp === 0xfffd) {
          fail(rel, li + 1, 'Unicode replacement character U+FFFD (garbled text)');
          continue;
        }
        for (const [lo, hi, name] of STRAY_RANGES) {
          if (cp >= lo && cp <= hi) {
            fail(rel, li + 1, `stray script char ${name} (U+${cp.toString(16).padStart(4, '0')}) "${ch}"`);
            break;
          }
        }
      }
    }
  }
}
scanStray(cwd);

// ---------- helpers ----------
const importLib = (rel) => import(pathToFileURL(path.join(cwd, rel)));
const importEachLesson = async (fn) => {
  for (const f of fs.readdirSync('lib/content').filter((x) => x.endsWith('.ts'))) {
    const m = await importLib(path.join('lib', 'content', f));
    await fn(m, f);
  }
};
const isPlaceholder = (s) => /^\s*(\.\.\.|…|todo|fixme|tbd)\s*$/i.test(String(s ?? ''));
const MIXED_SCRIPT_RE = /[A-Za-z]{2,}[\u0621-\u064A]{2,}|[\u0621-\u064A]{2,}[A-Za-z]{2,}/;
const checkMixed = (file, tag, value) => {
  if (typeof value !== 'string') return;
  const m = value.match(MIXED_SCRIPT_RE);
  if (m) fail(file, -1, `${tag}: Arabic/Latin glued without a space: "${m[0]}"`);
};

// ---------- lessons: ids + quiz schema ----------
const seenLessonIds = new Map();
await importEachLesson(async (m, f) => {
  for (const l of m.lessons ?? []) {
    if (!String(l?.id ?? '').trim()) fail(f, -1, 'lesson with missing/empty id');
    else if (seenLessonIds.has(l.id)) fail(f, -1, `duplicate lesson id "${l.id}" (also in ${seenLessonIds.get(l.id)})`);
    else seenLessonIds.set(l.id, f);
    checkMixed(f, `lesson "${l.id}" title`, l.title);
    checkMixed(f, `lesson "${l.id}" description`, l.description);
    checkMixed(f, `lesson "${l.id}" exercise`, l.exercise);
    for (const [si, s] of (l.sections ?? []).entries()) {
      checkMixed(f, `lesson "${l.id}" section ${si} heading`, s.heading);
      checkMixed(f, `lesson "${l.id}" section ${si} body`, s.body);
    }
    for (const [ci, c] of (l.code ?? []).entries()) {
      checkMixed(f, `lesson "${l.id}" code ${ci} title`, c.title);
      checkMixed(f, `lesson "${l.id}" code ${ci}`, c.code);
    }
    for (const [ti, t] of (l.terms ?? []).entries()) checkMixed(f, `lesson "${l.id}" term ${ti}`, t.ar);
    if (!Array.isArray(l?.quiz) || l.quiz.length === 0) { fail(f, -1, `lesson "${l?.id}": missing/empty quiz`); continue; }
    l.quiz.forEach((q, qi) => {
      const tag = `lesson "${l.id}" q${qi}`;
      checkMixed(f, `${tag} question`, q.question);
      checkMixed(f, `${tag} explanation`, q.explanation);
      (q.options ?? []).forEach((o, oi) => checkMixed(f, `${tag} option ${oi}`, o));
      if (!String(q.question ?? '').trim()) fail(f, -1, `${tag}: empty question`);
      if (isPlaceholder(q.question)) fail(f, -1, `${tag}: placeholder question`);
      if (!Number.isInteger(q.answer)) return fail(f, -1, `${tag}: answer "${q.answer}" not an integer`);
      if (q.answer < 0 || q.answer >= (q.options?.length ?? 0)) return fail(f, -1, `${tag}: answer ${q.answer} out of range 0..${(q.options?.length ?? 1) - 1}`);
      const opts = (q.options ?? []).map((o) => String(o ?? '').trim());
      if (opts.some((o) => !o)) fail(f, -1, `${tag}: empty option(s)`);
      if (opts.some(isPlaceholder)) fail(f, -1, `${tag}: placeholder option`);
      if (new Set(opts).size !== opts.length) fail(f, -1, `${tag}: duplicate option strings`);
    });
  }
});

// ---------- ElZero videos: integrity + advisories ----------
{
  const m = await importLib('lib/elzero-videos.ts');
  const videos = m.elzeroVideos ?? [];
  const seenNums = new Set();
  for (const v of videos) {
    const vid = String(v.id).padStart(3, '0');
    if (!/^(0[0-7][0-9]|078)$/.test(vid)) fail('lib/elzero-videos.ts', -1, `video id "${v.id}" not in 001..078`);
    if (Number(v.id) !== Number(v.number)) fail('lib/elzero-videos.ts', -1, `video #${vid}: id=${v.id} != number=${v.number}`);
    if (seenNums.has(v.number)) fail('lib/elzero-videos.ts', -1, `duplicate video number ${v.number}`);
    seenNums.add(v.number);
    if (!String(v.title ?? '').trim() || !String(v.summary ?? '').trim()) fail('lib/elzero-videos.ts', -1, `video #${vid}: empty title/summary`);
    checkMixed('lib/elzero-videos.ts', `video #${vid} summary`, v.summary);
    if (!Array.isArray(v.terms) || v.terms.length === 0) {
      fail('lib/elzero-videos.ts', -1, `video #${vid}: zero terms`);
    } else if (v.terms.some((t) => !String(t?.en ?? '').trim() || !String(t?.ar ?? '').trim())) {
      fail('lib/elzero-videos.ts', -1, `video #${vid}: term with empty en or ar`);
    }
    for (const [ti, t] of (v.terms ?? []).entries()) checkMixed('lib/elzero-videos.ts', `video #${vid} term ${ti}`, t.ar);
    if (!Array.isArray(v.quiz) || v.quiz.length < 2) fail('lib/elzero-videos.ts', -1, `video #${vid}: only ${v.quiz?.length ?? 0} question(s) (need >= 2)`);
    v.quiz?.forEach((q, qi) => {
      const tag = `video #${vid} q${qi}`;
      checkMixed('lib/elzero-videos.ts', `${tag} question`, q.question);
      checkMixed('lib/elzero-videos.ts', `${tag} explanation`, q.explanation);
      (q.options ?? []).forEach((o, oi) => checkMixed('lib/elzero-videos.ts', `${tag} option ${oi}`, o));
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) fail('lib/elzero-videos.ts', -1, `${tag}: invalid answer key ${q.answer}`);
      if (!String(q?.question ?? '').trim()) fail('lib/elzero-videos.ts', -1, `${tag}: empty question`);
      if (isPlaceholder(q.question)) fail('lib/elzero-videos.ts', -1, `${tag}: placeholder question`);
      const opts = (q.options ?? []).map((o) => String(o ?? '').trim());
      if (opts.some((o) => !o)) fail('lib/elzero-videos.ts', -1, `${tag}: empty option`);
      if (new Set(opts).size !== opts.length) fail('lib/elzero-videos.ts', -1, `${tag}: duplicate option strings`);
    });
    const yt = String(v.youtube ?? '');
    if (yt.includes('watch?v=')) {
      const mid = yt.match(/watch\?v=([A-Za-z0-9_-]{11})/);
      if (!mid) fail('lib/elzero-videos.ts', -1, `video #${vid}: youtube URL "${yt.slice(0, 80)}" has no valid v= id`);
    }
  }
  const sorted = [...seenNums].sort((a, b) => a - b);
  const max = sorted[sorted.length - 1] ?? 0;
  const missingNums = [];
  for (let i = 1; i <= max; i++) if (!seenNums.has(i)) missingNums.push(i);
  if (missingNums.length) warn('lib/elzero-videos.ts', -1, `missing video numbers: ${missingNums.map((n) => String(n).padStart(3, '0')).join(', ')}`);
  // section ranges from sectionsList
  const sections = (m.sectionsList ?? []).map((s) => {
    const match = /^#(\d+) - #(\d+)$/.exec(s.range ?? '');
    return match ? { ar: s.ar, lo: Number(match[1]), hi: Number(match[2]) } : null;
  }).filter(Boolean);
  for (const v of videos) {
    const sec = sections.find((s) => v.number >= s.lo && v.number <= s.hi);
    if (sec && sec.ar !== v.section) warn('lib/elzero-videos.ts', -1, `video #${String(v.id).padStart(3, '0')}: section "${v.section}" but lies in range of "${sec.ar}"`);
  }
}

// ---------- linux videos: integrity ----------
{
  const m = await importLib('lib/linux-videos.ts');
  const videos = m.linuxVideos ?? [];
  const sections = m.LINUX_SECTIONS ?? [];
  const sectionIds = new Set(sections.map((s) => s.id));
  const sectionVideos = new Set();
  for (const s of sections) {
    for (const n of s.videos ?? []) sectionVideos.add(Number(n));
    const badIds = (s.videos ?? []).filter((n) => !Number.isInteger(n) || n < 1 || n > 53);
    if (badIds.length) fail('lib/linux-videos.ts', -1, `section "${s.id}": video numbers out of 1..53: ${badIds.join(', ')}`);
  }
  const seenIds = new Set();
  const seenNums = new Set();
  for (const v of videos) {
    const vid = String(v?.id ?? '');
    if (!/^lnx-\d{2}$/.test(vid)) fail('lib/linux-videos.ts', -1, `video id "${vid}" not matching lnx-NN`);
    else if (seenIds.has(vid)) fail('lib/linux-videos.ts', -1, `duplicate video id "${vid}"`);
    seenIds.add(vid);
    if (!Number.isInteger(v.number) || v.number < 1 || v.number > 53) fail('lib/linux-videos.ts', -1, `video "${vid}": number ${v.number} out of 1..53`);
    else if (seenNums.has(v.number)) fail('lib/linux-videos.ts', -1, `duplicate video number ${v.number}`);
    seenNums.add(v.number);
    if (vid !== `lnx-${String(v.number).padStart(2, '0')}`) fail('lib/linux-videos.ts', -1, `video id "${vid}" != number ${v.number}`);
    if (!sectionIds.has(v.section)) fail('lib/linux-videos.ts', -1, `video "${vid}": unknown section "${v.section}"`);
    if (!String(v.title ?? '').trim() || !String(v.summary ?? '').trim()) fail('lib/linux-videos.ts', -1, `video "${vid}": empty title/summary`);
    checkMixed('lib/linux-videos.ts', `video "${vid}" title`, v.title);
    checkMixed('lib/linux-videos.ts', `video "${vid}" summary`, v.summary);
    if (!sectionVideos.has(Number(v.number))) fail('lib/linux-videos.ts', -1, `video "${vid}" (#${v.number}): not listed in any LINUX_SECTIONS entry`);
    const yt = String(v.youtube ?? '');
    const embedOk = /^[A-Za-z0-9_-]{11}$/.test(String(v.youtubeId ?? ''));
    if (!embedOk) fail('lib/linux-videos.ts', -1, `video "${vid}": invalid youtubeId "${v.youtubeId}"`);
    if (!yt.startsWith('https://www.youtube.com/watch?v=')) fail('lib/linux-videos.ts', -1, `video "${vid}": youtube URL "${yt.slice(0, 80)}" unexpected`);
    if (typeof v.reviewed !== 'boolean') fail('lib/linux-videos.ts', -1, `video "${vid}": reviewed flag not boolean`);
    const terms = v.terms ?? [];
    const practice = v.practice ?? [];
    // Bulk lessons (11-53) ship empty terms/practice until curated — that is
    // allowed; lessons WITH content must be complete.
    if (terms.length > 0 || practice.length > 0) {
      if (terms.length < 1) fail('lib/linux-videos.ts', -1, `video "${vid}": has practice but zero terms`);
      if (practice.length < 2) fail('lib/linux-videos.ts', -1, `video "${vid}": only ${practice.length} practice item(s) (need >= 2)`);
      for (const [ti, t] of terms.entries()) {
        if (!String(t?.en ?? '').trim() || !String(t?.ar ?? '').trim()) fail('lib/linux-videos.ts', -1, `video "${vid}" term ${ti}: empty en or ar`);
        checkMixed('lib/linux-videos.ts', `video "${vid}" term ${ti}`, t.ar);
      }
      if (terms.length > 5) fail('lib/linux-videos.ts', -1, `video "${vid}": ${terms.length} terms (max 5)`);
      if (practice.length > 5) fail('lib/linux-videos.ts', -1, `video "${vid}": ${practice.length} practice items (max 5)`);
      practice.forEach((p, pi) => {
        const tag = `video "${vid}" practice ${pi} (${p?.type})`;
        if (!String(p?.prompt ?? '').trim() && p?.type !== 'match') fail('lib/linux-videos.ts', -1, `${tag}: empty prompt`);
        checkMixed('lib/linux-videos.ts', `${tag} prompt`, p?.prompt);
        checkMixed('lib/linux-videos.ts', `${tag} explanation`, p?.explanation);
        if (!String(p?.explanation ?? '').trim()) fail('lib/linux-videos.ts', -1, `${tag}: empty explanation`);
        if (p.type === 'mcq') {
          const opts = (p.options ?? []).map((o) => String(o ?? '').trim());
          if (opts.length < 2) fail('lib/linux-videos.ts', -1, `${tag}: fewer than 2 options`);
          if (opts.some((o) => !o)) fail('lib/linux-videos.ts', -1, `${tag}: empty option`);
          if (new Set(opts).size !== opts.length) fail('lib/linux-videos.ts', -1, `${tag}: duplicate option strings`);
          if (!Number.isInteger(p.answer) || p.answer < 0 || p.answer >= opts.length) fail('lib/linux-videos.ts', -1, `${tag}: invalid answer key ${p.answer}`);
        } else if (p.type === 'cmd' || p.type === 'chmod') {
          if (!String(p.answer ?? '').trim()) fail('lib/linux-videos.ts', -1, `${tag}: empty answer`);
          if (!Array.isArray(p.accept) || p.accept.length === 0) fail('lib/linux-videos.ts', -1, `${tag}: empty accept list`);
          else if (p.accept.some((a) => !String(a ?? '').trim())) fail('lib/linux-videos.ts', -1, `${tag}: empty accept entry`);
        } else if (p.type === 'order') {
          const steps = (p.steps ?? []).map((s) => String(s ?? '').trim());
          if (steps.length < 2) fail('lib/linux-videos.ts', -1, `${tag}: fewer than 2 steps`);
          if (steps.some((s) => !s)) fail('lib/linux-videos.ts', -1, `${tag}: empty step`);
          if (new Set(steps).size !== steps.length) fail('lib/linux-videos.ts', -1, `${tag}: duplicate steps`);
        } else if (p.type === 'match') {
          const pairs = p.pairs ?? [];
          if (pairs.length < 2) fail('lib/linux-videos.ts', -1, `${tag}: fewer than 2 pairs`);
          const lefts = pairs.map((pr) => String(pr?.left ?? '').trim());
          const rights = pairs.map((pr) => String(pr?.right ?? '').trim());
          if (lefts.some((x) => !x) || rights.some((x) => !x)) fail('lib/linux-videos.ts', -1, `${tag}: empty pair side`);
          if (new Set(lefts).size !== lefts.length) fail('lib/linux-videos.ts', -1, `${tag}: duplicate left side`);
          if (new Set(rights).size !== rights.length) fail('lib/linux-videos.ts', -1, `${tag}: duplicate right side`);
        } else {
          fail('lib/linux-videos.ts', -1, `${tag}: unknown type "${p?.type}"`);
        }
      });
    }
  }
  for (let i = 1; i <= 53; i++) if (!seenNums.has(i)) fail('lib/linux-videos.ts', -1, `missing video number ${i}`);
}

// ---------- glossary: schema + curated-coverage advisory ----------
{
  const m = await importLib('lib/glossary.ts');
  const terms = m.glossaryTerms ?? [];
  const categories = new Set(m.GLOSSARY_CATEGORIES ?? []);
  const seenEn = new Map();
  for (const t of terms) {
    if (!String(t?.en ?? '').trim()) fail('lib/glossary.ts', -1, 'glossary term with empty `en`');
    else if (seenEn.has(t.en)) fail('lib/glossary.ts', -1, `duplicate glossary term "${t.en}" (also ${seenEn.get(t.en)})`);
    else seenEn.set(t.en, 'lib/glossary.ts');
    if (!String(t?.ar ?? '').trim() || !String(t?.description ?? '').trim() || !String(t?.category ?? '').trim()) fail('lib/glossary.ts', -1, `glossary "${t?.en}": empty ar/description/category`);
    if (t?.category && !categories.has(t.category)) fail('lib/glossary.ts', -1, `glossary "${t?.en}": category "${t.category}" not in GLOSSARY_CATEGORIES`);
    if (isPlaceholder(t.en) || isPlaceholder(t.ar)) fail('lib/glossary.ts', -1, `glossary "${t?.en}": placeholder field`);
    checkMixed('lib/glossary.ts', `glossary "${t?.en}" ar`, t.ar);
    checkMixed('lib/glossary.ts', `glossary "${t?.en}" description`, t.description);
  }
  const referenced = new Set();
  await importEachLesson(async (m2) => {
    for (const l of m2.lessons ?? [])
      for (const t of l.terms ?? []) referenced.add(String(t.en).toLowerCase());
  });
  const linuxGlossary = await importLib('lib/linux-videos.ts');
  for (const v of linuxGlossary.linuxVideos ?? [])
    for (const t of v.terms ?? []) referenced.add(String(t.en).toLowerCase());
  for (const t of terms) {
    if (!referenced.has(String(t.en).toLowerCase())) warn('lib/glossary.ts', -1, `glossary term "${t.en}" not referenced by any lesson term (informational)`);
  }
}

// ---------- free books: schema ----------
{
  const m = await importLib('lib/free-books.ts');
  const list = (m.freeBooksByCategory ?? []).flatMap((c) => (c.books ?? []).map((b) => ({ ...b, category: c.category })));
  let idx = 0;
  for (const c of m.freeBooksByCategory ?? []) {
    if (!Array.isArray(c.books) || c.books.length === 0) fail('lib/free-books.ts', -1, `category "${c.category}" has no books`);
  }
  for (const b of list) {
    idx++;
    const name = b.title || `book#${idx}`;
    if (!String(b.title ?? '').trim() || !String(b.author ?? '').trim()) fail('lib/free-books.ts', -1, `${name}: empty title/author`);
    else if (!/^https?:\/\//.test(String(b.url ?? ''))) fail('lib/free-books.ts', -1, `${name}: missing/invalid url`);
    else if (!Number.isInteger(b.level) || b.level < 1 || b.level > 4) fail('lib/free-books.ts', -1, `${name}: level ${b.level} not in 1..4`);
    else if (!['PDF', 'Online', 'Ebook', 'Tutorial', 'List'].includes(b.format)) fail('lib/free-books.ts', -1, `${name}: format "${b.format}" invalid`);
    if (isPlaceholder(b.title) || isPlaceholder(b.desc)) fail('lib/free-books.ts', -1, `${name}: placeholder text`);
    // ISBN-13 checksum detection (only if it ever shows up in the data)
    for (const field of ['isbn', 'isbn13']) {
      if (b[field] && !isbn13Valid(b[field])) warn('lib/free-books.ts', -1, `${name}: ${field} ${b[field]} failed ISBN-13 checksum (advisory)`);
    }
    const digits = String(b.url).match(/(?:978|979)\d{10}/);
    if (digits && !isbn13Valid(digits[0])) warn('lib/free-books.ts', -1, `${name}: ISBN-13 ${digits[0]} in url failed checksum (advisory)`);
  }
}

// ---------- stages/courses/sources: schema ----------
{
  const m = await importLib('lib/stages.ts');
  for (const s of m.stageMetas ?? []) {
    if (!String(s.name ?? '').trim() || !String(s.tagline ?? '').trim()) fail('lib/stages.ts', -1, `stage "${s.id}": empty name/tagline`);
    checkMixed('lib/stages.ts', `stage "${s.id}" name`, s.name);
    checkMixed('lib/stages.ts', `stage "${s.id}" tagline`, s.tagline);
    checkMixed('lib/stages.ts', `stage "${s.id}" description`, s.description);
    for (const c of s.courses ?? []) {
      if (!String(c.title ?? '').trim()) fail('lib/stages.ts', -1, `course "${c.id}": empty title`);
      checkMixed('lib/stages.ts', `course "${c.id}" title`, c.title);
      checkMixed('lib/stages.ts', `course "${c.id}" description`, c.description);
      for (const src of c.sources ?? []) {
        if (!String(src?.name ?? '').trim() || !/^https?:\/\//.test(String(src?.url ?? ''))) fail('lib/stages.ts', -1, `course "${c.id}": source with empty/invalid name or url: ${JSON.stringify(src)}`);
      }
    }
  }
}

// ---------- internal links: app/ + components/ hrefs ----------
{
  const { stageMetas } = await importLib('lib/stages.ts');
  const { elzeroVideos } = await importLib('lib/elzero-videos.ts');
  const stageIds = new Set((stageMetas ?? []).map((s) => s.id));
  const courseStage = new Map();
  const courseIds = new Set();
  for (const s of stageMetas ?? []) {
    for (const c of s.courses ?? []) {
      courseIds.add(c.id);
      courseStage.set(c.id, s.id);
    }
  }
  const lessonsByCourse = new Map();
  await importEachLesson(async (m, f) => {
    lessonsByCourse.set(f.replace(/\.ts$/, ''), new Set((m.lessons ?? []).map((l) => l.id)));
  });
  const routePages = [];
  const linkFiles = [];
  const walk = (dir, collectLinks) => {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry);
      const st = fs.statSync(p);
      if (st.isDirectory()) { walk(p, collectLinks); continue; }
      if (entry === 'page.tsx') routePages.push(p);
      if (collectLinks && p.endsWith('.tsx')) linkFiles.push(p);
    }
  };
  walk(path.join(cwd, 'app'), true);
  walk(path.join(cwd, 'components'), true);

  const routes = routePages.map((p) => {
    const rel = path.relative(path.join(cwd, 'app'), p);
    const segs = rel.split(path.sep).slice(0, -1);
    // Drop the [locale] segment: it matches both ar (unprefixed, the default
    // locale) and /en/..., so routes stay in their pre-i18n shape.
    if (segs[0] === '[locale]') segs.shift();
    return segs;
  });
  const videoIds = new Set(elzeroVideos.map((v) => String(v.id)));
  const { linuxVideos: linuxVideosRaw, linuxCourses: linuxCoursesRaw } = await importLib('lib/linux-videos.ts');
  const linuxVideoIds = new Set((linuxVideosRaw ?? []).map((v) => String(v.id)));
  const linuxCourseIds = new Set((linuxCoursesRaw ?? []).map((c) => String(c.id)));
  const paramChecks = {
    stage: (v, segs) => segs[0] === 'learn' && stageIds.has(segs[1]),
    course: (v, segs) =>
      segs[0] === 'linux'
        ? linuxCourseIds.has(segs[2])
        : courseIds.has(segs[2]) && courseStage.get(segs[2]) === segs[1],
    lesson: (v, segs) => segs[0] === 'learn' && courseIds.has(segs[2]) && courseStage.get(segs[2]) === segs[1] && Boolean(lessonsByCourse.get(segs[2])?.has(segs[3])),
    video: (v, segs) => (segs[0] === 'linux' ? linuxVideoIds.has(segs[1]) : videoIds.has(segs[1])),
  };
  const resolves = (pathname) => {
    let segs = pathname.split('/').filter(Boolean);
    // Strip an explicit locale prefix: ar (default) also serves unprefixed
    // URLs, and /en/... is the English variant of the same route.
    if (segs[0] === 'en' || segs[0] === 'ar') segs = segs.slice(1);
    if (!segs.length) return true;
    for (const route of routes) {
      if (route.length !== segs.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < segs.length; i++) {
        const part = route[i];
        if (part.startsWith('[') && part.endsWith(']')) params[part.slice(1, -1)] = segs[i];
        else if (part !== segs[i]) { matched = false; break; }
      }
      if (!matched) continue;
      if (Object.entries(params).every(([name, value]) => paramChecks[name]?.(value, segs))) return true;
    }
    return false;
  };

  const hrefRe = /href=["']([^"']+)["']/g;
  for (const file of linkFiles) {
    const rel = path.relative(cwd, file).replace(/\\/g, '/');
    const src = fs.readFileSync(file, 'utf8');
    const lines = src.split(/\r?\n/);
    for (let li = 0; li < lines.length; li++) {
      hrefRe.lastIndex = 0;
      let m;
      while ((m = hrefRe.exec(lines[li]))) {
        let href = m[1];
        if (/^(?:https?:|mailto:|#|\/\/)/.test(href) || href.includes('${')) continue;
        href = href.split(/[?#]/)[0];
        if (!href.startsWith('/')) continue;
        if (!resolves(href)) fail(rel, li + 1, `internal link "${m[1]}" does not resolve to a known route`);
      }
    }
  }
}

// ---------- sitemap: base URL ----------
try {
  const src = fs.readFileSync(path.join(cwd, 'app', 'sitemap.ts'), 'utf8');
  const m2 = src.match(/const BASE_URL\s*=\s*["'`]([^"'`]+)["'`]/);
  if (m2 && PASS_URL && m2[1] !== PASS_URL) fail('app/sitemap.ts', -1, `BASE_URL="${m2[1]}" != PASS_URL="${PASS_URL}"`);
} catch {
  /* sitemap not present on every build */
}

finish();

function isbn13Valid(isbn) {
  const s = String(isbn).replace(/[-\s]/g, '');
  if (!/^(978|979)\d{10}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(s[i]) * (i % 2 === 0 ? 1 : 3);
  const mod = (10 - (sum % 10)) % 10;
  return Number(s[12]) === mod;
}
