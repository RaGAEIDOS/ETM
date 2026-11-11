"use client";

import Link from "@/lib/i18n/navigation";
import { useLocaleRouter } from "@/lib/i18n/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { totalLessons } from "@/lib/data";
import { loadProgress } from "@/lib/progress";
import {
  Cloud,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Wifi,
  WifiOff,
  Github,
  LayoutDashboard,
} from "lucide-react";

const COPY = {
  ar: {
    loading: "جارٍ التحميل...",
    signedIn: "تم تسجيل الدخول عبر GitHub",
    signOut: "تسجيل الخروج",
    lessonsCompleted: "الدروس المكتملة",
    videosWatched: (n: number) => `${formatNumber(n)} فيديو من ElZero تمت مشاهدته`,
    sync: "المزامنة",
    onThisDevice: "على هذا الجهاز",
    lastSync: "آخر مزامنة:",
    syncNow: "زامن الآن",
    justNow: "الآن",
    connection: "الاتصال",
    online: "متصل — جاهز للمزامنة",
    offline: "غير متصل — سيلي ذلك المزامنة لاحقاً",
    connectionNote: "يُحفظ تقدمك تلقائياً أثناء تعلمك.",
    openDashboard: "افتح لوحة التحكم",
    elzeroVideos: "فيديوهات ElZero",
    footnote:
      "تقدمك محفوظ على هذا الجهاز. تسجيل الدخول بـ GitHub يحافظ على صورة حسابك وهويتك متزامنة — مزامنة سحابية بين الأجهزة قريباً.",
  },
  en: {
    loading: "Loading...",
    signedIn: "Signed in with GitHub",
    signOut: "Sign out",
    lessonsCompleted: "Lessons completed",
    videosWatched: (n: number) => `${formatNumber(n)} ElZero videos watched`,
    sync: "Sync",
    onThisDevice: "On this device",
    lastSync: "Last sync:",
    syncNow: "Sync now",
    justNow: "just now",
    connection: "Connection",
    online: "Online — ready to sync",
    offline: "Offline — will sync later",
    connectionNote: "Progress is saved automatically as you learn.",
    openDashboard: "Open dashboard",
    elzeroVideos: "ElZero videos",
    footnote:
      "Your progress is stored on this device. Signing in with GitHub keeps your profile picture and identity in sync — cloud sync across devices is coming soon.",
  },
} as const;

export default function ProfileClient() {
  const { user, ready, signOut, syncNow, lastSync, online } = useAuth();
  const locale = useLocale();
  const c = useCopy(COPY);
  const router = useLocaleRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/profile");
  }, [ready, user, router]);

  if (!ready)
    return <div className="p-10 text-center text-slate-400">{c.loading}</div>;
  if (!user) return null;

  const map = loadProgress();
  const done = Object.keys(map).filter((k) => !k.startsWith("elzero-")).length;
  const videos = Object.keys(map).filter((k) => k.startsWith("elzero-")).length;
  const total = totalLessons();
  const localeTag = locale === "en" ? "en-GB" : "ar-EG-u-nu-latn";
  const lastSyncStr = lastSync
    ? new Date(lastSync).toLocaleString(localeTag, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : c.justNow;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-14 w-14 rounded-2xl object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 text-2xl font-black">
                {user.name[0] || "?"}
              </span>
            )}
            <div>
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <p className="text-sm text-slate-400" dir="ltr">
                @{user.login}
                {user.email ? ` · ${user.email}` : ""}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Github className="h-3 w-3" />
                {c.signedIn}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            {c.signOut}
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400">{c.lessonsCompleted}</div>
            <div className="mt-1 text-2xl font-black text-white">
              {formatNumber(done)}{" "}
              <span className="text-sm text-slate-500">/ {formatNumber(total)}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-cyan-400 to-violet-500"
                style={{
                  width: `${total ? Math.round((done / total) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {c.videosWatched(videos)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Cloud className="h-3 w-3" /> {c.sync}
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {c.onThisDevice}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {c.lastSync} {lastSyncStr}
            </div>
            <button
              onClick={syncNow}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <RefreshCw className="h-3 w-3" />
              {c.syncNow}
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              {online ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {c.connection}
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {online ? c.online : c.offline}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {c.connectionNote}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950"
          >
            <LayoutDashboard className="h-4 w-4" />
            {c.openDashboard}
          </Link>
          <Link
            href="/elzero"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            <CheckCircle2 className="h-4 w-4" />
            {c.elzeroVideos}
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500 leading-6">{c.footnote}</p>
      </div>
    </div>
  );
}
