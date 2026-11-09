import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  metadataBase: new URL("https://etm-learning.vercel.app"),
  title: {
    default: "ETM | تعلّم البرمجة من الصفر إلى الاحتراف بلغة C++",
    template: "%s | ETM",
  },
  description:
    "منصة ETM العربية لتعلّم البرمجة بلغة C++ من الصفر إلى منتهى الصعوبة: منهج كامل مبني على OSSU، أمثلة تفاعلية، ملعب C++، قاموس مصطلحات، ومشاريع حقيقية — من أول برنامج حتى بناء نظام تشغيل ومحرك ألعاب.",
  keywords: [
    "تعلم البرمجة",
    "تعلم C++",
    "منهج برمجة عربي",
    "OSSU",
    "برمجة من الصفر",
    "محرك ألعاب",
    "نظام تشغيل",
    "ETM",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ETM | تعلّم البرمجة من الصفر إلى الاحتراف بلغة C++",
    description:
      "منصة عربية مجانية لتعلّم لغة C++ من الصفر إلى منتهى الصعوبة — منهج OSSU كامل، أمثلة تفاعلية، ملعب C++، ومشاريع حقيقية.",
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
    <html lang="ar" dir="rtl">
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
        <AuthProvider>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
