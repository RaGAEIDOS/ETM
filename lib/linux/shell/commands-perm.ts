/** chmod + ln for the simulated shell. */

import type { ShellResult, ShellState, VNode } from "./types.ts";
import { absPath, canWrite, isDir, parentPath } from "./vfs.ts";
import { ok, err, flagsOf } from "./commands-common.ts";

const octalToMode = (s: string): number | null => {
  const m = s.match(/^[0-7]{3,4}$/);
  if (!m) return null;
  return parseInt(s.slice(-3), 8);
};

function applySymbolic(mode: number, spec: string): number | null {
  // e.g. "u+x", "go-rw", "a=r", comma-separated
  for (const clause of spec.split(",")) {
    const m = clause.match(/^([ugoa]*)([+\-=])([rwx]*)$/);
    if (!m) return null;
    const [, who, op, perms] = m;
    const bits = (perms.includes("r") ? 4 : 0) | (perms.includes("w") ? 2 : 0) | (perms.includes("x") ? 1 : 0);
    const classes = who === "" || who.includes("a") ? ["u", "g", "o"] : who.split("");
    for (const c of classes) {
      const shift = c === "u" ? 6 : c === "g" ? 3 : 0;
      const mask = 7 << shift;
      if (op === "+") mode |= bits << shift;
      else if (op === "-") mode &= ~(bits << shift);
      else mode = (mode & ~mask) | (bits << shift);
    }
  }
  return mode;
}

export function cmdChmod(state: ShellState, argv: string[]): ShellResult {
  if (argv.length < 2) return err("usage: chmod MODE FILE...");
  const [modeSpec, ...targets] = argv;
  const octal = octalToMode(modeSpec);
  for (const t of targets) {
    const target = absPath(state, t);
    const node = state.nodes.get(target);
    if (!node) return err(`chmod: cannot access '${t}': No such file or directory`);
    if (node.owner !== state.user && state.user !== "root")
      return err(`chmod: changing permissions of '${t}': Operation not permitted`, 126);
    const next = octal !== null ? octal : applySymbolic(node.mode, modeSpec);
    if (next === null || next === undefined) return err(`chmod: invalid mode: '${modeSpec}'`);
    node.mode = next;
  }
  return ok();
}

export function cmdLn(state: ShellState, argv: string[]): ShellResult {
  const { flags, rest } = flagsOf(argv, ["s"]);
  if (rest.length !== 2) return err("usage: ln [-s] TARGET NAME");
  const [source, name] = rest;
  const target = absPath(state, name);
  const parent = state.nodes.get(parentPath(target));
  if (!parent) return err(`ln: cannot create link '${name}': No such file or directory`);
  if (!isDir(parent)) return err(`ln: cannot create link '${name}': Not a directory`);
  if (!canWrite(state, parent)) return err(`ln: cannot create link '${name}': Permission denied`, 126);
  if (state.nodes.has(target)) return err(`ln: failed to create link '${name}': File exists`);
  if (flags.has("s")) {
    state.nodes.set(target, { kind: "symlink", target: source, mode: 0o777, owner: state.user, inode: state.inodeSeq++ });
    return ok();
  }
  // hard link: same file object shared between two names (like a real hard link)
  const resolved = state.nodes.get(
    source.startsWith("/") ? source : absPath(state, source)
  );
  if (!resolved) return err(`ln: failed to create hard link '${name}' => '${source}': No such file or directory`);
  if (isDir(resolved)) return err(`ln: '${source}': hard link not allowed for directory`);
  state.nodes.set(target, resolved); // shared object — shared inode, as on a real fs
  return ok();
}
