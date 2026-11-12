/** Minimal shell parser: quoting, escapes, pipes, > and >>, $VAR expansion. */

export interface PipelineStage {
  argv: string[];
  /** Per-argument: true when the token was quoted or escaped (skip glob). */
  argQuoted: boolean[];
  /** File to redirect stdout to, when > or >> was used. */
  redirectTo?: string;
  redirectMode?: ">" | ">>";
}

export interface ParseSuccess {
  ok: true;
  stages: PipelineStage[];
}
export interface ParseFailure {
  ok: false;
  error: string;
}

function expandVars(text: string, env: Record<string, string>): string {
  return text
    .replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, name) => env[name] ?? "")
    .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => env[name] ?? "")
    .replace(/\$\?/g, "0");
}

export function parseInput(input: string, env: Record<string, string>): ParseSuccess | ParseFailure {
  const stages: PipelineStage[] = [];
  let argv: string[] = [];
  let argQuoted: boolean[] = [];
  let cur = "";
  let tokenStarted = false;
  let curQuoted = false;
  let redirectTo: string | undefined;
  let redirectMode: ">" | ">>" | undefined;
  let inSingle = false;
  let inDouble = false;
  let pendingRedirect = false;

  const flushToken = () => {
    if (tokenStarted) {
      argv.push(cur);
      argQuoted.push(curQuoted);
    }
    cur = "";
    tokenStarted = false;
    curQuoted = false;
  };
  const flushStage = (): string | null => {
    flushToken();
    if (pendingRedirect) return "redirect بدون ملف هدف";
    if (argv.length === 0 && !redirectTo) return "أمر فارغ";
    stages.push({ argv, argQuoted, redirectTo, redirectMode });
    argv = [];
    argQuoted = [];
    cur = "";
    tokenStarted = false;
    curQuoted = false;
    redirectTo = undefined;
    redirectMode = undefined;
    return null;
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (pendingRedirect) {
      // target file name for > / >> (consume next non-space word, quotes respected)
      if (/\s/.test(ch)) continue;
      let target = "";
      while (i < input.length && !/\s|\||>/.test(input[i])) {
        target += input[i];
        i++;
      }
      i--; // loop will advance
      if (!target) return { ok: false, error: "redirect بدون ملف هدف" };
      redirectTo = target;
      pendingRedirect = false;
      tokenStarted = false;
      continue;
    }

    if (inSingle) {
      if (ch === "'") inSingle = false;
      else cur += ch;
      tokenStarted = true;
      curQuoted = true;
      continue;
    }
    if (ch === "\\" && !inSingle) {
      if (i + 1 < input.length) {
        cur += input[i + 1];
        i++;
      }
      tokenStarted = true;
      curQuoted = true;
      continue;
    }
    if (inDouble) {
      if (ch === '"') inDouble = false;
      else if (ch === "$") {
        const rest = input.slice(i);
        const m = rest.match(/^\$(\{[A-Za-z_][A-Za-z0-9_]*\}|[A-Za-z_][A-Za-z0-9_]*|\?)/);
        if (m) {
          cur += expandVars(m[0], env);
          i += m[0].length - 1;
        } else cur += "$";
      } else cur += ch;
      tokenStarted = true;
      curQuoted = true;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      tokenStarted = true;
      curQuoted = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      tokenStarted = true;
      curQuoted = true;
      continue;
    }
    if (/\s/.test(ch)) {
      flushToken();
      continue;
    }
    if (ch === "|") {
      const err = flushStage();
      if (err) return { ok: false, error: err };
      continue;
    }
    if (ch === ">") {
      if (input[i + 1] === ">") {
        redirectMode = ">>";
        i++;
      } else {
        redirectMode = ">";
      }
      flushToken();
      pendingRedirect = true;
      continue;
    }
    if (ch === "$") {
      const rest = input.slice(i);
      const m = rest.match(/^\$(\{[A-Za-z_][A-Za-z0-9_]*\}|[A-Za-z_][A-Za-z0-9_]*|\?)/);
      if (m) {
        cur += expandVars(m[0], env);
        i += m[0].length - 1;
        tokenStarted = true;
        continue;
      }
    }
    cur += ch;
    tokenStarted = true;
  }

  if (inSingle || inDouble) return { ok: false, error: "اقتباس غير مغلق — راجع علامات الاقتباس" };
  const err = flushStage();
  if (err) return { ok: false, error: err };
  return { ok: true, stages };
}
