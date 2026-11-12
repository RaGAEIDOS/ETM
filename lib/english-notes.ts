"use client";

/**
 * Personal notes for the English track (Phase 4).
 *
 * Notes are free text keyed by video id. They are private learning data,
 * so they live under their own localStorage key and are included in
 * "Export my data" / "Delete my data" alongside the progress file.
 */

export const ENGLISH_NOTES_KEY = "etm-english-notes-v1";

export interface EnglishNote {
  text: string;
  updatedAt: string;
}

export type EnglishNotesMap = Record<string, EnglishNote>;

function isNote(v: unknown): v is EnglishNote {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as EnglishNote).text === "string" &&
    typeof (v as EnglishNote).updatedAt === "string"
  );
}

export function loadEnglishNotes(): EnglishNotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ENGLISH_NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: EnglishNotesMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (isNote(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveEnglishNote(videoId: string, text: string): EnglishNote | null {
  if (typeof window === "undefined") return null;
  const all = loadEnglishNotes();
  const note: EnglishNote = { text, updatedAt: new Date().toISOString() };
  if (text.trim() === "") {
    delete all[videoId];
  } else {
    all[videoId] = note;
  }
  try {
    window.localStorage.setItem(ENGLISH_NOTES_KEY, JSON.stringify(all));
  } catch {
    /* storage may be blocked */
  }
  return text.trim() === "" ? null : note;
}

/** Union merge; when both sides have a note for a video, the newer one wins. */
export function mergeEnglishNotes(a: EnglishNotesMap, b: EnglishNotesMap): EnglishNotesMap {
  const out: EnglishNotesMap = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const existing = out[k];
    if (!existing || v.updatedAt > existing.updatedAt) out[k] = v;
  }
  return out;
}

/** Merge an exported notes payload into the device's notes. Returns how many
 *  notes were taken from the file. Never throws. */
export function importEnglishNotes(raw: unknown): number {
  if (!raw || typeof raw !== "object") return 0;
  const clean: EnglishNotesMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (isNote(v)) clean[k] = v;
  }
  const merged = mergeEnglishNotes(loadEnglishNotes(), clean);
  try {
    window.localStorage.setItem(ENGLISH_NOTES_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return Object.keys(clean).length;
}

export function deleteEnglishNotes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ENGLISH_NOTES_KEY);
  } catch {
    /* ignore */
  }
}
