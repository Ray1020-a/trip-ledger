import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { nowInTaipei } from "@/lib/datetime";

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const appendUrl = process.env.SHEET_APPEND_URL;
  if (!appendUrl) {
    return NextResponse.json(
      { error: "未設定 SHEET_APPEND_URL，無法寫入試算表" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const item = String(body?.item ?? "").trim();
  const type = String(body?.type ?? "").trim();
  const amount = Number(body?.amount);

  if (!item) {
    return NextResponse.json({ error: "品項不能為空" }, { status: 400 });
  }
  if (!type) {
    return NextResponse.json({ error: "類型不能為空" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: "金額格式不正確" }, { status: 400 });
  }

  const now = nowInTaipei();
  const row = {
    date: now.date,
    time: now.time,
    item,
    type,
    amount: `NT$${Math.round(amount)}`,
    location: String(body?.location ?? ""),
    image: String(body?.image ?? ""),
    note: String(body?.note ?? ""),
  };

  let res: Response;
  try {
    res = await fetch(appendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "無法連線到試算表服務" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "寫入試算表失敗" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
