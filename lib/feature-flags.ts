/**
 * Playground rollout scope.
 *
 * - "elzero-intro"  : only the first two ElZero sections are enabled for a
 *                    tangled "Try it" toggle; later ones ship in the same PR but
 *                    only after you merge the change (one line flip).
 * - "all"           : every C++ code block shows the editable runnable playground,
 *                    on /learn lessons and across all ElZero videos.
 *
 * Single-line flip is the intended "roll out to all lessons" step after your
 * approval — no new deploy needed.
 */
export const LESSON_PLAYGROUND_SCOPE = "elzero-intro" as
  | "elzero-intro"
  | "all";

export function tryItAllowed(ctx: {
  scope: "elzero" | "learn" | "glossary";
  number?: number;
}): boolean {
  if (LESSON_PLAYGROUND_SCOPE === "all") return true;
  if (ctx.scope !== "elzero") return false;
  // Two sections shipped in this release: the course introduction (#001-#008)
  // and Variables & Constants (#009-#015).
  return ctx.number != null && ctx.number <= 15;
}
