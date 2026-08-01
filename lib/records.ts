export type LedgerRecord = {
  date: string;
  time: string;
  item: string;
  type: string;
  amount: string;
  location: string;
  image: string;
  note: string;
};

const DEFAULT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqflYAvOLyTuYMAHKLDtgdIDEdxNGd5WRchDNk9khCACI-hx3wb2nFPjDpW7kGdqDlTI1iJMPb-Dt_/pub?gid=0&single=true&output=csv";

export function csvUrl(): string {
  return process.env.SHEET_CSV_URL || DEFAULT_CSV_URL;
}

export async function fetchRecords(): Promise<LedgerRecord[]> {
  const res = await fetch(csvUrl(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`CSV 讀取失敗: ${res.status}`);
  }
  const text = await res.text();
  return parseCsv(text);
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  const content = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch === "\r") {
      // ignore
    } else {
      cur += ch;
    }
  }

  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

export function parseCsv(text: string): LedgerRecord[] {
  const rows = parseCsvRows(text);
  const records: LedgerRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.every((cell) => cell.trim() === "")) continue;
    records.push({
      date: r[0] ?? "",
      time: r[1] ?? "",
      item: r[2] ?? "",
      type: r[3] ?? "",
      amount: r[4] ?? "",
      location: r[5] ?? "",
      image: r[6] ?? "",
      note: r[7] ?? "",
    });
  }

  return records;
}

export function parseAmount(value: string): number {
  const digits = String(value).replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function sumAmount(records: LedgerRecord[]): number {
  return records.reduce((total, r) => total + parseAmount(r.amount), 0);
}

export function sortRecordsDesc(records: LedgerRecord[]): LedgerRecord[] {
  return [...records].sort((a, b) => {
    const key = (r: LedgerRecord) => `${r.date} ${r.time}`;
    return key(b).localeCompare(key(a));
  });
}
