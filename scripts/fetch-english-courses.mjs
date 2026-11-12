/**
 * Fetch every curated zAmericanEnglish course playlist through a working
 * Invidious instance and save the raw JSON to out/english-course-playlists.json.
 *
 * YouTube is unreachable from this environment; invidious.materialio.us and
 * inv.nadeko.net serve the playlist API. Video ids, titles and durations are
 * REAL channel metadata. Nothing here is invented.
 *
 * Usage: node scripts/fetch-english-courses.mjs
 */
import fs from "node:fs";

const CHANNEL_ID = "UCHrD4qdeQc1BbpG6EPqDBcA";

/** Course playlists (channel order preserved per level). */
const PLAYLISTS = [
  // Level 1
  "PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ", // English from zero
  "PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr", // Grammar L1
  "PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc", // Phonetics L1
  "PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ", // Listening L1
  "PLp22-4PivYmI4PahZ0eyFjcihT7_VAs79", // Reading L1
  "PLp22-4PivYmL_FPWuMEJQ7_thNjF7JS0Y", // Writing L1
  "PLp22-4PivYmKp2aC7PI7K0POsf812xLBN", // Conversation L1
  "PLp22-4PivYmIz6Nq_ZDMNQn-kpB65BNpx", // Tips L1
  // Level 2
  "PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk", // Grammar L2
  "PLp22-4PivYmIlFAg2fuo--xVxScz9_6h2", // Phonetics L2
  "PLp22-4PivYmLmnv85IWWhNL4PtzcqC5mS", // Listening L2
  "PLp22-4PivYmJl_sWnCTwL1yNFhq0AM7yk", // Daily conversations L2
  "PLp22-4PivYmIgc6vCBbX4aLOiQ6oCoyvN", // Learn like Westerners L2
  "PLp22-4PivYmIsGY5eUPt67tnd2ZBfQpIw", // Thinking in English L2
  "PLp22-4PivYmJV4nIwcfSzQpG0jkqn1jci", // Through a story L2
  "PLp22-4PivYmIZtXNNriSBxmSeCK7juwS_", // News L2
  // Level 3 / 4
  "PLp22-4PivYmJSejQkuui_SrYWObQW7pWt", // Grammar explained in English L3
  "PLp22-4PivYmKw-mErNjoEWnyic9U7k_NM", // Stories L3
  "PLp22-4PivYmKzTfbSx_nm0oCFSQ9-IpgL", // Reading L4
  // Specialised / evergreen
  "PLp22-4PivYmLebd3vD0_WfIteVUlSA44G", // Grammar & tenses (all levels)
  "PLp22-4PivYmJfGUFUJUR2IQlv8oI735hE", // Professional translation
  "PLp22-4PivYmISOyAhaSfLqrwDSpN6GDpG", // Translation
  "PLp22-4PivYmKcPVkKIQ1fj4TBhFSkQ40C", // Wordsmith
  "PLp22-4PivYmIPxfMzIpbB766dcSrbdCug", // Dialect
  "PLp22-4PivYmKsvZbvnVJo-oF4fJKVyUeV", // Slango
  "PLp22-4PivYmLp7sQVkZ_yHyZHQOXlZvOt", // English in a cartoon story
  "PLp22-4PivYmJxp3KmAFNyt2pkrU_5Apln", // High-school curriculum
  "PLp22-4PivYmJPNgoOumAWL1Hmsq_e6uUj", // Phrase it up
  "PLp22-4PivYmK1a3vHEw_bL_TclQUwpZsS", // Ask Joe
  "PLp22-4PivYmLo5pyYSib-I69t2ktZjqcQ", // Pronunciation
  "PLp22-4PivYmIsCOWJ0D8lXBsbKfcyc3So", // Bookworm
  "PLp22-4PivYmLS0lJv05C0jDG3B7kO2uo7", // American talk
  "PLp22-4PivYmL2wmHCHXvbbZWcQaTXIBTV", // IELTS
  "PLp22-4PivYmKTVrmFxV2EYpzzPaFs0M9F", // I Know
  "PLp22-4PivYmKFJFUO3JHaIAh7_Yq7Ka1_", // English Bits
  "PLp22-4PivYmJhfUAwja19p7pQzn1wyTZA", // Followers' questions
];

const INSTANCES = ["https://invidious.materialio.us", "https://inv.nadeko.net"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPlaylist(id) {
  let lastError = "unknown";
  for (const base of INSTANCES) {
    try {
      const res = await fetch(`${base}/api/v1/playlists/${id}`, {
        headers: { "User-Agent": "Mozilla/5.0 ETM-content-fetch" },
      });
      if (!res.ok) {
        lastError = `${base} HTTP ${res.status}`;
        continue;
      }
      return await res.json();
    } catch (e) {
      lastError = `${base} ${e.message}`;
    }
  }
  throw new Error(`${id}: ${lastError}`);
}

const out = {};
let total = 0;
for (const [i, id] of PLAYLISTS.entries()) {
  const p = await fetchPlaylist(id);
  out[id] = p;
  total += p.videos?.length ?? 0;
  console.log(
    `[${String(i + 1).padStart(2, "0")}/${PLAYLISTS.length}] ${id} videos=${p.videos?.length ?? 0} total=${total}`
  );
  await sleep(600);
}

fs.writeFileSync("out/english-course-playlists.json", JSON.stringify(out, null, 2));
console.log(`DONE ${PLAYLISTS.length} playlists, ${total} videos`);
