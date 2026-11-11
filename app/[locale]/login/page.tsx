"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Github, KeyRound, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

const TOKEN_URL =
  "https://github.com/settings/tokens/new?scopes=read:user&description=ETM%20Learning";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { signInWithGithub } = useAuth();
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await signInWithGithub(token);
    setLoading(false);
    if (r.error) setError(r.error);
    else router.push(next);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950">
            <Github className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">Sign in with GitHub</h1>
            <p className="text-sm text-slate-400">One account. Your progress, everywhere.</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 leading-6">
          <p className="font-bold text-white mb-2">How it works</p>
          <ol className="list-decimal pe-5 space-y-1.5">
            <li>
              Open the{" "}
              <a
                href={TOKEN_URL}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-semibold"
              >
                GitHub token page
              </a>{" "}
              (opens in a new tab).
            </li>
            <li>
              Click <b>Generate token</b> → <b>Generate token</b> again.
            </li>
            <li>Copy the token and paste it below.</li>
          </ol>
          <p className="mt-3 flex items-start gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
            The token is used once to verify your identity and fetch your GitHub
            profile picture. It is never stored on our servers.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm text-slate-300 mb-1.5">
              <KeyRound className="h-4 w-4" /> GitHub Personal Access Token
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pe-12 text-white outline-none focus:border-cyan-500/50 font-mono text-sm"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                dir="ltr"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
                aria-label={show ? "Hide token" : "Show token"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <button
            disabled={loading || !token.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 py-3 font-bold text-ink-950 disabled:opacity-50"
          >
            {loading ? "Verifying with GitHub..." : "Sign in"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            Continue as guest
          </Link>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Manage tokens
          </a>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500 leading-5">
        We only request <code className="text-slate-300" dir="ltr">read:user</code> —
        read access to your public profile. Nothing else.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-slate-400">Loading...</div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
