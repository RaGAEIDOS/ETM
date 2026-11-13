import { NextRequest, NextResponse } from "next/server";

const LOCALE_COOKIE = "NEXT_LOCALE";

function withLocaleCookie(response: NextResponse, locale: "ar" | "en") {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // `/en/...` is the only prefixed locale. Leave it untouched.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return withLocaleCookie(NextResponse.next(), "en");
  }

  // Arabic is the default and uses unprefixed URLs. `/ar/...` is not a
  // canonical URL shape, so send it to the legacy unprefixed path.
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ar(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // Existing URLs keep working as Arabic, without a visible locale prefix.
  const url = request.nextUrl.clone();
  url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return withLocaleCookie(NextResponse.rewrite(url), "ar");
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|og.svg|brand/|5fa9c0682e40e6b7aaf2.txt|sitemap.xml|robots.txt).*)",
  ],
};
