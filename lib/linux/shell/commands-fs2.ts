/** cp / mv / rm for the simulated shell. */

import type { ShellResult, ShellState, VNode } from "./types.ts";
import { absPath, canWrite, isDir, listDir, parentPath, baseName } from "./vfs.ts";
import { ok, err, flagsOf } from "./commands-common.ts";

function copyNode(state: ShellState, srcPath: string, destPath: string, recursive: boolean): ShellResult | null {
  const src = state.nodes.get(srcPath);
  if (!src) return err(`cp: cannot stat '${srcPath}': No such file or directory`);
  if (isDir(src)) {
    if (!recursive) return err(`cp: -r not specified; omitting directory '${srcPath}'`);
    if (!state.nodes.get(destPath)) {
      const parent = state.nodes.get(parentPath(destPath));
      if (!parent || !canWrite(state, parent)) return err(`cp: cannot create directory '${destPath}': Permission denied`, 126);
      state.nodes.set(destPath, { kind: "dir", mode: src.mode, owner: state.user, inode: state.inodeSeq++ });
    }
    for (const e of listDir(state, srcPath)) {
      const childSrc = (srcPath === "/" ? "" : srcPath) + "/" + e.name;
      const r = copyNode(state, childSrc, (destPath === "/" ? "" : destPath) + "/" + e.name, true);
      if (r) return r;
    }
    return null;
  }
  const parent = state.nodes.get(parentPath(destPath));
  if (!parent || !isDir(parent)) return err(`cp: cannot create '${destPath}': Not a directory`);
  if (!canWrite(state, parent)) return err(`cp: cannot create '${destPath}': Permission denied`, 126);
  // copy content (new inode) — matches real fs semantics for plain files
  state.nodes.set(destPath, { kind: "file", content: src.content ?? "", mode: src.mode, owner: state.user, inode: state.inodeSeq++ });
  return null;
}

export function cmdCp(state: ShellState, argv: string[]): ShellResult {
  const { flags, rest } = flagsOf(argv, ["r"]);
  if (rest.length !== 2) return err("usage: cp [-r] SOURCE DEST");
  const [srcInput, destInput] = rest;
  const src = absPath(state, srcInput);
  let dest = absPath(state, destInput);
  const destNode = state.nodes.get(dest);
  if (destNode && isDir(destNode)) dest = (dest === "/" ? "" : dest) + "/" + baseName(src);
  const r = copyNode(state, src, dest, flags.has("r"));
  if (r) return r;
  return ok();
}

export function cmdMv(state: ShellState, argv: string[]): ShellResult {
  if (argv.length !== 2) return err("usage: mv SOURCE DEST");
  const [srcInput, destInput] = argv;
  const src = absPath(state, srcInput);
  const srcNode = state.nodes.get(src);
  if (!srcNode) return err(`mv: cannot stat '${srcInput}': No such file or directory`);
  let dest = absPath(state, destInput);
  const destNode = state.nodes.get(dest);
  if (destNode && isDir(destNode)) dest = (dest === "/" ? "" : dest) + "/" + baseName(src);
  const srcParent = state.nodes.get(parentPath(src));
  const destParent = state.nodes.get(parentPath(dest));
  if (!srcParent || !canWrite(state, srcParent)) return err(`mv: cannot move '${srcInput}': Permission denied`, 126);
  if (!destParent || !isDir(destParent)) return err(`mv: cannot move to '${destInput}': Not a directory`);
  if (!canWrite(state, destParent)) return err(`mv: cannot move to '${destInput}': Permission denied`, 126);
  if (state.nodes.has(dest) && isDir(state.nodes.get(dest)) && !isDir(srcNode)) return err(`mv: cannot overwrite directory '${destInput}' with non-directory`);
  state.nodes.set(dest, srcNode);
  removeTree(state, src);
  return ok();
}

function removeTree(state: ShellState, path: string) {
  const node = state.nodes.get(path);
  if (!node) return;
  if (isDir(node)) {
    for (const [p] of state.nodes) {
      if (p !== path && p.startsWith(path + "/")) state.nodes.delete(p);
    }
  }
  state.nodes.delete(path);
}

export function cmdRm(state: ShellState, argv: string[]): ShellResult {
  const { flags, rest } = flagsOf(argv, ["r", "f"]);
  if (!rest.length) return err("rm: missing operand");
  for (const r of rest) {
    const target = absPath(state, r);
    const node = state.nodes.get(target);
    if (!node) {
      if (flags.has("f")) continue;
      return err(`rm: cannot remove '${r}': No such file or directory`);
    }
    const parent = state.nodes.get(parentPath(target));
    if (parent && !canWrite(state, parent)) return err(`rm: cannot remove '${r}': Permission denied`, 126);
    if (isDir(node) && !flags.has("r")) return err(`rm: cannot remove '${r}': Is a directory`);
    removeTree(state, target);
  }
  return ok();
}
