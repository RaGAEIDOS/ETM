"use client";

/**
 * Personal notes for the CS50x track.
 *
 * Notes are free text keyed by lecture id. They are private learning data,
 * so they live under their own localStorage key and are included in
 * "Export my data" / "Delete my data" alongside the progress file.
 */

export const CS50X_NOTES_KEY = "etm-cs50x-notes-v1";
export const CS50X_CERT_KEY = "etm-cs50x-certificate-v1";

export interface Cs50xNote {
  text: string;
  updatedAt: string;
}

export type Cs50xNotesMap = Record<string, Cs50xNote>;

function isNote(v: unknown): v is Cs50xNote {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Cs50xNote).text === "string" &&
    typeof (v as Cs50xNote).updatedAt === "string"
  );
}

export function loadCs50xNotes(): Cs50xNotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CS50X_NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Cs50xNotesMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (isNote(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveCs50xNote(videoId: string, text: string): Cs50xNote | null {
  if (typeof window === "undefined") return null;
  const all = loadCs50xNotes();
  const note: Cs50xNote = { text, updatedAt: new Date().toISOString() };
  if (text.trim() === "") {
    delete all[videoId];
  } else {
    all[videoId] = note;
  }
  try {
    window.localStorage.setItem(CS50X_NOTES_KEY, JSON.stringify(all));
  } catch {
    /* storage may be blocked */
  }
  return text.trim() === "" ? null : note;
}

/** Union merge; when both sides have a note for a lecture, the newer one wins. */
export function mergeCs50xNotes(a: Cs50xNotesMap, b: Cs50xNotesMap): Cs50xNotesMap {
  const out: Cs50xNotesMap = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const existing = out[k];
    if (!existing || v.updatedAt > existing.updatedAt) out[k] = v;
  }
  return out;
}

/** Merge an exported notes payload into the device's notes. Returns how many notes were taken from the file. Never throws. */
export function importCs50xNotes(raw: unknown): number {
  if (!raw || typeof raw !== "object") return 0;
  const clean: Cs50xNotesMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (isNote(v)) clean[k] = v;
  }
  const merged = mergeCs50xNotes(loadCs50xNotes(), clean);
  try {
    window.localStorage.setItem(CS50X_NOTES_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return Object.keys(clean).length;
}

export function deleteCs50xNotes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CS50X_NOTES_KEY);
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Certificate checklist (local-only): tracks the learner's own claim progress
// toward the free CS50 Certificate. Not submitted anywhere by this platform.
// ---------------------------------------------------------------------------

export const CS50X_PSET_IDS = [
  "pset-0",
  "pset-1",
  "pset-2",
  "pset-3",
  "pset-4",
  "pset-5",
  "pset-6",
  "pset-7",
  "pset-8",
  "pset-9",
  "final-project",
] as const;

export type Cs50xPsetId = (typeof CS50X_PSET_IDS)[number];

export interface Cs50xCertificateState {
  done: Cs50xPsetId[];
  updatedAt: string;
}

function isCs50xPsetId(v: unknown): v is Cs50xPsetId {
  return typeof v === "string" && (CS50X_PSET_IDS as readonly string[]).includes(v);
}

export function loadCs50xCertificate(): Cs50xCertificateState {
  if (typeof window === "undefined") return { done: [], updatedAt: "" };
  try {
    const raw = window.localStorage.getItem(CS50X_CERT_KEY);
    if (!raw) return { done: [], updatedAt: "" };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return { done: [], updatedAt: "" };
    const done = Array.isArray((parsed as { done?: unknown }).done)
      ? ((parsed as { done: unknown[] }).done.filter(isCs50xPsetId) as Cs50xPsetId[])
      : [];
    const updatedAt = typeof (parsed as { updatedAt?: unknown }).updatedAt === "string"
      ? (parsed as { updatedAt: string }).updatedAt
      : "";
    return { done: Array.from(new Set(done)), updatedAt };
  } catch {
    return { done: [], updatedAt: "" };
  }
}

export function toggleCs50xCertificateItem(id: Cs50xPsetId): Cs50xCertificateState {
  const current = loadCs50xCertificate();
  const set = new Set(current.done);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  const next: Cs50xCertificateState = { done: Array.from(set), updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(CS50X_CERT_KEY, JSON.stringify(next));
  } catch {
    /* storage may be blocked */
  }
  return next;
}

export function deleteCs50xCertificate(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CS50X_CERT_KEY);
  } catch {
    /* ignore */
  }
}
