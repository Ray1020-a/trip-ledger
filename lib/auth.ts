import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE = "tl_auth";

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.has(AUTH_COOKIE);
}

export async function requireAuth(): Promise<void> {
  const store = await cookies();
  if (!store.has(AUTH_COOKIE)) {
    redirect("/");
  }
}
