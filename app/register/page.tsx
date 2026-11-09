"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { UserPlus, User, Mail, Lock } from "lucide-react";

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/progress";
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await signUp(name, email, password);
    setLoading(false);
    if (r.error) setError(r.error);
    else router.push(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-cyan-400" />
          إنشاء حساب
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-6">
          حساب واحد يكفي عشان تقدّمك يتزامن على كل أجهزتك (لما تضيف مفاتيح
          Supabase) — ودلوقتي يتزامن في جهازك تلقائيًا.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm text-slate-300 mb-1.5">
              <User className="h-4 w-4" /> الاسم
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-cyan-500/50"
              placeholder="مثال: أحمد"
              required
            />
          </div>
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
              placeholder="6 أحرف على الأقل"
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
            {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          عندك حساب بالفعل؟{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-cyan-400 font-bold hover:text-cyan-300">
            سجّل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">جارٍ التحميل...</div>}>
      <RegisterInner />
    </Suspense>
  );
}
