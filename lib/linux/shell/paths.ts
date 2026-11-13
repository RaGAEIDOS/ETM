/** Path utilities for the simulated shell. Always POSIX ("/") and LTR. */

export function normalizePath(cwd: string, input: string): string {
  let p = input.trim();
  if (p === "~" || p.startsWith("~/")) p = "/home/learner" + p.slice(1);
  if (!p.startsWith("/")) p = (cwd === "/" ? "" : cwd) + "/" + p;
  const out: string[] = [];
  for (const part of p.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      out.pop();
      continue;
    }
    out.push(part);
  }
  return "/" + out.join("/");
}

export function baseName(path: string): string {
  const p = path.replace(/\/+$/, "");
  const i = p.lastIndexOf("/");
  return i === -1 ? p : p.slice(i + 1);
}

export function parentPath(path: string): string {
  const p = path.replace(/\/+$/, "");
  const i = p.lastIndexOf("/");
  if (i <= 0) return "/";
  return p.slice(0, i);
}

export function joinPath(dir: string, name: string): string {
  return (dir === "/" ? "" : dir) + "/" + name;
}
