import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "تسجيل الدخول",
    metaDescription:
      "سجّل الدخول بـ GitHub لحفظ تقدمك في ETM على هذا الجهاز ومزامنته مع حسابك.",
    loading: "جارٍ التحميل...",
  },
  en: {
    metaTitle: "Sign in",
    metaDescription:
      "Sign in with GitHub to save your ETM progress on this device and sync it with your account.",
    loading: "Loading...",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  return pageMetadata({
    locale,
    path: "/login",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-slate-400">
          {COPY[locale].loading}
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
