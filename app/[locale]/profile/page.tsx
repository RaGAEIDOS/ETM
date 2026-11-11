import type { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Your ETM profile: your account, last sync, and links to your progress and ElZero videos.",
};

export default function ProfilePage() {
  // Reads user data from localStorage on the client — this page itself is static
  return <ProfileClient />;
}
