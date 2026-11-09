"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LogIn, Github, Chrome, Mail, Lock } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/progress";
  const { signIn, signInSocial } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await signIn(email, password);
    setLoading(false);
    if (r.error) setError(r.error);
    else router.push(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <LogIn className="h-6 w-6 text-cyan-400" />
          تسجيل الدخول
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-6">
          تقدّمك هيتزامن تلقائيًا على آخر نقطة وصلت لها — محليًا الآن، وسحابيًا
          بمجرد إضافة مفاتيح Supabase.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm text-slate-300 mb-1.5">
              <Mail className="h-4 w-4" /> البريد
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              placeholder="you@example.com"
              dir="ltr"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm text-slate-300 mb-1.5">
              <Lock className="h-4 w-4" /> كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 py-3 font-bold text-ink-950 disabled:opacity-50"
          >
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" /> أو <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={async () => {
              const r = await signInSocial("google");
              if (!r.error) router.push(next);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            <Chrome className="h-4 w-4" /> Google
          </button>
          <button
            onClick={async () => {
              const r = await signInSocial("github");
              if (!r.error) router.push(next);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            <Github className="h-4 w-4" /> GitHub
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          معندكش حساب؟{" "}
          <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-cyan-400 font-bold hover:text-cyan-300">
            أنشئ حسابًا
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">جارٍ التحميل...</div>}>
      <LoginInner />
    </Suspense>
  );
}
