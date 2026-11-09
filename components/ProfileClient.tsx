"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { totalLessons } from "@/lib/data";
import { loadProgress } from "@/lib/progress";
import { Cloud, RefreshCw, LogOut, CheckCircle2, Wifi, WifiOff } from "lucide-react";

export default function ProfileClient() {
  const { user, ready, signOut, syncNow, lastSync, online, cloudEnabled } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/profile");
  }, [ready, user, router]);

  if (!ready) return <div className="p-10 text-center text-slate-400">جارٍ التحميل...</div>;
  if (!user) return null;

  const map = loadProgress();
  const done = Object.keys(map).length;
  const total = totalLessons();
  const lastSyncStr = lastSync
    ? new Date(lastSync).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })
    : "الآن";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 text-2xl font-black">
              {user.name[0] || "؟"}
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <p className="text-sm text-slate-400" dir="ltr">
                {user.email}
              </p>
              <p className="text-xs text-slate-500">
                نوع الحساب: {user.provider === "email" ? "بريد" : user.provider} · عضو منذ{" "}
                {new Date(user.createdAt).toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400">دروس مكتملة</div>
            <div className="mt-1 text-2xl font-black text-white">
              {done} <span className="text-sm text-slate-500">/ {total}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-cyan-400 to-violet-500"
                style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Cloud className="h-3 w-3" /> المزامنة
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {cloudEnabled ? "سحابة متصلة (Supabase)" : "محلي — الربط قادم"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              آخر مزامنة: {lastSyncStr}
            </div>
            <button
              onClick={syncNow}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <RefreshCw className="h-3 w-3" />
              مزامنة الآن
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              الاتصال
            </div>
            <div className="mt-1 text-sm font-bold text-white">
              {online ? "أونلاين — جاهز للمزامنة" : "أوفلاين — سيتم التزامن عند عودته"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              التزامن تلقائي عند كل تقدم جديد
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/progress"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950"
          >
            <CheckCircle2 className="h-4 w-4" />
            شاهد تقدمك
          </Link>
          <Link
            href="/elzero"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            فيديوهات الزيرو
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500 leading-6">
          ملحوظة: المزامنة السحابية الحقيقية بين أجهزة مختلفة تحتاج مفاتيح
          Supabase (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY)
          على Vercel. الهيكل جاهز للربط — لحد ما تضيفها، البيانات محفوظة
          ومزامنة في جهازك تلقائيًا.
        </p>
      </div>
    </div>
  );
}
