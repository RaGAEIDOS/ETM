import type { NodeKind, ShellState, VNode } from "./types.ts";
import { baseName, joinPath, normalizePath, parentPath } from "./paths.ts";

const isDir = (n?: VNode): boolean => !!n && n.kind === "dir";

function mkdirp(state: ShellState, path: string, mode = 0o755): boolean {
  if (state.nodes.has(path)) return isDir(state.nodes.get(path));
  const parent = parentPath(path);
  if (parent !== path && !mkdirp(state, parent, 0o755)) return false;
  state.nodes.set(path, { kind: "dir", mode, owner: state.user, inode: state.inodeSeq++ });
  return true;
}

/** Build the starting filesystem for the lab (a tiny but realistic home). */
export function freshShellState(env: Record<string, string> = {}): ShellState {
  const state: ShellState = {
    nodes: new Map(),
    cwd: "/home/learner",
    env: { USER: "learner", HOME: "/home/learner", PATH: "/usr/bin:/bin", ...env },
    user: "learner",
    history: [],
    lastOutput: "",
    cleared: false,
    inodeSeq: 1,
  };
  mkdirp(state, "/", 0o755);
  mkdirp(state, "/home", 0o755);
  mkdirp(state, "/home/learner", 0o755);
  mkdirp(state, "/home/learner/docs", 0o755);
  mkdirp(state, "/etc", 0o755);
  mkdirp(state, "/tmp", 0o777);
  const file = (path: string, content: string, mode = 0o644, owner = "learner") =>
    state.nodes.set(path, { kind: "file", content, mode, owner, inode: state.inodeSeq++ });
  file("/home/learner/notes.txt",
    "لينكس نظام تشغيل حر ومفتوح المصدر.\nيعتمد على نواة Linux.\nتديره مجتمعات ومؤسسات حول العالم.\n");
  file("/home/learner/docs/todo.md", "- تعلم chmod\n- تعلم grep\n- تعلم find\n");
  file("/etc/hostname", "etm-lab\n", 0o644, "root");
  file("/tmp/guest-notes.txt", "هذه ملاحظات الضيوف.\n");
  return state;
}

/** Resolve a path, following symlinks. Returns null when a link is broken. */
export function resolvePath(state: ShellState, path: string, followLinks = true): string | null {
  let current = path;
  for (let depth = 0; depth < 16; depth++) {
    const node = state.nodes.get(current);
    if (!node) return current; // maybe a not-yet-created file — return as-is
    if (node.kind !== "symlink" || !followLinks) return current;
    const target = node.target ?? "";
    current = target.startsWith("/") ? target : normalizePath(parentPath(current), target);
  }
  return null; // link loop
}

export function getNode(state: ShellState, input: string): VNode | undefined {
  const p = resolvePath(state, normalizePath(state.cwd, input));
  return p === null ? undefined : state.nodes.get(p);
}

export function absPath(state: ShellState, input: string): string {
  return normalizePath(state.cwd, input);
}

function permTriple(node: VNode, user: string): number {
  const shift = node.owner === user ? 6 : 0; // ignore groups: other-class for non-owners
  return (node.mode >> shift) & 0o7;
}

const r = (bits: number) => (bits & 4 ? "r" : "-");
const w = (bits: number) => (bits & 2 ? "w" : "-");
const x = (bits: number) => (bits & 1 ? "x" : "-");
export function modeString(node: VNode): string {
  const kind = node.kind === "dir" ? "d" : node.kind === "symlink" ? "l" : "-";
  const t = (shift: number) => {
    const bits = (node.mode >> shift) & 7;
    return r(bits) + w(bits) + x(bits);
  };
  return kind + t(6) + t(3) + t(0);
}

export function canRead(state: ShellState, node: VNode): boolean {
  if (state.user === "root") return true;
  return (permTriple(node, state.user) & 4) !== 0;
}
export function canWrite(state: ShellState, node: VNode): boolean {
  if (state.user === "root") return true;
  return (permTriple(node, state.user) & 2) !== 0;
}
export function canExecDir(state: ShellState, node: VNode): boolean {
  if (state.user === "root") return true;
  return (permTriple(node, state.user) & 1) !== 0;
}

export function listDir(state: ShellState, path: string): { name: string; node: VNode }[] {
  const prefix = path === "/" ? "" : path + "/";
  const out: { name: string; node: VNode }[] = [];
  for (const [p, node] of state.nodes) {
    if (!p.startsWith(prefix)) continue;
    const rest = p.slice(prefix.length);
    if (rest.split("/").length !== 1 || !rest) continue;
    out.push({ name: rest, node });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export { mkdirp, isDir, baseName, parentPath, joinPath, normalizePath };
