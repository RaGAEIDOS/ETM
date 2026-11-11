import { Home } from "lucide-react";

// This is the global 404 for URLs that do not match a locale segment at all
// (for example /unknown.txt). The root layout is a passthrough, so this file
// must render a complete document. Arabic is the default locale.
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-950 text-slate-300 font-sans antialiased">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="text-8xl font-black gradient-text" dir="ltr">
            404
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">
            الصفحة غير موجودة
          </h1>
          <p className="mt-4 text-lg text-slate-400 leading-8">
            يبدو أنك حاولت الوصول إلى صفحة غير موجودة. لا تقلق — المنهج كامل هنا
            في انتظارك.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
            >
              <Home className="h-5 w-5" />
              الرئيسية
            </a>
            <a
              href="/en"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
              lang="en"
              dir="ltr"
            >
              English
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
