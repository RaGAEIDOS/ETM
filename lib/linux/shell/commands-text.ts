/** Text-processing commands for the simulated shell. */

import type { ShellResult, ShellState } from "./types.ts";
import { absPath, canRead, isDir, listDir, normalizePath, parentPath } from "./vfs.ts";
import { globToRegex } from "./glob.ts";
import { ok, err, flagsOf } from "./commands-common.ts";

function readFileFor(state: ShellState, input: string): string | ShellResult {
  const target = absPath(state, input);
  const node = state.nodes.get(target);
  if (!node) return err(`${input}: No such file or directory`);
  if (isDir(node)) return err(`${input}: Is a directory`);
  if (node.kind === "symlink") {
    const t = node.target ?? "";
    const resolved = state.nodes.get(t.startsWith("/") ? t : normalizePath(parentPath(target), t));
    if (!resolved) return err(`${input}: No such file or directory (broken link)`);
    if (!canRead(state, resolved)) return err(`${input}: Permission denied`, 126);
    return resolved.content ?? "";
  }
  if (!canRead(state, node)) return err(`${input}: Permission denied`, 126);
  return node.content ?? "";
}

const countLines = (s: string) => (s === "" ? 0 : s.split("\n").length - (s.endsWith("\n") ? 1 : 0));

export function cmdHeadTail(which: "head" | "tail") {
  return (state: ShellState, argv: string[], stdin: string): ShellResult => {
    const nIdx = argv.indexOf("-n");
    const n = nIdx !== -1 ? Number(argv[nIdx + 1] ?? "10") : 10;
    if (!Number.isFinite(n) || n < 0) return err(`${which}: invalid number of lines`);
    const files = argv.filter((a, i) => !a.startsWith("-n") && argv[i - 1] !== "-n" && a !== "-n");
    const process = (label: string, text: string) => {
      const lines = text.split("\n");
      // a trailing newline does not create a phantom empty last line
      if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
      const take = which === "head" ? lines.slice(0, n) : lines.slice(Math.max(0, lines.length - n));
      return (files.length > 1 ? `==> ${label} <==\n` : "") + take.join("\n") + (take.length && !take[take.length - 1].endsWith("\n") ? "\n" : "");
    };
    if (!files.length) return ok(process("stdin", stdin));
    let out = "";
    for (const f of files) {
      const r = readFileFor(state, f);
      if (typeof r !== "string") return r;
      out += process(f, r);
    }
    return ok(out);
  };
}

export function cmdWc(state: ShellState, argv: string[], stdin: string): ShellResult {
  const { flags, rest } = flagsOf(argv, ["l", "w", "c"]);
  const showLines = flags.has("l"), showWords = flags.has("w"), showBytes = flags.has("c");
  const anyFlag = showLines || showWords || showBytes;
  const compute = (label: string | null, text: string) => {
    const lines = countLines(text);
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const bytes = text.replace(/\r/g, "").length;
    const parts: string[] = [];
    if (!anyFlag || showLines) parts.push(String(lines).padStart(4));
    if (!anyFlag || showWords) parts.push(String(words).padStart(4));
    if (!anyFlag || showBytes) parts.push(String(bytes).padStart(5));
    return parts.join(" ") + (label ? " " + label : "") + "\n";
  };
  if (!rest.length) return ok(compute(null, stdin));
  let out = "";
  for (const f of rest) {
    const r = readFileFor(state, f);
    if (typeof r !== "string") return r;
    out += compute(f, r);
  }
  return ok(out);
}

export function cmdGrep(state: ShellState, argv: string[], stdin: string): ShellResult {
  const { flags, rest } = flagsOf(argv, ["i", "n", "r"]);
  if (!rest.length) return err("usage: grep [-i][-n][-r] PATTERN [FILE...]");
  const [pattern, ...files] = rest;
  const needle = flags.has("i") ? pattern.toLowerCase() : pattern;
  const matchLine = (line: string) => (flags.has("i") ? line.toLowerCase() : line).includes(needle);
  const emit = (label: string | null, text: string) => {
    const lines = text.split("\n");
    const hits: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (!matchLine(lines[i])) continue;
      let line = (flags.has("n") ? `${i + 1}:` : "") + lines[i];
      if (label) line = `${label}:${line}`;
      hits.push(line);
    }
    return hits.join("\n") + (hits.length ? "\n" : "");
  };
  if (!files.length) {
    const out = emit(null, stdin);
    return out ? ok(out) : { stdout: "", stderr: "", exitCode: 1 };
  }
  let out = "", found = false;
  const multi = files.length > 1 || flags.has("r");
  const walk = (path: string, label: string): ShellResult | "done" => {
    const node = state.nodes.get(path);
    if (!node) {
      out += `grep: ${label}: No such file or directory\n`;
      return "done";
    }
    if (isDir(node)) {
      if (!flags.has("r")) return err(`grep: ${label}: Is a directory`);
      for (const e of listDir(state, path)) walk(join(path, e.name), join(label, e.name));
      return "done";
    }
    const r = readFileFor(state, path);
    if (typeof r !== "string") return r;
    const block = emit(multi ? label : null, r);
    if (block) {
      found = true;
      out += block;
    }
    return "done";
  };
  const join = (a: string, b: string) => (a === "/" ? "" : a) + "/" + b;
  for (const f of files) {
    const r = walk(absPath(state, f), f);
    if (r !== "done") return r;
  }
  return found ? ok(out) : { stdout: out, stderr: "", exitCode: 1 };
}

export function cmdFind(state: ShellState, argv: string[]): ShellResult {
  let rootInput = ".";
  let namePattern: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-name") {
      namePattern = argv[i + 1] ?? null;
      i++;
    } else if (!argv[i].startsWith("-")) {
      rootInput = argv[i];
    } else {
      return err(`find: unsupported option '${argv[i]}'`);
    }
  }
  const root = absPath(state, rootInput);
  const node = state.nodes.get(root);
  if (!node) return err(`find: '${rootInput}': No such file or directory`);
  const matcher = namePattern ? globToRegex(namePattern) : null;
  const hits: string[] = [];
  const walk = (path: string) => {
    if (matcher ? matcher.test(path.split("/").pop() ?? "") : true) hits.push(path);
    const n = state.nodes.get(path);
    if (n && isDir(n)) for (const e of listDir(state, path)) walk((path === "/" ? "" : path) + "/" + e.name);
  };
  walk(root);
  return ok(hits.join("\n") + (hits.length ? "\n" : ""));
}
