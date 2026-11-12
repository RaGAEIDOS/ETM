/** Shared glob matching for the simulated shell (used by find and argv globbing). */

export function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^$(){}\\|]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")
    .replace(/\[!/g, "[^");
  return new RegExp("^" + escaped + "$");
}

/** Expand ONE unquoted argv token against a name list. Returns matching names, or [token] when nothing matches. */
export function matchGlob(pattern: string, names: string[]): string[] | null {
  if (!/[*?\[]/.test(pattern)) return null;
  const re = globToRegex(pattern);
  const out = names.filter((n) => re.test(n)).sort();
  return out.length ? out : null;
}
