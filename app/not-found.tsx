import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-8xl font-black gradient-text" dir="ltr">404</div>
      <h1 className="mt-6 text-3xl font-black text-white">الصفحة مش موجودة</h1>
      <p className="mt-4 text-lg text-slate-400 leading-8">
        يبدو إنك حاولت تروح لصفحة مش موجودة. لا تقلق — المنهج كامل موجود
        ومستنيك.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition-colors"
        >
          <Home className="h-5 w-5" />
          الرئيسية
        </Link>
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
        >
          المنهج الكامل
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
