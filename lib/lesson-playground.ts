// Persistence + identity helpers for the per-lesson playground.
// All storage access is guarded: failures silently degrade to in-memory state.

export function hash32(text: string): string {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h.toString(16).padStart(8, "0");
}

export interface PlaygroundStorageContext {
  scope: "elzero" | "learn" | "glossary";
  id: string; // lesson id, e.g. "elzero-001" or "cpp-basics:hello-world"
  blockHash?: string; // hash of the starter code (set by Markdown/CodeBlock)
}

export function playgroundStorageKey(ctx: PlaygroundStorageContext): string {
  const suffix = ctx.blockHash ? `-${ctx.blockHash}` : "";
  return `etm-lesson-code-${ctx.scope}-${ctx.id}${suffix}`;
}
export function attemptsKey(ctx: PlaygroundStorageContext): string {
  return `${playgroundStorageKey(ctx)}-attempts`;
}
export function hintsKey(ctx: PlaygroundStorageContext): string {
  return `${playgroundStorageKey(ctx)}-hints`;
}

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): boolean;
  del(key: string): void;
}

function memoryAdapter(): StorageAdapter {
  const map = new Map<string, string>();
  return {
    get: (k) => (map.has(k) ? map.get(k)! : null),
    set: (k, v) => { map.set(k, v); return true; },
    del: (k) => { map.delete(k); },
  };
}

export function getStorageAdapter(): StorageAdapter {
  try {
    if (typeof localStorage === "undefined") return memoryAdapter();
    const s = localStorage;
    const probe = `${playgroundStorageKey({ scope: "elzero", id: "__probe" })}-${Math.random()}`;
    s.setItem(probe, "1");
    s.removeItem(probe);
    return {
      get: (k) => s.getItem(k),
      set: (k, v) => { try { s.setItem(k, v); return true; } catch { return false; } },
      del: (k) => s.removeItem(k),
    };
  } catch {
    return memoryAdapter();
  }
}

export function loadSavedCode(ctx: PlaygroundStorageContext): string | null {
  return getStorageAdapter().get(playgroundStorageKey(ctx));
}

export function saveCode(ctx: PlaygroundStorageContext, code: string): boolean {
  return getStorageAdapter().set(playgroundStorageKey(ctx), code ?? "");
}

export function clearSavedCode(ctx: PlaygroundStorageContext): void {
  getStorageAdapter().del(playgroundStorageKey(ctx));
}

export function loadAttempts(ctx: PlaygroundStorageContext): number {
  const raw = getStorageAdapter().get(attemptsKey(ctx));
  const n = Number(raw ?? 0);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function bumpAttempts(ctx: PlaygroundStorageContext): number {
  const next = loadAttempts(ctx) + 1;
  getStorageAdapter().set(attemptsKey(ctx), String(next));
  return next;
}

export function loadHintsUnlocked(ctx: PlaygroundStorageContext): number {
  const raw = getStorageAdapter().get(hintsKey(ctx));
  const n = Number(raw ?? 0);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function saveHintsUnlocked(ctx: PlaygroundStorageContext, count: number): void {
  getStorageAdapter().set(hintsKey(ctx), String(Math.max(0, Math.floor(count))));
}

export function clearPlaygroundState(ctx: PlaygroundStorageContext): void {
  clearSavedCode(ctx);
  getStorageAdapter().del(attemptsKey(ctx));
  getStorageAdapter().del(hintsKey(ctx));
}
