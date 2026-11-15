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
import { MaryamProvider } from "@/components/Maryam";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Pomodoro from "@/components/Pomodoro";
import AdBanners from "@/components/AdBanners";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme";
import { LOGO_ASSETS } from "@/lib/logo-assets";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = "https://etm-learning.vercel.app";
const OG_IMAGE = new URL(LOGO_ASSETS.og.src, SITE_URL).toString();
const LOGO_ALT = "ETM — Education Technology Maryam";
const FAVICON_LINKS = LOGO_ASSETS.favicons.icon.map(({ src, sizes, type }) => ({
  url: src,
  sizes,
  type,
}));

const META = {
  ar: {
    title: "ETM — تعلّم C++ من الصفر إلى الاحتراف",
    description:
      "ETM (Education Technology Maryam) منصة عربية مجانية لتعلم C++ من الصفر المطلق حتى بناء نظام تشغيل ومحرك ألعاب. منهج OSSU كامل، محرر تفاعلي، مشاريع حقيقية، ومريم — رفيقة رحلتك في الذكاء الاصطناعي والبرمجة.",
    keywords: [
      "تعلم البرمجة",
      "تعلم C++",
      "شرح C++",
      "OSSU",
      "البرمجة من الصفر",
      "محرك ألعاب",
      "نظام تشغيل",
      "ETM",
      "مريم",
    ],
    ogLocale: "ar_EG",
  },
  en: {
    title: "ETM — Learn C++ from Zero to Expert",
    description:
      "ETM (Education Technology Maryam) is a free platform for learning C++ from absolute zero to building an operating system and a game engine. A complete OSSU-based curriculum, interactive playground, projects, and Maryam — your AI engineering companion.",
    keywords: [
      "learn programming",
      "learn C++",
      "C++ tutorial",
      "OSSU",
      "programming from scratch",
      "game engine",
      "operating system",
      "ETM",
      "Maryam",
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
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: "%s | ETM",
    },
    description: meta.description,
    keywords: [...meta.keywords],
    other: {
      // HilltopAds site-verification tag (method 2 in their dashboard).
      "5fa9c0682e40e6b7aaf2": "f3712d7d0b315823ea65",
    },
    icons: {
      icon: FAVICON_LINKS,
      shortcut: LOGO_ASSETS.favicons.shortcut,
      apple: LOGO_ASSETS.favicons.apple,
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: meta.ogLocale,
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [
        {
          url: OG_IMAGE,
          width: LOGO_ASSETS.og.width,
          height: LOGO_ASSETS.og.height,
          alt: LOGO_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [OG_IMAGE],
    },
  };
}

export const viewport: Viewport = {
  themeColor: THEME_COLORS.dark.page,
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
        {/* Apply the saved/initial site theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
          <MaryamProvider>
            <AuthProvider>
              <SiteHeader />
              <main className="min-h-screen">{children}</main>
              <SiteFooter />
              <Pomodoro />
              <AdBanners />
            </AuthProvider>
          </MaryamProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
