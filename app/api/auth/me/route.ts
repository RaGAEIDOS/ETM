import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const user = verifySession(token);
  return NextResponse.json({ user });
}
