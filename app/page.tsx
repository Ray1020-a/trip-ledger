import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthed()) {
    redirect("/overview");
  }

  return <LoginForm />;
}
