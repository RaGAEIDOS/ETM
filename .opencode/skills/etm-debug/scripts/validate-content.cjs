// ETM content integrity validator.
// Transpiles lib/*.ts on the fly and checks structural invariants.
// Usage: node .opencode/skills/etm-debug/scripts/validate-content.cjs
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const cache = new Map();

function loadTs(absPath) {
  const key = path.normalize(absPath);
  if (cache.has(key)) return cache.get(key);
  const src = fs.readFileSync(key, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (spec) => {
    if (!spec.startsWith(".")) throw new Error("external require not allowed: " + spec);
    const base = path.dirname(key);
    let resolved = path.resolve(base, spec);
    if (!fs.existsSync(resolved) && fs.existsSync(resolved + ".ts")) resolved = resolved + ".ts";
    if (fs.existsSync(resolved + ".ts") && !resolved.endsWith(".ts")) resolved = resolved + ".ts";
    return loadTs(resolved);
  };
  // seed cache before eval to survive cycles
  cache.set(key, mod.exports);
  new Function("module", "exports", "require", js)(mod, mod.exports, localRequire);
  cache.set(key, mod.exports);
  return mod.exports;
}

const problems = [];
const check = (cond, msg) => { if (!cond) problems.push(msg); };

// ---- load stages + data ----
const { stageMetas } = loadTs(path.join(ROOT, "lib", "stages.ts"));
const data = loadTs(path.join(ROOT, "lib", "data.ts"));

const stageCourseIds = [];
for (const s of stageMetas) {
  check(s.id && s.level && s.name && s.nameEn, `stage missing meta: ${JSON.stringify(s.id)}`);
  for (const c of s.courses) stageCourseIds.push({ stage: s.id, id: c.id });
}

const courseById = new Map();
for (const { stage, id } of stageCourseIds) {
  check(!courseById.has(id), `duplicate course id in stages: ${id}`);
  courseById.set(id, stage);
}

// lessonsByCourse map lives inside lib/data.ts — re-derive by importing it is
// not possible (it builds the final Stage[] structure), so re-implement the
// check from its source text: every lesson module import must be referenced.
const dataSrc = fs.readFileSync(path.join(ROOT, "lib", "data.ts"), "utf8");
const importMatches = [...dataSrc.matchAll(/import\s*\{\s*lessons as (\w+)\s*\}\s*from\s*"\.\/content\/([\w-]+)"/g)];
const importedModules = new Set(importMatches.map((m) => m[2]));

const contentDir = path.join(ROOT, "lib", "content");
const contentFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".ts")).map((f) => f.replace(/\.ts$/, ""));
for (const f of contentFiles) {
  check(importedModules.has(f), `lib/content/${f}.ts is never imported in lib/data.ts`);
}

// map data.ts course ids -> lesson arrays by evaluating each content module
// and matching via the keys of the contentMap object in data.ts source.
const mapStart = dataSrc.indexOf("const contentMap");
const mapOpen = dataSrc.indexOf("{", mapStart);
const mapClose = dataSrc.indexOf("};", mapOpen);
if (mapStart === -1 || mapOpen === -1 || mapClose === -1) {
  problems.push("could not locate contentMap object in lib/data.ts");
}
const mapBody = dataSrc.slice(mapOpen, mapClose);
const keyMatches = [...mapBody.matchAll(/"?([\w-]+)"?:\s*(\w+),/g)];
const keyToVar = new Map(keyMatches.map((m) => [m[1], m[2]]));
const varToModule = new Map(importMatches.map((m) => [m[1], m[2]]));

function lessonsOf(courseId) {
  const v = keyToVar.get(courseId);
  if (!v) return null;
  const mod = varToModule.get(v);
  if (!mod) return null;
  return loadTs(path.join(contentDir, mod + ".ts")).lessons;
}

let totalLessons = 0;
let totalQuizzes = 0;
for (const { stage, id } of stageCourseIds) {
  const lessons = lessonsOf(id);
  check(!!lessons, `stage ${stage}: course "${id}" has no lessons mapped in lib/data.ts`);
  if (!lessons) continue;
  check(lessons.length > 0, `course "${id}": zero lessons`);
  const seen = new Set();
  for (const l of lessons) {
    totalLessons++;
    check(l.id && /^[\w-]+$/.test(l.id), `course ${id}: bad lesson id ${JSON.stringify(l.id)}`);
    check(!seen.has(l.id), `course ${id}: duplicate lesson id "${l.id}"`);
    seen.add(l.id);
    check(l.title && l.titleEn, `${id}/${l.id}: missing title`);
    check(l.duration, `${id}/${l.id}: missing duration`);
    check(l.description, `${id}/${l.id}: missing description`);
    check(Array.isArray(l.sections) && l.sections.length > 0, `${id}/${l.id}: no sections`);
    check(Array.isArray(l.quiz) && l.quiz.length > 0, `${id}/${l.id}: no quiz`);
    totalQuizzes += l.quiz?.length || 0;
    for (const q of l.quiz) {
      check(Array.isArray(q.options) && q.options.length >= 2, `${id}/${l.id}: quiz with <2 options — ${JSON.stringify(q.question).slice(0, 60)}`);
      check(q.answer >= 0 && q.answer < q.options.length, `${id}/${l.id}: quiz answer out of range — ${JSON.stringify(q.question).slice(0, 60)}`);
    }
    if (l.code) {
      for (const c of l.code) {
        check(c.language && c.code, `${id}/${l.id}: empty code block`);
      }
    }
  }
}

// every lessons array must have its course registered in stages
for (const [id] of keyToVar) {
  if (id === "lessons") continue;
  // heuristic: key looks like a course id if it contains a dash or is lowercase word
  check(courseById.has(id), `lib/data.ts maps "${id}" but no such course exists in lib/stages.ts`);
}

console.log(`Stages: ${stageMetas.length}, courses: ${stageCourseIds.length}, lessons: ${totalLessons}, quiz questions: ${totalQuizzes}`);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(" - " + p);
  process.exit(1);
} else {
  console.log("Content integrity: OK");
}
