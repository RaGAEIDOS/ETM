import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LOFI_EMBED_HOSTS,
  LOFI_FALLBACK_VIDEO_IDS,
  LOFI_LIVE_VIDEO_ID,
  LOFI_LIVE_VIDEO_IDS,
  lofiEmbedUrl,
} from "../../lib/music.ts";

test("lofi stream chain starts with a valid primary and has no duplicates", () => {
  assert.match(LOFI_LIVE_VIDEO_ID, /^[A-Za-z0-9_-]{11}$/);
  assert.equal(LOFI_LIVE_VIDEO_IDS[0], LOFI_LIVE_VIDEO_ID);
  assert.ok(LOFI_FALLBACK_VIDEO_IDS.length >= 1);
  for (const id of LOFI_LIVE_VIDEO_IDS) {
    assert.match(id, /^[A-Za-z0-9_-]{11}$/);
  }
  assert.equal(
    new Set(LOFI_LIVE_VIDEO_IDS).size,
    LOFI_LIVE_VIDEO_IDS.length,
    "fallback streams must be unique"
  );
});

test("lofiEmbedUrl uses the privacy-enhanced embed and the JS API", () => {
  const url = new URL(
    lofiEmbedUrl(LOFI_LIVE_VIDEO_ID, "https://etm-learning.vercel.app")
  );

  assert.equal(url.origin, "https://www.youtube-nocookie.com");
  assert.equal(url.pathname, `/embed/${LOFI_LIVE_VIDEO_ID}`);
  assert.equal(url.searchParams.get("enablejsapi"), "1");
  assert.equal(url.searchParams.get("playsinline"), "1");
  assert.equal(url.searchParams.get("rel"), "0");
  assert.equal(
    url.searchParams.get("origin"),
    "https://etm-learning.vercel.app"
  );
});

test("lofiEmbedUrl never requests autoplay and never leaks an origin by default", () => {
  const url = new URL(lofiEmbedUrl(LOFI_LIVE_VIDEO_ID));
  assert.equal(url.searchParams.get("autoplay"), "0");
  assert.equal(url.searchParams.get("origin"), null);
});

test("lofiEmbedUrl defaults to the privacy host and honours a host override", () => {
  assert.deepEqual(LOFI_EMBED_HOSTS, [
    "https://www.youtube-nocookie.com",
    "https://www.youtube.com",
  ]);
  const privacy = new URL(lofiEmbedUrl(LOFI_LIVE_VIDEO_ID));
  assert.equal(privacy.origin, LOFI_EMBED_HOSTS[0]);

  const standard = new URL(
    lofiEmbedUrl(LOFI_LIVE_VIDEO_ID, undefined, LOFI_EMBED_HOSTS[1])
  );
  assert.equal(standard.origin, "https://www.youtube.com");
  assert.equal(standard.pathname, `/embed/${LOFI_LIVE_VIDEO_ID}`);
});
