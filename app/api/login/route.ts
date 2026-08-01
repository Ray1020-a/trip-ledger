import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, buildToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = String(body?.password ?? "");
  const expected = process.env.LOGIN_PASSWORD ?? "";

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, buildToken(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true });
}
