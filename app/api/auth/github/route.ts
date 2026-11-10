import { NextResponse } from "next/server";
import { signSession, sessionCookieOptions, type SessionUser } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ error: "Please paste your GitHub token." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "ETM-Miku",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return NextResponse.json(
        { error: "This GitHub token is invalid or expired." },
        { status: 401 }
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not verify with GitHub (status ${res.status}). Try again.` },
        { status: 502 }
      );
    }

    const gh = await res.json();
    const user: SessionUser = {
      id: String(gh.id),
      login: gh.login,
      name: gh.name || gh.login,
      email: gh.email || null,
      avatarUrl: gh.avatar_url || "",
      provider: "github",
    };

    const session = signSession(user);
    const response = NextResponse.json({ user });
    response.cookies.set("etm_session", session, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { error: "Could not reach GitHub. Check your internet connection." },
      { status: 502 }
    );
  }
}
