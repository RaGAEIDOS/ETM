import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/lib/i18n/context";
import {
  dirFor,
  htmlLangFor,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { AuthProvider } from "@/lib/auth";
import { MikuProvider } from "@/components/Miku";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Pomodoro from "@/components/Pomodoro";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const META = {
  ar: {
    title: "ETM — تعلّم C++ من الصفر إلى الاحتراف",
    description:
      "ETM (Education Technology Miku) منصة عربية مجانية لتعلم C++ من الصفر المطلق حتى بناء نظام تشغيل ومحرك ألعاب. منهج OSSU كامل، محرر تفاعلي، مشاريع حقيقية، ورفيقة الدراسة Miku.",
    keywords: [
      "تعلم البرمجة",
      "تعلم C++",
      "شرح C++",
      "OSSU",
      "البرمجة من الصفر",
      "محرك ألعاب",
      "نظام تشغيل",
      "ETM",
      "Miku",
    ],
    ogLocale: "ar_EG",
  },
  en: {
    title: "ETM — Learn C++ from Zero to Expert",
    description:
      "ETM (Education Technology Miku) is a free platform for learning C++ from absolute zero to building an operating system and a game engine. A complete OSSU-based curriculum, interactive playground, projects, and Miku your study buddy.",
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
    ],
    ogLocale: "en_US",
  },
} as const;

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const locale: Locale = params.locale === "en" ? "en" : "ar";
  const meta = META[locale];
  return {
    metadataBase: new URL("https://etm-learning.vercel.app"),
    title: {
      default: meta.title,
      template: "%s | ETM",
    },
    description: meta.description,
    keywords: [...meta.keywords],
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [{ url: "/og.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.svg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;

  return (
    <html lang={htmlLangFor(locale)} dir={dirFor(locale)} suppressHydrationWarning>
      <head>
        {/* Apply the saved site theme before first paint (no flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('etm-theme-v1');if(t==='miku'||t==='bootcamp'||t==='codecademy'){document.documentElement.dataset.theme=t;}}catch(e){}})();",
          }}
        />
      </head>
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <LocaleProvider locale={locale}>
          <MikuProvider>
            <AuthProvider>
              <SiteHeader />
              <main className="min-h-screen">{children}</main>
              <SiteFooter />
              <Pomodoro />
            </AuthProvider>
          </MikuProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
