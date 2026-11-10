import { test } from "node:test";
import assert from "node:assert/strict";
import { compileCpp, outputsMatch } from "../lib/wandbox.ts";

function mockFetcher(response) {
  const seen = [];
  return {
    fetch: async (_url, init) => {
      seen.push(JSON.parse(init.body));
      return { ok: true, status: 200, json: async () => response };
    },
    seen,
  };
}

test("outputsMatch — trimmed stdout passes", () => {
  assert.equal(outputsMatch("hello", "hello\n"), true);
  assert.equal(outputsMatch("x y\n", "  x y"), true);
});

test("outputsMatch — differing body fails", () => {
  assert.equal(outputsMatch("a", "b"), false);
  assert.equal(outputsMatch("a\nb", "b"), false);
});

test("compileCpp returns parsed output on success", async () => {
  const m = mockFetcher({ status: "0", program_output: "42\n", time_ms: 8 });
  const r = await compileCpp("int main(){cout << 42 << endl; return 0;}", "", { fetchImpl: m.fetch });
  assert.equal(r.ok, true);
  assert.equal(r.stdout, "42");
  assert.equal(r.timeMs, 8);
  const req = m.seen[0];
  assert.equal(typeof req.code, "string");
  assert.equal(req.stdin, "");
});

test("compileCpp forwards stdin in the request body", async () => {
  const m = mockFetcher({ status: "9" });
  const r = await compileCpp("test code", "5\n", { fetchImpl: m.fetch });
  assert.equal(r.ok, false);
  assert.equal(m.seen[0].stdin, "5\n");
});

test("compileCpp treats non-zero status as failure with compiler error", async () => {
  const m = mockFetcher({ status: "1", compiler_error: "expected ';' before '}' token", time_ms: 3 });
  const r = await compileCpp("this will not parse", "", { fetchImpl: m.fetch });
  assert.equal(r.ok, false);
  assert.equal(r.compilerError, "expected ';' before '}' token");
  assert.equal(r.timeMs, 3);
});

test("compileCpp reports network errors with a useful message", async () => {
  const r = await compileCpp("ignored", "", {
    fetchImpl: async () => { throw new Error("fetch failed"); },
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /internet connection|offline/i);
});

test("compileCpp rejects oversize source", async () => {
  const r = await compileCpp("x".repeat(21000), "");
  assert.equal(r.ok, false);
  assert.match(r.error, /too long/i);
});

test("compileCpp rejects oversize input", async () => {
  const r = await compileCpp("a", "y".repeat(110000));
  assert.equal(r.ok, false);
  assert.match(r.error, /input is too long/i);
});

test("outputsMatch — leading/trailing tail whitespace ignored on both sides", () => {
  // both outputs get trimmed per line and trailing blank lines stripped
  assert.equal(
    outputsMatch("  sum 7", "sum 7\n"),
    true
  );
});
