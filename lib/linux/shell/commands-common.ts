/** Small helpers shared by the simulated command set. */

import type { ShellResult } from "./types.ts";

export const ok = (stdout = ""): ShellResult => ({ stdout, stderr: "", exitCode: 0 });

export const err = (stderr: string, exitCode = 1): ShellResult => ({ stdout: "", stderr: stderr.endsWith("\n") ? stderr : stderr + "\n", exitCode });

/** Split argv into (flags, positional) using a set of known single-letter flags. */
export function flagsOf(argv: string[], known: string[]): { flags: Set<string>; rest: string[] } {
  const flags = new Set<string>();
  const rest: string[] = [];
  for (const arg of argv) {
    if (arg.startsWith("-") && arg.length > 1) {
      const letters = arg.slice(1).split("");
      let consumed = true;
      for (const l of letters) {
        if (!known.includes(l)) {
          consumed = false;
          break;
        }
      }
      if (consumed) {
        for (const l of letters) flags.add(l);
        continue;
      }
    }
    rest.push(arg);
  }
  return { flags, rest };
}
