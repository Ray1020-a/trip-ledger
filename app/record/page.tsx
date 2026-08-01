import { requireAuth } from "@/lib/auth";
import RecordSetupForm from "./setup-form";

export const dynamic = "force-dynamic";

export default async function RecordPage() {
  await requireAuth();

  const types = (process.env.LEDGER_TYPES ?? "住宿,餐飲,交通,門票,其他")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return <RecordSetupForm types={types} />;
}
