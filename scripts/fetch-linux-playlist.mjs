/**
 * Fetch the Linuxtopia "دورة تعلم نظام اللينكس 2021" playlist metadata
 * (IDs, titles, durations, order) from a public Invidious mirror.
 *
 * METADATA ONLY — never downloads video bytes.
 * Usage: node scripts/fetch-linux-playlist.mjs
 * Output: out/linux/playlist.json
 */
import fs from "node:fs";

const PLAYLIST_ID = "PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg";
const EXPECTED = 53;
const BASE = process.env.INVIDIOUS_BASE || "https://inv.nadeko.net";

function isoDuration(totalSeconds) {
  const s = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${sec ? `${sec}S` : ""}`;
}

async function fetchAllPages() {
  const videos = [];
  let meta = null;
  for (let page = 1; page <= 20; page++) {
    const url = `${BASE}/api/v1/playlists/${PLAYLIST_ID}?page=${page}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 ETM-fetch" },
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const json = await res.json();
    if (!meta) meta = json;
    const batch = json.videos || [];
    videos.push(...batch);
    console.log(`page ${page}: ${batch.length} videos (total ${videos.length})`);
    if (!json.nextPage || batch.length === 0) break;
  }
  return { meta, videos };
}

const { meta, videos } = await fetchAllPages();
const seen = new Map();
for (const v of videos) if (!seen.has(v.videoId)) seen.set(v.videoId, v);
const rows = [...seen.values()].map((v, i) => ({
  number: i + 1,
  youtubeId: v.videoId,
  title: (v.title || "").trim(),
  durationSeconds: v.lengthSeconds || 0,
  duration: isoDuration(v.lengthSeconds || 0),
  isLive: v.liveNow || v.isLive || false,
  playlistUrl: `https://www.youtube.com/watch?v=${v.videoId}&list=${PLAYLIST_ID}`,
}));

const problems = [];
if (rows.length !== EXPECTED) problems.push(`count ${rows.length} != expected ${EXPECTED}`);
if (videos.length !== rows.length)
  problems.push(`duplicates inside playlist: ${videos.length - rows.length}`);
for (const r of rows) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(r.youtubeId)) problems.push(`#${r.number} bad id ${r.youtubeId}`);
  if (!r.title) problems.push(`#${r.number} empty title`);
  if (!r.durationSeconds) problems.push(`#${r.number} missing/zero duration`);
  if (r.isLive) problems.push(`#${r.number} is live/upcoming`);
}

console.log(`\ntitle: ${meta?.title}`);
console.log(`author: ${meta?.author} (${meta?.authorUrl})`);
console.log(`videoCount(api): ${meta?.videoCount} · fetched ${rows.length}`);
console.log(`problems: ${problems.length ? problems.join(" | ") : "none"}`);

fs.mkdirSync("out/linux", { recursive: true });
fs.writeFileSync(
  "out/linux/playlist.json",
  JSON.stringify({ fetchedAt: new Date().toISOString(), playlistId: PLAYLIST_ID, meta: { title: meta?.title, author: meta?.author, authorUrl: meta?.authorUrl, videoCount: meta?.videoCount }, problems, videos: rows }, null, 2)
);
console.log("\nWROTE out/linux/playlist.json");
