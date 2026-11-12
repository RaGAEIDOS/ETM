import fs from "node:fs";
import path from "node:path";

const COURSES = [
  {
    id: "pa-foundations",
    playlistId: "PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj",
    expected: 20,
  },
  {
    id: "pa-algorithms",
    playlistId: "PL3X--QIIK-OEUIwbQU79V76RHelBUQKiz",
    expected: 50,
  },
];

const INSTANCES = ["https://inv.nadeko.net"];

function fmtDuration(seconds) {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${sec ? `${sec}S` : ""}`.replace("PT", "PT") || "PT0S";
}

async function fetchPlaylist(base, playlistId) {
  let page = 1;
  const all = [];
  let meta = null;
  for (;;) {
    const url = `${base}/api/v1/playlists/${playlistId}?page=${page}`;
    let res;
    try {
      res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 ETM-fetch" },
        signal: AbortSignal.timeout(30000),
      });
    } catch (e) {
      throw new Error(`fetch failed ${url}: ${e.message}`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    const json = await res.json();
    if (!meta) meta = json;
    const vids = json.videos || [];
    all.push(...vids);
    if (!json.nextPage || vids.length === 0) break;
    page += 1;
    if (page > 20) break;
  }
  return { meta, videos: all };
}

const out = { fetchedAt: new Date().toISOString(), courses: [] };

for (const course of COURSES) {
  console.log(`\n=== ${course.id} (${course.playlistId}) ===`);
  const { meta, videos } = await fetchPlaylist(INSTANCES[0], course.playlistId);
  console.log(
    `title="${meta.title}" videos=${videos.length} expected=${course.expected} videoCount=${meta.videoCount}`
  );
  const seen = new Map();
  for (const v of videos) if (!seen.has(v.videoId)) seen.set(v.videoId, v);
  const dedup = [...seen.values()];
  console.log(`unique=${dedup.length} duplicateInPlaylist=${videos.length - dedup.length}`);

  const rows = dedup.map((v, i) => ({
    number: i + 1,
    youtubeId: v.videoId,
    title: v.title,
    author: v.author,
    durationSeconds: v.lengthSeconds,
    duration: fmtDuration(v.lengthSeconds),
    live: v.isLive,
    index: v.index,
    playlistUrl: `https://www.youtube.com/watch?v=${v.videoId}&list=${course.playlistId}`,
  }));

  const problems = [];
  if (rows.length !== course.expected)
    problems.push(`count ${rows.length} != expected ${course.expected}`);
  for (const r of rows) {
    if (!r.youtubeId || !/^[A-Za-z0-9_-]{11}$/.test(r.youtubeId))
      problems.push(`bad id ${r.youtubeId}`);
    if (!r.title?.trim()) problems.push(`#${r.number}: empty title`);
    if (!r.durationSeconds) problems.push(`#${r.number}: missing duration`);
    if (r.live) problems.push(`#${r.number}: live/unavailable`);
  }
  console.log("problems:", problems.length ? problems : "none");
  console.log("first:", JSON.stringify(rows[0]));
  console.log("last:", JSON.stringify(rows[rows.length - 1]));

  out.courses.push({
    id: course.id,
    playlistId: course.playlistId,
    title: meta.title,
    author: meta.author,
    videoCount: meta.videoCount,
    fetched: rows.length,
    expected: course.expected,
    problems,
    videos: rows,
  });
}

fs.mkdirSync("out/programmingadvices", { recursive: true });
fs.writeFileSync(
  "out/programmingadvices/playlists.json",
  JSON.stringify(out, null, 2)
);
console.log("\nWROTE out/programmingadvices/playlists.json");