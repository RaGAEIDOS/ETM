/**
 * English key-term spaced repetition (Phase 4.6).
 *
 * Leitner-style schedule derived by replaying the learner's `term_review`
 * events from the unified progress store (track "english"). Pure and
 * import-free apart from the shared day-key helpers, so it runs on the
 * server, in the browser and in the node:test unit suite.
 *
 * Box model:
 *   - a term starts at box 0 and enters the queue on its FIRST review,
 *   - a "known" answer promotes it one box (max 5),
 *   - a "missed" answer drops it back to box 0,
 *   - after each review the term is due again after SRS_INTERVALS[box] days.
 */

import { dayKeyOf, localDayKey, shiftDayKey, type ProgressEvent } from "../progress/core.ts";

/** Days until the next review, indexed by box (0 = weakest). */
export const SRS_INTERVALS = [1, 3, 7, 16, 35, 75] as const;
export const SRS_MAX_BOX = SRS_INTERVALS.length - 1;

export interface SrsTermState {
  /** Normalized term text (trimmed, whitespace-collapsed). */
  term: string;
  /** Consecutive correct answers, clamped to 0..SRS_MAX_BOX. */
  box: number;
  /** Total times this term was reviewed. */
  seen: number;
  /** Total times this term was marked unknown. */
  misses: number;
  /** ISO timestamp of the most recent review. */
  lastAt: string;
  lastKnown: boolean;
  /** Local day key (YYYY-MM-DD) when the next review is scheduled. */
  dueDayKey: string;
  /** True when the term is due on or before `todayKey`. */
  due: boolean;
}

export interface SrsSummary {
  /** Every term seen at least once, weakest/due first. */
  terms: SrsTermState[];
  /** Terms due on or before today (overdue + due today). */
  due: SrsTermState[];
  dueCount: number;
  /** Total distinct terms ever reviewed. */
  seenTerms: number;
  /** Terms answered correctly the last time, any box. */
  lastKnownTerms: number;
  /** Terms at box 4 or above (weeks apart). */
  masteredTerms: number;
}

export function normalizeTerm(term: unknown): string {
  return String(term ?? "").replace(/\s+/g, " ").trim();
}

function sortTerms(a: SrsTermState, b: SrsTermState): number {
  if (a.due !== b.due) return a.due ? -1 : 1;
  if (a.dueDayKey !== b.dueDayKey) return a.dueDayKey < b.dueDayKey ? -1 : 1;
  if (a.box !== b.box) return a.box - b.box;
  return a.term.localeCompare(b.term);
}

export function deriveSrs(events: ProgressEvent[], todayKey?: string): SrsSummary {
  const today = todayKey ?? localDayKey(new Date());
  const sorted = [...events].sort((a, b) =>
    a.at === b.at ? a.id.localeCompare(b.id) : a.at.localeCompare(b.at),
  );

  const byTerm = new Map<string, SrsTermState>();
  for (const e of sorted) {
    if (e.track !== "english" || e.type !== "term_review") continue;
    const term = normalizeTerm(e.payload?.term);
    if (!term) continue;
    const known = e.payload?.known === true;
    const dayKey = dayKeyOf(e.at);
    const prev = byTerm.get(term);
    const box = known ? Math.min((prev?.box ?? 0) + 1, SRS_MAX_BOX) : 0;
    const dueDayKey = dayKey ? shiftDayKey(dayKey, SRS_INTERVALS[box]) : today;
    byTerm.set(term, {
      term,
      box,
      seen: (prev?.seen ?? 0) + 1,
      misses: (prev?.misses ?? 0) + (known ? 0 : 1),
      lastAt: e.at,
      lastKnown: known,
      dueDayKey,
      due: dueDayKey <= today,
    });
  }

  const terms = Array.from(byTerm.values()).sort(sortTerms);
  const due = terms.filter((t) => t.due);
  return {
    terms,
    due,
    dueCount: due.length,
    seenTerms: terms.length,
    lastKnownTerms: terms.filter((t) => t.lastKnown).length,
    masteredTerms: terms.filter((t) => t.box >= 4).length,
  };
}

export function srsDueCount(events: ProgressEvent[], todayKey?: string): number {
  return deriveSrs(events, todayKey).dueCount;
}
