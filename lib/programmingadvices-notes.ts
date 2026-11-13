"use client";

/**
 * Personal notes for the Programming Advices track.
 *
 * Notes are free text keyed by lesson id ("pa1-01" … "pa2-50"). They are
 * private learning data: they live under their own localStorage key, are
 * included in "Export my data" / "Delete my data", and are never committed to
 * the repo or shown to anyone else.
 */

export const PA_NOTES_KEY = "etm-programmingadvices-notes-v1";

export interface PANote {
  text: string;
  updatedAt: string;
}

export type PANotesMap = Record<string, PANote>;

function isNote(v: unknown): v is PANote {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as PANote).text === "string" &&
    typeof (v as PANote).updatedAt === "string"
  );
}

export function loadPANotes(): PANotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PA_NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: PANotesMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (isNote(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function savePANote(videoId: string, text: string): PANote | null {
  if (typeof window === "undefined") return null;
  const all = loadPANotes();
  const note: PANote = { text, updatedAt: new Date().toISOString() };
  if (text.trim() === "") {
    delete all[videoId];
  } else {
    all[videoId] = note;
  }
  try {
    window.localStorage.setItem(PA_NOTES_KEY, JSON.stringify(all));
  } catch {
    /* storage may be blocked */
  }
  return text.trim() === "" ? null : note;
}

/** Union merge; when both sides have a note for a lesson, the newer one wins. */
export function mergePANotes(a: PANotesMap, b: PANotesMap): PANotesMap {
  const out: PANotesMap = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const existing = out[k];
    if (!existing || v.updatedAt > existing.updatedAt) out[k] = v;
  }
  return out;
}

/** Merge an exported notes payload into the device's notes. Never throws. */
export function importPANotes(raw: unknown): number {
  if (!raw || typeof raw !== "object") return 0;
  const clean: PANotesMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (isNote(v)) clean[k] = v;
  }
  const merged = mergePANotes(loadPANotes(), clean);
  try {
    window.localStorage.setItem(PA_NOTES_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return Object.keys(clean).length;
}

export function deletePANotes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PA_NOTES_KEY);
  } catch {
    /* ignore */
  }
}
