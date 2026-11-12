/** Command registry + pipeline engine for the simulated shell. */

import type { ShellResult, ShellState } from "./types.ts";
import { parseInput } from "./parser.ts";
import { absPath, canWrite, isDir, listDir, parentPath } from "./vfs.ts";
import { matchGlob } from "./glob.ts";
import { ok, err } from "./commands-common.ts";
import {
  cmdCat,
  cmdCd,
  cmdEcho,
  cmdLs,
  cmdMkdir,
  cmdPwd,
  cmdTouch,
} from "./commands-file.ts";
import { cmdCp, cmdMv, cmdRm } from "./commands-fs2.ts";
import { cmdHeadTail, cmdWc, cmdGrep, cmdFind } from "./commands-text.ts";
import { cmdChmod, cmdLn } from "./commands-perm.ts";
import {
  cmdClear,
  cmdDate,
  cmdHelp,
  cmdHistory,
  cmdId,
  cmdWhoami,
} from "./commands-misc.ts";

export type SimCommand = (state: ShellState, argv: string[], stdin: string) => ShellResult;

export const SIM_COMMANDS: Record<string, SimCommand> = {
  pwd: (s) => cmdPwd(s),
  cd: (s, argv) => cmdCd(s, argv),
  ls: (s, argv, stdin) => cmdLs(s, argv, stdin),
  mkdir: (s, argv) => cmdMkdir(s, argv),
  touch: (s, argv) => cmdTouch(s, argv),
  cat: (s, argv, stdin) => cmdCat(s, argv, stdin),
  echo: (s, argv) => cmdEcho(s, argv),
  cp: (s, argv) => cmdCp(s, argv),
  mv: (s, argv) => cmdMv(s, argv),
  rm: (s, argv) => cmdRm(s, argv),
  ln: (s, argv) => cmdLn(s, argv),
  head: (s, argv, stdin) => cmdHeadTail("head")(s, argv, stdin),
  tail: (s, argv, stdin) => cmdHeadTail("tail")(s, argv, stdin),
  wc: (s, argv, stdin) => cmdWc(s, argv, stdin),
  grep: (s, argv, stdin) => cmdGrep(s, argv, stdin),
  find: (s, argv) => cmdFind(s, argv),
  chmod: (s, argv) => cmdChmod(s, argv),
  whoami: (s) => cmdWhoami(s),
  id: (s) => cmdId(s),
  date: (s) => cmdDate(s),
  clear: (s) => cmdClear(s),
  history: (s) => cmdHistory(s),
  help: (s, argv) => cmdHelp(s, argv),
  man: (s, argv) => cmdHelp(s, argv),
};

export const SIM_COMMAND_NAMES = Object.keys(SIM_COMMANDS);

function writeRedirect(state: ShellState, targetInput: string, content: string, append: boolean): ShellResult {
  const target = absPath(state, targetInput);
  const existing = state.nodes.get(target);
  if (existing && isDir(existing)) return err(`sh: ${targetInput}: Is a directory`);
  const parent = state.nodes.get(parentPath(target));
  if (!parent) return err(`sh: ${targetInput}: No such file or directory`);
  if (!canWrite(state, parent)) return err(`sh: ${targetInput}: Permission denied`, 126);
  const prior = existing?.content ?? "";
  state.nodes.set(target, {
    kind: "file",
    content: append ? prior + content : content,
    mode: existing?.mode ?? 0o644,
    owner: existing?.owner ?? state.user,
    inode: existing?.inode ?? state.inodeSeq++,
  });
  return ok();
}

/** Run one input line. Mutates only the sandboxed ShellState. */
export function runShellInput(state: ShellState, input: string): ShellResult {
  const trimmed = input.trim();
  state.history.push(input);
  state.cleared = false;
  if (!trimmed) return ok();

  const parsed = parseInput(trimmed, state.env);
  if (!parsed.ok) return err(`sh: ${parsed.error}`, 2);

  let stdin = "";
  let last: ShellResult = ok();
  for (const stage of parsed.stages) {
    const name = stage.argv[0];
    const fn = SIM_COMMANDS[name];
    if (!fn) return err(`sh: command not found: ${name}`, 127);
    // shell-style glob expansion for unquoted arguments
    const argv: string[] = [];
    for (let i = 0; i < stage.argv.length; i++) {
      const arg = stage.argv[i];
      if (stage.argQuoted[i] || !/[*?\[]/.test(arg)) {
        argv.push(arg);
        continue;
      }
      const slash = arg.lastIndexOf("/");
      const dirPart = slash === -1 ? "." : slash === 0 ? "/" : arg.slice(0, slash);
      const base = slash === -1 ? arg : arg.slice(slash + 1);
      const dirAbs = absPath(state, dirPart);
      const dirNode = state.nodes.get(dirAbs);
      if (!dirNode || !isDir(dirNode)) {
        argv.push(arg);
        continue;
      }
      const names = listDir(state, dirAbs).map((e) => e.name);
      const matches = matchGlob(base, names);
      if (!matches) {
        argv.push(arg);
        continue;
      }
      const prefix = dirPart === "." ? "" : dirPart === "/" ? "/" : dirPart + "/";
      for (const m of matches) argv.push(prefix + m);
    }
    last = fn(state, argv.slice(1), stdin);
    stdin = last.stdout;
    if (stage.redirectTo) {
      const w = writeRedirect(state, stage.redirectTo, last.stdout, stage.redirectMode === ">>");
      if (w.exitCode !== 0) return w;
      last = ok();
      stdin = "";
    }
  }
  state.lastOutput = last.stdout;
  return last;
}
