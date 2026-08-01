import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

const MAX_SIZE = 15 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "沒有圖片" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "圖片過大（上限 15MB）" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "僅接受圖片檔案" }, { status: 400 });
  }

  const ext = (file.type.split("/")[1] ?? "png")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const dir = path.join(process.cwd(), "IMG");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);
  } catch {
    return NextResponse.json({ error: "儲存圖片失敗" }, { status: 500 });
  }

  return NextResponse.json({ path: `./IMG/${filename}` });
}
