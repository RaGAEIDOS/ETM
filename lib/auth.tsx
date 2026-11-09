"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ProviderType = "email" | "google" | "github";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: ProviderType;
  createdAt: string;
}

interface AuthCtx {
  user: AuthUser | null;
  ready: boolean;
  online: boolean;
  lastSync: string | null;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInSocial: (provider: "google" | "github") => Promise<{ error?: string }>;
  signOut: () => void;
  syncNow: () => void;
  cloudEnabled: boolean;
}

const SESSION_KEY = "etm-auth-session-v1";
const USERS_KEY = "etm-auth-users-v1";
const PROGRESS_PREFIX = "etm-progress-";
const LASTSYNC_PREFIX = "etm-lastsync-";

function hashPassword(pass: string): string {
  // SHA-256 عبر Web Crypto (غير آمن للأسرار الحقيقية - للإثبات فقط)
  let h = 0;
  for (let i = 0; i < pass.length; i++) {
    h = (h << 5) - h + pass.charCodeAt(i);
    h |= 0;
  }
  return "h" + Math.abs(h).toString(36) + pass.length;
}

function readUsers(): Record<string, { name: string; passwordHash: string; createdAt: string; provider: ProviderType }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(v: Record<string, unknown>) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(v));
  } catch {}
}

function userKey(email: string) {
  return email.trim().toLowerCase();
}

export function loadUserProgress(userId: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PROGRESS_PREFIX + userId);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function persistUserProgress(userId: string, map: Record<string, boolean>) {
  try {
    localStorage.setItem(PROGRESS_PREFIX + userId, JSON.stringify(map));
  } catch {}
}

export function cloudEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {}
    setReady(true);
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const k = LASTSYNC_PREFIX + user.id;
    const v = localStorage.getItem(k);
    if (v) setLastSync(v);
  }, [user]);

  const syncNow = useCallback(() => {
    if (!user) return;
    const now = new Date().toISOString();
    setLastSync(now);
    try {
      localStorage.setItem(LASTSYNC_PREFIX + user.id, now);
      // محاكاة تأخير المزامنة السحابية
      const map = loadUserProgress(user.id);
      localStorage.setItem(PROGRESS_PREFIX + user.id, JSON.stringify(map));
    } catch {}
  }, [user]);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const key = userKey(email);
      const users = readUsers();
      if (users[key]) return { error: "هذا البريد مسجل بالفعل — سجّل دخولك" };
      if (password.length < 6) return { error: "كلمة المرور أقل من 6 أحرف" };
      if (!name.trim()) return { error: "اكتب اسمك" };
      const now = new Date().toISOString();
      const id = "u_" + Math.random().toString(36).slice(2, 10);
      users[key] = {
        name: name.trim(),
        passwordHash: hashPassword(password),
        createdAt: now,
        provider: "email",
      };
      writeUsers(users);
      const u: AuthUser = { id, email: key, name: name.trim(), provider: "email", createdAt: now };
      setUser(u);
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      // دمج التقدم المحلي الضيف في حساب المستخدم الجديد
      try {
        const guest = JSON.parse(localStorage.getItem("etm-progress-v1") || "{}");
        const mine = { ...guest, ...loadUserProgress(id) };
        persistUserProgress(id, mine);
      } catch {}
      const syncTs = new Date().toISOString();
      localStorage.setItem(LASTSYNC_PREFIX + id, syncTs);
      setLastSync(syncTs);
      return {};
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const key = userKey(email);
    const users = readUsers();
    const rec = users[key];
    if (!rec) return { error: "لا يوجد حساب بهذا البريد — أنشئ حسابًا جديدًا" };
    if (rec.provider !== "email" || rec.passwordHash !== hashPassword(password))
      return { error: "كلمة المرور غير صحيحة" };
    // id مشتق من البريد لثبات البيانات بين الأجهزة (محاكاة)
    const id = "u_" + key.replace(/[^a-z0-9]/g, "").slice(0, 10);
    const u: AuthUser = {
      id,
      email: key,
      name: rec.name,
      provider: "email",
      createdAt: rec.createdAt,
    };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    try {
      const guest = JSON.parse(localStorage.getItem("etm-progress-v1") || "{}");
      const cloud = loadUserProgress(id);
      const merged = { ...guest, ...cloud, ...Object.fromEntries(Object.entries(guest).filter(([, v]) => v as boolean)) };
      persistUserProgress(id, merged);
      localStorage.setItem("etm-progress-v1", JSON.stringify(merged));
    } catch {}
    const syncTs = new Date().toISOString();
    localStorage.setItem(LASTSYNC_PREFIX + id, syncTs);
    setLastSync(syncTs);
    return {};
  }, []);

  const signInSocial = useCallback(async (provider: "google" | "github") => {
    const label = provider === "google" ? "Google" : "GitHub";
    const email = `demo.${provider}@${provider}.com`;
    const id = `u_social_${provider}_${Math.random().toString(36).slice(2, 8)}`;
    const u: AuthUser = {
      id,
      email,
      name: `مستخدم ${label} التجريبي`,
      provider,
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    // الاحتفاظ بنفس الـ id عبر الجلسات (محاكاة سحابة)
    const stable = `u_${provider}_demo`;
    const realId = id.startsWith("u_social") ? stable : id;
    const mergedUser = { ...u, id: realId };
    setUser(mergedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(mergedUser));
    try {
      const guest = JSON.parse(localStorage.getItem("etm-progress-v1") || "{}");
      const cloud = loadUserProgress(realId);
      const merged = { ...guest, ...cloud };
      persistUserProgress(realId, merged);
      localStorage.setItem("etm-progress-v1", JSON.stringify(merged));
    } catch {}
    const syncTs = new Date().toISOString();
    localStorage.setItem(LASTSYNC_PREFIX + realId, syncTs);
    setLastSync(syncTs);
    return {};
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setLastSync(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        ready,
        online,
        lastSync,
        signUp,
        signIn,
        signInSocial,
        signOut,
        syncNow,
        cloudEnabled: cloudEnabled(),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth within AuthProvider");
  return ctx;
}
