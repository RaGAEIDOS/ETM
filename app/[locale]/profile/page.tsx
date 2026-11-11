import type { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "الملف الشخصي",
    metaDescription:
      "ملفك الشخصي في ETM: حسابك، آخر مزامنة، وروابط تقدمك وفيديوهات ElZero.",
  },
  en: {
    metaTitle: "Profile",
    metaDescription:
      "Your ETM profile: your account, last sync, and links to your progress and ElZero videos.",
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
    path: "/profile",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function ProfilePage() {
  // Reads user data from localStorage on the client — this page itself is static
  return <ProfileClient />;
}
