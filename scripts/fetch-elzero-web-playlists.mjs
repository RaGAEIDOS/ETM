/**
 * Fetches metadata (id, title, order, duration) for every ElZero Web course
 * playlist using only the YouTube Data API v3 — never downloads video.
 * Run locally or in CI where YouTube is reachable:
 *
 *   YOUTUBE_API_KEY=AIza... node scripts/fetch-elzero-web-playlists.mjs
 *
 * Writes out/elzero-web-playlists.json (same shape the generator expects).
 * The committed catalogue (lib/elzero-web-videos-bulk.ts) was produced from
 * an equivalent dump; embedded flags were checked separately with noembed.
 *
 * Courses covered: Tier 1 (HTML, CSS, JavaScript Bootcamp) and Tier 2
 * (TypeScript, SASS, Git & GitHub). PHP Bootcamp is listed for reference but
 * its lessons are NOT part of the catalogue until Tier 3 is approved.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) {
  console.error("Set YOUTUBE_API_KEY (YouTube Data API v3). See docs/PROGRESS.md.");
  process.exit(1);
}

const PLAYLISTS = {
  html: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
  css: "PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe",
  javascript: "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv",
  typescript: "PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ",
  sass: "PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2",
  gitgithub: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF",
  php: "PLDoPjvoNmBAy41u35AqJUrI-H83DObUDq",
};

const api = async (path, params) => {
  const url = new URL("https://www.googleapis.com/youtube/v3/" + path);
  url.searchParams.set("key", KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${path} -> HTTP ${r.status}: ${await r.text()}`);
  return r.json();
};

const out = { fetched: new Date().toISOString().slice(0, 10), source: "youtube-data-api-v3", playlists: {} };
for (const [name, playlistId] of Object.entries(PLAYLISTS)) {
  const meta = (await api("playlists", { part: "snippet,contentDetails", id: playlistId })).items?.[0];
  const total = meta?.contentDetails?.itemCount ?? 0;
  const videos = [];
  let pageToken;
  do {
    const page = await api("playlistItems", {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of page.items ?? []) {
      videos.push({
        index: videos.length + 1,
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        lengthSeconds: 0, // filled below
      });
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  // Durations come from a separate videos.list call (50 ids per call).
  for (let i = 0; i < videos.length; i += 50) {
    const ids = videos.slice(i, i + 50).map((v) => v.videoId).join(",");
    const page = await api("videos", { part: "contentDetails", id: ids });
    for (const item of page.items ?? []) {
      const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(item.contentDetails?.duration ?? "PT0S");
      const secs = (Number(m?.[1] ?? 0) * 3600) + (Number(m?.[2] ?? 0) * 60) + Number(m?.[3] ?? 0);
      const v = videos.find((x) => x.videoId === item.id);
      if (v) v.lengthSeconds = secs;
    }
  }
  out.playlists[name] = {
    playlistId,
    title: meta?.snippet?.title ?? name,
    author: meta?.snippet?.channelTitle ?? "Elzero Web School",
    videoCount: total,
    videos,
  };
  console.log(`${name}: ${videos.length}/${total} videos`);
}
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
mkdirSync(dir, { recursive: true });
const file = join(dir, "elzero-web-playlists.json");
writeFileSync(file, JSON.stringify(out, null, 2));
console.log("wrote", file);
