import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AuthProvider } from "@/lib/auth";
import { MikuProvider } from "@/components/Miku";
import Pomodoro from "@/components/Pomodoro";

export const metadata: Metadata = {
  metadataBase: new URL("https://etm-learning.vercel.app"),
  title: {
    default: "ETM — Learn C++ from Zero to Expert",
    template: "%s | ETM",
  },
  description:
    "ETM (Education Technology Miku) is a free Arabic platform for learning C++ from absolute zero to building an operating system and a game engine. A complete OSSU-based curriculum, interactive playground, projects, and an AI study buddy.",
  keywords: [
    "learn programming",
    "learn C++",
    "C++ tutorial",
    "OSSU",
    "programming from scratch",
    "game engine",
    "operating system",
    "ETM",
    "Miku",
    "C++ mastery",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ETM — Education Technology Miku | Learn C++ from Zero to Expert",
    description:
      "A free Arabic platform for learning C++ from zero to building an operating system and a game engine — full OSSU curriculum, interactive playground, real projects, and Miku as your study buddy.",
    type: "website",
    locale: "ar_EG",
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <MikuProvider>
          <AuthProvider>
            <SiteHeader />
            <main className="min-h-screen">{children}</main>
            <SiteFooter />
            <Pomodoro />
          </AuthProvider>
        </MikuProvider>
      </body>
    </html>
  );
}
