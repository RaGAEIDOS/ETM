"use client";

/**
 * Personal notes for the Linux track.
 *
 * Notes are free text keyed by video id ("lnx-01"…"lnx-53"). They are private
 * learning data, so they live under their own localStorage key and are
 * included in "Export my data" / "Delete my data" alongside the progress
 * file. They are never committed to the repo nor shown to anyone else.
 */

export const LINUX_NOTES_KEY = "etm-linux-notes-v1";

export interface LinuxNote {
  text: string;
  updatedAt: string;
}

export type LinuxNotesMap = Record<string, LinuxNote>;

function isNote(v: unknown): v is LinuxNote {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as LinuxNote).text === "string" &&
    typeof (v as LinuxNote).updatedAt === "string"
  );
}

export function loadLinuxNotes(): LinuxNotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LINUX_NOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: LinuxNotesMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (isNote(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveLinuxNote(videoId: string, text: string): LinuxNote | null {
  if (typeof window === "undefined") return null;
  const all = loadLinuxNotes();
  const note: LinuxNote = { text, updatedAt: new Date().toISOString() };
  if (text.trim() === "") {
    delete all[videoId];
  } else {
    all[videoId] = note;
  }
  try {
    window.localStorage.setItem(LINUX_NOTES_KEY, JSON.stringify(all));
  } catch {
    /* storage may be blocked */
  }
  return text.trim() === "" ? null : note;
}

/** Union merge; when both sides have a note for a video, the newer one wins. */
export function mergeLinuxNotes(a: LinuxNotesMap, b: LinuxNotesMap): LinuxNotesMap {
  const out: LinuxNotesMap = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const existing = out[k];
    if (!existing || v.updatedAt > existing.updatedAt) out[k] = v;
  }
  return out;
}

/** Merge an exported notes payload into the device's notes. Returns how many
 *  notes were taken from the file. Never throws. */
export function importLinuxNotes(raw: unknown): number {
  if (!raw || typeof raw !== "object") return 0;
  const clean: LinuxNotesMap = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (isNote(v)) clean[k] = v;
  }
  const merged = mergeLinuxNotes(loadLinuxNotes(), clean);
  try {
    window.localStorage.setItem(LINUX_NOTES_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return Object.keys(clean).length;
}

export function deleteLinuxNotes(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LINUX_NOTES_KEY);
  } catch {
    /* ignore */
  }
}
