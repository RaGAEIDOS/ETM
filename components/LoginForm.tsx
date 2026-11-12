"use client";

import Link from "@/lib/i18n/navigation";
import { useLocaleRouter } from "@/lib/i18n/navigation";
import {
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import { useAuth, type AuthErrorCode } from "@/lib/auth";
import { useCopy, useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/config";
import {
  Github,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const TOKEN_URL =
  "https://github.com/settings/tokens/new?scopes=read:user&description=ETM%20Learning";

const ERROR_COPY: Record<Locale, Record<AuthErrorCode, string>> = {
  ar: {
    invalidToken: "رمز GitHub هذا غير صالح أو انتهت صلاحيته.",
    githubUnavailable:
      "تعذر الاتصال بـ GitHub من الخادم. حاول مرة أخرى بعد قليل.",
    networkError:
      "تعذر الوصول إلى GitHub من هذه الشبكة. حاول لاحقاً أو تحقق من اتصالك بالإنترنت.",
    genericError: "تعذر تسجيل الدخول. حاول مرة أخرى.",
  },
  en: {
    invalidToken: "This GitHub token is invalid or expired.",
    githubUnavailable:
      "Could not reach GitHub from our server. Please try again in a moment.",
    networkError:
      "Could not reach GitHub from this network. Try again later or check your connection.",
    genericError: "Sign in failed. Please try again.",
  },
};

const COPY = {
  ar: {
    title: "تسجيل الدخول باستخدام GitHub",
    subtitle: "حساب واحد. تقدمك في كل مكان.",
    howItWorks: "كيف يعمل",
    step1Open: "افتح",
    step1Link: "صفحة رمز GitHub",
    step1Note: "(تفتح في تبويب جديد).",
    step2: "اضغط Generate token ← ثم Generate token مرة أخرى.",
    step3: "انسخ الرمز والصقه بالأسفل.",
    tokenNote:
      "يُستخدم الرمز مرة واحدة للتحقق من هويتك وجلب صورة حسابك. لا يُخزّن أبداً على خوادمنا.",
    tokenLabel: "GitHub Personal Access Token",
    tokenPlaceholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
    hideToken: "إخفاء الرمز",
    showToken: "إظهار الرمز",
    verifying: "جارٍ التحقق من GitHub...",
    signIn: "تسجيل الدخول",
    continueGuest: "المتابعة كزائر",
    manageTokens: "إدارة الرموز",
    readOnly: "نطلب فقط صلاحية read:user — قراءة ملفك العام. لا شيء آخر.",
    loading: "جارٍ التحميل...",
  },
  en: {
    title: "Sign in with GitHub",
    subtitle: "One account. Your progress, everywhere.",
    howItWorks: "How it works",
    step1Open: "Open the",
    step1Link: "GitHub token page",
    step1Note: "(opens in a new tab).",
    step2: "Click Generate token → Generate token again.",
    step3: "Copy the token and paste it below.",
    tokenNote:
      "The token is used once to verify your identity and fetch your GitHub profile picture. It is never stored on our servers.",
    tokenLabel: "GitHub Personal Access Token",
    tokenPlaceholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
    hideToken: "Hide token",
    showToken: "Show token",
    verifying: "Verifying with GitHub...",
    signIn: "Sign in",
    continueGuest: "Continue as guest",
    manageTokens: "Manage tokens",
    readOnly: "We only request read:user — read access to your public profile. Nothing else.",
    loading: "Loading...",
  },
} as const;

export default function LoginForm() {
  const router = useLocaleRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const locale = useLocale();
  const c = useCopy(COPY);
  const { signInWithGithub } = useAuth();
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
            <h1 className="text-2xl font-black text-white">{c.title}</h1>
            <p className="text-sm text-slate-400">{c.subtitle}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 leading-6">
          <p className="font-bold text-white mb-2">{c.howItWorks}</p>
          <ol className="list-decimal pe-5 space-y-1.5">
            <li>
              {c.step1Open}{" "}
              <a
                href={TOKEN_URL}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline font-semibold"
              >
                {c.step1Link}
              </a>{" "}
              {c.step1Note}
            </li>
            <li>{c.step2}</li>
            <li>{c.step3}</li>
          </ol>
          <p className="mt-3 flex items-start gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
            {c.tokenNote}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm text-slate-300 mb-1.5">
              <KeyRound className="h-4 w-4" /> {c.tokenLabel}
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pe-12 text-white outline-none focus:border-cyan-500/50 font-mono text-sm"
                placeholder={c.tokenPlaceholder}
                dir="ltr"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
                aria-label={show ? c.hideToken : c.showToken}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {ERROR_COPY[locale][error]}
            </div>
          )}

          <button
            disabled={loading || !token.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 py-3 font-bold text-ink-950 disabled:opacity-50"
          >
            {loading ? c.verifying : c.signIn}
            {!loading && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            {c.continueGuest}
          </Link>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {c.manageTokens}
          </a>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500 leading-5">
        {c.readOnly}
      </p>
    </div>
  );
}
