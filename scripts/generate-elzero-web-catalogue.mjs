/**
 * Generates lib/elzero-web-videos-bulk.ts from out/elzero-web-playlists.json
 * (fetched with scripts/fetch-elzero-web-playlists.mjs — YouTube hosts are
 * blocked from some environments; the script hits the YouTube Data API v3
 * metadata endpoints only, or falls back to no API key via Invidious).
 *
 * Every id/title/duration/url is REAL, taken from the official channel
 * playlists. Summaries are placeholders (reviewed:false) — real curation
 * lands per batch in lib/elzero-web-videos.ts.
 *
 * Do not hand-edit the generated file; regenerate or curate instead.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "out", "elzero-web-playlists.json");
const output = join(root, "lib", "elzero-web-videos-bulk.ts");

// Section boundaries per course, derived from the published video titles
// (lesson numbers are the official playlist order).
const SECTIONS = {
  html: [
    ["intro", 1, 6],
    ["content", 7, 11],
    ["links", 12, 14],
    ["tables", 15, 18],
    ["semantic", 19, 21],
    ["media", 22, 23],
    ["forms", 24, 32],
    ["extras", 33, 34],
    ["a11y", 35, 37],
  ],
  css: [
    ["basics", 1, 4],
    ["backgrounds", 5, 6],
    ["box", 7, 16],
    ["text", 17, 26],
    ["layout", 27, 31],
    ["lists-tables", 32, 33],
    ["pseudo", 34, 37],
    ["boxes", 38, 45],
    ["flex", 46, 53],
    ["effects", 54, 56],
    ["grid", 57, 64],
    ["transforms", 65, 73],
    ["animation", 74, 77],
    ["selectors", 78, 82],
    ["responsive", 83, 88],
  ],
  javascript: [
    ["intro", 1, 9],
    ["data-types", 10, 17],
    ["operators", 18, 22],
    ["numbers", 23, 26],
    ["strings", 27, 30],
    ["conditions", 31, 39],
    ["arrays", 40, 47],
    ["loops", 48, 56],
    ["functions", 57, 63],
    ["scopes", 64, 70],
    ["hof", 71, 78],
    ["objects", 79, 85],
    ["dom-1", 86, 93],
    ["dom-2", 94, 101],
    ["bom", 102, 110],
    ["storage", 111, 114],
    ["destructure", 115, 122],
    ["map-set", 123, 133],
    ["regex", 134, 146],
    ["oop", 147, 158],
    ["date-modules", 159, 168],
    ["ajax-json", 169, 178],
    ["promises", 179, 188],
  ],
  typescript: [
    ["intro", 1, 4],
    ["annotations", 5, 11],
    ["types-advanced", 12, 21],
    ["interfaces", 22, 26],
    ["classes", 27, 33],
    ["generics", 34, 38],
  ],
  sass: [
    ["intro", 1, 3],
    ["variables", 4, 6],
    ["flow", 7, 10],
    ["mixins-loops", 11, 16],
    ["practice", 17, 19],
  ],
  gitgithub: [
    ["basics", 1, 6],
    ["advanced", 7, 12],
    ["finish", 13, 20],
  ],
};

// Bulk generation covers Tier 1 + Tier 2 only. PHP Bootcamp stays untouched
// until the user approves Tier 3.
const COURSES = {
  html: { prefix: "html", playlistId: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji" },
  css: { prefix: "css", playlistId: "PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe" },
  javascript: { prefix: "js", playlistId: "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv" },
  typescript: { prefix: "ts", playlistId: "PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ" },
  sass: { prefix: "sass", playlistId: "PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2" },
  gitgithub: { prefix: "git", playlistId: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF" },
};

function isoDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h > 0 ? h + "H" : ""}${m > 0 ? m + "M" : ""}${sec > 0 || (h === 0 && m === 0) ? sec + "S" : ""}`;
}

const data = JSON.parse(readFileSync(input, "utf8").replace(/^﻿/, ""));
const banner = `/**
 * AUTO-GENERATED bulk catalogue for the ElZero Web track (Tier 1 + Tier 2).
 * Source: official Elzero Web School playlists, fetched via ${data.source}
 * (${data.fetched}). Titles, order, ids and durations are real; summaries are
 * placeholders (reviewed:false, empty terms/practice) until each batch is
 * hand-curated in lib/elzero-web-videos.ts.
 *
 * Do not hand-edit. Regenerate with scripts/generate-elzero-web-catalogue.mjs.
 */
`;

const entries = [];
for (const [courseId, meta] of Object.entries(COURSES)) {
  const p = data.playlists[courseId];
  if (!p) throw new Error("Missing playlist data for " + courseId);
  const bounds = SECTIONS[courseId];
  const PL = "https://www.youtube.com/watch?v=";
  const list = `&list=${meta.playlistId}`;
  for (const v of p.videos) {
    const section = bounds.find(([, from, to]) => v.index >= from && v.index <= to)?.[0];
    if (!section) throw new Error(`No section for ${courseId} #${v.index}`);
    entries.push({
      id: `${meta.prefix}-${String(v.index).padStart(3, "0")}`,
      course: courseId,
      number: v.index,
      youtubeId: v.videoId,
      title: v.title,
      duration: isoDuration(v.lengthSeconds),
      youtube: `${PL}${v.videoId}${list}`,
      section,
    });
  }
}

const body =
  banner +
  `import type { ElzeroWebBulkVideo } from "./elzero-web-videos";\n\n` +
  `export const elzeroWebVideosBulk: ElzeroWebBulkVideo[] = ${JSON.stringify(entries, null, 2)};\n`;
writeFileSync(output, body);
console.log(`wrote ${output} (${entries.length} videos)`);
