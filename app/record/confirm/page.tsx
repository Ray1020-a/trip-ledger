import { requireAuth } from "@/lib/auth";
import ConfirmForm from "./confirm-form";

export const dynamic = "force-dynamic";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAuth();

  const sp = await searchParams;
  const read = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : "");

  return (
    <ConfirmForm
      tradeType={read("tradeType") === "線下交易" ? "線下交易" : "線上交易"}
      platform={read("platform")}
      item={read("item")}
      category={read("category")}
      withImage={read("withImage") === "1"}
    />
  );
}
