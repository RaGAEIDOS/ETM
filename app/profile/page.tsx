import type { Metadata } from "next";
import Link from "next/link";
import { stages, totalLessons } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";

export const metadata: Metadata = {
  title: "الملف الشخصي",
  description:
    "ملفك في ETM: حسابك، آخر مزامنة، وروابط لتقدّمك وفيديوهات الزيرو.",
};

export default function ProfilePage() {
  // يقرأ بيانات المستخدم من localStorage في العميل — الصفحة نفسها Static
  return (
    <ProfileClient />
  );
}

import ProfileClient from "@/components/ProfileClient";
