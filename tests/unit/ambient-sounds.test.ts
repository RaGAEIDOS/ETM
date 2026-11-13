import { test } from "node:test";
import assert from "node:assert/strict";
import { AMBIENTS, isAmbientKind } from "../../lib/ambient-sounds.ts";

test("ambient list has the five requested sounds with bilingual names", () => {
  assert.deepEqual(
    AMBIENTS.map((s) => s.id),
    ["rain", "night", "ocean", "space", "fire"]
  );
  for (const s of AMBIENTS) {
    assert.ok(s.name.ar.length > 0, `missing ar name for ${s.id}`);
    assert.ok(s.name.en.length > 0, `missing en name for ${s.id}`);
  }
});

test("isAmbientKind accepts only known ids", () => {
  assert.ok(isAmbientKind("rain"));
  assert.ok(isAmbientKind("fire"));
  assert.ok(!isAmbientKind("thunder"));
  assert.ok(!isAmbientKind(undefined));
  assert.ok(!isAmbientKind(""));
});
