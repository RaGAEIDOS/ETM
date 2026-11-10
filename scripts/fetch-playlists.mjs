#!/usr/bin/env node
/**
 * Fetch metadata for the @ZAmericanEnglish English-track playlists.
 *
 * Usage (from the repo root):
 *   YOUTUBE_API_KEY=xxxx node scripts/fetch-playlists.mjs
 *   YT_API_KEY=xxxx node scripts/fetch-playlists.mjs
 *   (VIDEO files are never downloaded — metadata only.)
 *
 * If you do not have a key, install yt-dlp and run from the repo root:
 *   yt-dlp --flat-playlist -J https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ > out/en-zero.json
 * ...or construct ytdlp commands with the helper below.
 *
 * Output:
 *   out/english-courses.json
 *   {
 *     "status": "ok",
 *     "fetchedAt": "2024-…",
 *     "courses": [{ "id": "PLp22…", "title": "...", "id2": "…PLtitle", ... }],
 *     "playlistItems": [{ "playlistId": "…", "id": "VIDEO_ID", "position": 1, "title": "…", "durationSeconds": 1234, "thumbnails": { … } }]
 *   }
 */

const PLAYLISTS = [
  { id: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ", label: "English from zero" },
  { id: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G", label: "Grammar" },
  { id: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc", label: "Phonetics" },
  { id: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ", label: "Listening" },
  { id: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN", label: "Conversation" },
];

const KEY = process.env.YOUTUBE_API_KEY ?? process.env.YT_API_KEY ?? process.env.YTKEY ?? "";
const API = "https://www.googleapis.com/youtube/v3";
const OUT_DIR = new URL("../out/", import.meta.url).pathname;

if (!KEY) {
  console.log(
    "No YouTube Data API v3 key found in YOUTUBE_API_KEY / YT_API_KEY / YTKEY.\n" +
      "Install yt-dlp and run per playlist:\n" +
      PLAYLISTS.map(
        (p) =>
          `  yt-dlp --flat-playlist -J "https://www.youtube.com/playlist?list=${p.id}" > out/${p.id}.json`
      ).join("\n") +
      "\n…then concatenate the results into out/english-courses.json with node."
  );
  process.exit(2);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
}

async function listAll(endpoint, params) {
  const items = [];
  let pageToken = "";
  do {
    const q = new URLSearchParams({ ...params, key: KEY, maxResults: "50", pageToken });
    const data = await fetchJson(`${API}/${endpoint}?${q}`);
    items.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return items;
}

import { mkdirSync, writeFileSync } from "node:fs";

async function main() {
  const playlistItems = [];

  for (const { id, label } of PLAYLISTS) {
    console.log(`[fetch] ${label} (${id})`);

    const items = await listAll("playlistItems", {
      part: "snippet,contentDetails",
      playlistId: id,
    });

    const ids = items.map((it) => it.contentDetails.videoId).filter(Boolean);
    const videos = [];

    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50).join(",");
      const data = await fetchJson(
        `${API}/videos?part=contentDetails&key=${KEY}&id=${batch}`
      );
      videos.push(...(data.items ?? []));
    }

    const durationById = new Map(
      videos.map((v) => [v.id, v.contentDetails?.duration ?? null])
    );

    items.forEach((it, index) => {
      playlistItems.push({
        playlistId: id,
        playlistLabel: label,
        position: index + 1,
        id: it.contentDetails.videoId,
        title: it.snippet.title,
        channelId: it.snippet.channelId,
        durations: durationById.get(it.contentDetails.videoId) ?? null,
        publishedAt: it.snippet.publishedAt ?? null,
        thumbnails: it.snippet.thumbnails ?? null,
      });
    });

    console.log(`   → ${items.length} videos`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    status: "ok",
    fetchedAt: new Date().toISOString(),
    total: playlistItems.length,
    playlists: PLAYLISTS.map((p) => ({ ...p, count: undefined })),
    items: playlistItems,
  };
  payload.playlists = PLAYLISTS.map((p) => ({
    ...p,
    count: playlistItems.filter((x) => x.playlistId === p.id).length,
  }));
  writeFileSync(`${OUT_DIR}english-courses.json`, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${OUT_DIR}english-courses.json (${payload.total} videos)`);
}

main().catch((err) => {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
});
