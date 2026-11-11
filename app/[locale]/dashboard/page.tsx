import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track your learning progress: lessons completed, ElZero videos watched, focus time, streaks, and what is left in the curriculum.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
