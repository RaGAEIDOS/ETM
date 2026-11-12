/** File-system commands for the simulated shell. */

import type { ShellResult, ShellState, VNode } from "./types.ts";
import {
  absPath,
  canExecDir,
  canRead,
  canWrite,
  isDir,
  listDir,
  mkdirp,
  modeString,
  normalizePath,
  parentPath,
  baseName,
} from "./vfs.ts";
import { ok, err, flagsOf } from "./commands-common.ts";

const needReadableDir = (state: ShellState, path: string): ShellResult | null => {
  const node = state.nodes.get(path);
  if (!node) return err(`${path}: No such file or directory`);
  if (!isDir(node)) return err(`${path}: Not a directory`);
  if (!canExecDir(state, node)) return err(`${path}: Permission denied`, 126);
  if (state.user !== "root" && !(node.owner === state.user) && ((node.mode & 0o004) === 0))
    return err(`${path}: Permission denied`, 126);
  return null;
};

export function cmdPwd(state: ShellState): ShellResult {
  return ok(state.cwd + "\n");
}

export function cmdCd(state: ShellState, argv: string[]): ShellResult {
  const targetInput = argv[0] ?? "~";
  const target = absPath(state, targetInput);
  const dirErr = needReadableDir(state, target);
  if (dirErr) return dirErr;
  state.cwd = target;
  return ok();
}

export function cmdLs(state: ShellState, argv: string[], stdin: string): ShellResult {
  const { flags, rest } = flagsOf(argv, ["l", "a", "h"]);
  const dirs = rest.length ? rest : [state.cwd];
  const showLong = flags.has("l");
  const showAll = flags.has("a");
  const human = flags.has("h");
  const blocks: string[] = [];
  for (const d of dirs) {
    const path = absPath(state, d);
    const target = state.nodes.get(path) ? path : resolveSymlink(state, path);
    const node = state.nodes.get(target);
    if (!node) {
      blocks.push(`ls: cannot access '${d}': No such file or directory`);
      continue;
    }
    if (!isDir(node)) {
      blocks.push(showLong ? longLine(node, baseName(target), human) : `${baseName(target)}\n`);
      continue;
    }
    const dirErr = needReadableDir(state, target);
    if (dirErr) {
      blocks.push(`${dirErr.stderr.trim().replace(/^/, "ls: ")}`);
      continue;
    }
    let entries = listDir(state, target);
    if (!showAll) entries = entries.filter((e) => !e.name.startsWith("."));
    if (showAll) {
      // synthetic self/parent entries, like a real `ls -a`
      const parent = parentPath(target);
      const parentNode = state.nodes.get(parent);
      entries = [
        { name: ".", node },
        { name: "..", node: parent !== target && parentNode ? parentNode : node },
        ...entries,
      ];
    }
    const names = entries.map((e) =>
      showLong ? longLine(e.node, e.name + (e.node.kind === "symlink" ? " -> " + e.node.target : ""), human) : e.name + "\n"
    );
    blocks.push(names.join(""));
  }
  return ok(blocks.join(""));
}

function resolveSymlink(state: ShellState, path: string): string {
  const node = state.nodes.get(path);
  if (node?.kind === "symlink") {
    const t = node.target ?? "";
    return t.startsWith("/") ? t : normalizePath(parentPath(path), t);
  }
  return path;
}

function humanSize(n: number): string {
  if (n < 1024) return String(n);
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + "K";
  return (n / 1024 / 1024).toFixed(1) + "M";
}

function longLine(node: VNode, name: string, human: boolean): string {
  const size = node.content ? node.content.length : 0;
  return `${modeString(node)} ${node.owner.padEnd(7)} ${human ? humanSize(size).padStart(5) : String(size).padStart(6)} ${name}\n`;
}

export function cmdMkdir(state: ShellState, argv: string[]): ShellResult {
  const { flags, rest } = flagsOf(argv, ["p"]);
  if (!rest.length) return err("mkdir: missing operand");
  for (const r of rest) {
    const target = absPath(state, r);
    const parent = parentPath(target);
    const parentNode = state.nodes.get(parent);
    if (!flags.has("p")) {
      if (!parentNode) return err(`mkdir: cannot create directory '${r}': No such file or directory`);
      if (!isDir(parentNode)) return err(`mkdir: cannot create directory '${r}': Not a directory`);
      if (state.nodes.has(target)) return err(`mkdir: cannot create directory '${r}': File exists`);
      if (!canWrite(state, parentNode)) return err(`mkdir: cannot create directory '${r}': Permission denied`, 126);
      state.nodes.set(target, { kind: "dir", mode: 0o755, owner: state.user, inode: state.inodeSeq++ });
    } else {
      // -p: create missing ancestors; existing dirs are fine
      const parts = target.split("/").filter(Boolean);
      let acc = "";
      for (const part of parts) {
        acc = acc + "/" + part;
        const n = state.nodes.get(acc);
        if (!n) {
          const pNode = state.nodes.get(parentPath(acc));
          if (pNode && !canWrite(state, pNode)) return err(`mkdir: cannot create directory '${acc}': Permission denied`, 126);
          mkdirp(state, acc);
        } else if (!isDir(n)) {
          return err(`mkdir: cannot create directory '${r}': Not a directory at '${acc}'`);
        }
      }
    }
  }
  return ok();
}

export function cmdTouch(state: ShellState, argv: string[]): ShellResult {
  if (!argv.length) return err("touch: missing file operand");
  for (const r of argv) {
    const target = absPath(state, r);
    if (state.nodes.has(target)) continue;
    const parent = state.nodes.get(parentPath(target));
    if (!parent) return err(`touch: cannot touch '${r}': No such file or directory`);
    if (!canWrite(state, parent)) return err(`touch: cannot touch '${r}': Permission denied`, 126);
    state.nodes.set(target, { kind: "file", content: "", mode: 0o644, owner: state.user, inode: state.inodeSeq++ });
  }
  return ok();
}

export function cmdCat(state: ShellState, argv: string[], stdin: string): ShellResult {
  if (!argv.length) return ok(stdin);
  let out = "";
  for (const r of argv) {
    const target = absPath(state, r);
    const node = state.nodes.get(target);
    if (!node) return err(`cat: ${r}: No such file or directory`);
    if (isDir(node)) return err(`cat: ${r}: Is a directory`);
    if (node.kind === "symlink") {
      const resolved = state.nodes.get(resolveSymlink(state, target));
      if (!resolved) return err(`cat: ${r}: No such file or directory (broken link)`);
      out += resolved.content ?? "";
      continue;
    }
    if (!canRead(state, node)) return err(`cat: ${r}: Permission denied`, 126);
    out += node.content ?? "";
  }
  return ok(out);
}

export function cmdEcho(_state: ShellState, argv: string[]): ShellResult {
  if (argv[0] === "-n") return ok(argv.slice(1).join(" "));
  return ok(argv.join(" ") + "\n");
}
