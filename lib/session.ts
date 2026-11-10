import crypto from "crypto";

export interface SessionUser {
  id: string;
  login: string;
  name: string;
  email: string | null;
  avatarUrl: string;
  provider: "github";
}

const SECRET = process.env.AUTH_SECRET || "etm-miku-dev-secret-change-me";
export const SESSION_COOKIE = "etm_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function signSession(user: SessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({ ...user, iat: Date.now() })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data || typeof data.id !== "string" || typeof data.login !== "string") return null;
    return {
      id: data.id,
      login: data.login,
      name: typeof data.name === "string" ? data.name : data.login,
      email: typeof data.email === "string" ? data.email : null,
      avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : "",
      provider: "github",
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}
