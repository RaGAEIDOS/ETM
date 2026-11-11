import type { Metadata, Viewport } from "next";
import "./globals.css";

// The real document (<html>, <body>, providers) lives in
// app/[locale]/layout.tsx. The root layout is a passthrough so that
// app/not-found.tsx can render a full document for unmatched URLs, as required
// by the Next.js App Router.
export const metadata: Metadata = {
  metadataBase: new URL("https://etm-learning.vercel.app"),
  title: "ETM — Education Technology Miku",
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
  return children;
}
