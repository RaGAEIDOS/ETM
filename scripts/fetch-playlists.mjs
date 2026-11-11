#!/usr/bin/env node
/**
 * Fetch METADATA ONLY for the @ZAmericanEnglish English-track playlists.
 * Never downloads or re-hosts video files.
 *
 * Usage (from the repo root):
 *   YOUTUBE_API_KEY=AIza... node scripts/fetch-playlists.mjs
 *   YT_API_KEY=AIza...     node scripts/fetch-playlists.mjs
 *
 * Output:
 *   out/english-courses.json
 *   {
 *     "status": "ok",
 *     "fetchedAt": "2026-…",
 *     "items": [{
 *       "playlistId": "PLp22-…", "playlistLabel": "English from zero",
 *       "position": 1, "id": "VIDEO_ID", "title": "…",
 *       "channelId": "…", "duration": "PT5M47S", "publishedAt": "…"
 *     }]
 *   }
 *
 * Without a key, use yt-dlp (metadata only):
 *   yt-dlp --flat-playlist -J "https://www.youtube.com/playlist?list=PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ" > out/en-zero.json
 * …then merge the per-playlist JSON into out/english-courses.json, or ask a
 * maintainer with a key to run this script. See docs/ENGLISH_SECTION.md.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PLAYLISTS = [
  { id: "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ", label: "English from zero" },
  { id: "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G", label: "Grammar" },
  { id: "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc", label: "Phonetics" },
  { id: "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ", label: "Listening" },
  { id: "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN", label: "Conversation" },
];

const KEY = process.env.YOUTUBE_API_KEY ?? process.env.YT_API_KEY ?? process.env.YTKEY ?? "";
const API = "https://www.googleapis.com/youtube/v3";
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(ROOT, "out");

if (!KEY) {
  console.log(
    "No YouTube Data API v3 key in YOUTUBE_API_KEY / YT_API_KEY / YTKEY.\n" +
      "Install yt-dlp and run per playlist (metadata only):\n" +
      PLAYLISTS.map(
        (p) =>
          `  yt-dlp --flat-playlist -J "https://www.youtube.com/playlist?list=${p.id}" > out/${p.id}.json`
      ).join("\n") +
      "\n…then merge into out/english-courses.json, or ask a maintainer with a key."
  );
  process.exit(2);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
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

async function main() {
  const items = [];

  for (const { id, label } of PLAYLISTS) {
    console.log(`[fetch] ${label} (${id})`);
    const playlistItems = await listAll("playlistItems", {
      part: "snippet,contentDetails",
      playlistId: id,
    });

    const ids = playlistItems.map((it) => it.contentDetails?.videoId).filter(Boolean);
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

    playlistItems.forEach((it, index) => {
      items.push({
        playlistId: id,
        playlistLabel: label,
        position: index + 1,
        id: it.contentDetails?.videoId ?? "",
        title: it.snippet?.title ?? "",
        channelId: it.snippet?.channelId ?? "",
        duration: durationById.get(it.contentDetails?.videoId) ?? null,
        publishedAt: it.snippet?.publishedAt ?? null,
      });
    });
    console.log(`   → ${playlistItems.length} videos`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    status: "ok",
    fetchedAt: new Date().toISOString(),
    total: items.length,
    playlists: PLAYLISTS.map((p) => ({
      ...p,
      count: items.filter((x) => x.playlistId === p.id).length,
    })),
    items,
  };
  const target = join(OUT_DIR, "english-courses.json");
  writeFileSync(target, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${target} (${payload.total} videos)`);
}

main().catch((err) => {
  console.error("Failed:", err?.message ?? err);
  process.exit(1);
});
