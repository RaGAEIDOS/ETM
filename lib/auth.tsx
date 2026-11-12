"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadProgressFile, PROGRESS_CHANGE_EVENT } from "./progress/store";

export interface AuthUser {
  id: string;
  login: string;
  name: string;
  email: string | null;
  avatarUrl: string;
  provider: "github";
}

interface AuthCtx {
  user: AuthUser | null;
  ready: boolean;
  online: boolean;
  lastSync: string | null;
  cloudEnabled: boolean;
  signInWithGithub: (token: string) => Promise<{ error?: AuthErrorCode }>;
  signOut: () => void;
  syncNow: () => void;
}

const SESSION_KEY = "etm-auth-session-v1";
const LASTSYNC_PREFIX = "etm-lastsync-";
export const AUTH_CHANGE_EVENT = "etm-auth-change";

export type AuthErrorCode =
  | "invalidToken"
  | "githubUnavailable"
  | "networkError"
  | "genericError";

const Ctx = createContext<AuthCtx | null>(null);

async function verifyWithGithubClient(token: string): Promise<AuthUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "ETM-Miku",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (res.status === 401) {
    throw new Error("This GitHub token is invalid or expired.");
  }
  if (!res.ok) {
    throw new Error(`GitHub error (${res.status}). Please try again.`);
  }
  const gh = await res.json();
  return {
    id: String(gh.id),
    login: gh.login,
    name: gh.name || gh.login,
    email: gh.email || null,
    avatarUrl: gh.avatar_url || "",
    provider: "github",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const applyUser = useCallback((u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      const syncTs = new Date().toISOString();
      localStorage.setItem(LASTSYNC_PREFIX + u.id, syncTs);
      setLastSync(syncTs);
      // One-time migration of any guest/per-user legacy progress into the
      // unified v2 store; new events are device-local today (no backend).
      loadProgressFile();
    } catch {}
    try {
      window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
    } catch {}
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.user) {
          const u = data.user as AuthUser;
          setUser(u);
          try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(u));
            const v = localStorage.getItem(LASTSYNC_PREFIX + u.id);
            if (v) setLastSync(v);
          } catch {}
        }
      } catch {}
      if (!cancelled) setReady(true);
    })();

    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      cancelled = true;
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const signInWithGithub = useCallback(
    async (token: string): Promise<{ error?: AuthErrorCode }> => {
      // 1) Preferred: the server verifies the token and sets a secure cookie.
      //    On any failure we fall through to client-side verification as a
      //    backup and report a generic code there.
      try {
        const res = await fetch("/api/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.user) {
          applyUser(data.user as AuthUser);
          return {};
        }
        // fall through to the client-side fallback below
      } catch {
        // fall through to the client-side fallback below
      }

      // 2) Fallback: verify directly from the browser (works on static hosts
      //    and when the server has no internet access to GitHub).
      try {
        const u = await verifyWithGithubClient(token);
        applyUser(u);
        return {};
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("invalid or expired")) return { error: "invalidToken" };
        return { error: "networkError" };
      }
    },
    [applyUser]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setLastSync(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  const syncNow = useCallback(() => {
    if (!user) return;
    const now = new Date().toISOString();
    setLastSync(now);
    try {
      localStorage.setItem(LASTSYNC_PREFIX + user.id, now);
      // Ensure the v2 store exists/loads; with no backend configured the
      // merge surface is this device. Dispatching refreshes open dashboards.
      loadProgressFile();
      window.dispatchEvent(new Event(PROGRESS_CHANGE_EVENT));
    } catch {}
  }, [user]);

  return (
    <Ctx.Provider
      value={{
        user,
        ready,
        online,
        lastSync,
        signInWithGithub,
        signOut,
        syncNow,
        cloudEnabled: false,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
