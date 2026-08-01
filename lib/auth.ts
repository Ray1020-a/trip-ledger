import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE = "tl_auth";

export function buildToken(password: string): string {
  return createHash("sha256").update(`trip-ledger:${password}`).digest("hex");
}

export function expectedToken(): string {
  return buildToken(process.env.LOGIN_PASSWORD ?? "");
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(AUTH_COOKIE)?.value;
  if (!value) return false;

  const expected = expectedToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    redirect("/");
  }
}
