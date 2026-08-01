import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { fetchRecords, sortRecordsDesc, sumAmount, type LedgerRecord } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  await requireAuth();

  let records: LedgerRecord[] = [];
  let error = "";
  try {
    records = await fetchRecords();
  } catch {
    error = "無法讀取記帳資料，請稍後再試";
  }

  const total = sumAmount(records);
  const recent = sortRecordsDesc(records).slice(0, 5);

  return (
    <div className="page-top">
      <div className="container" style={{ gap: "16px" }}>
        <div className="total-card">
          <h2 className="total-title">總花費</h2>
          <div className="total-amount">NT$ {total}</div>
        </div>

        <div className="list-container">
          {error ? (
            <div className="empty-state">{error}</div>
          ) : recent.length === 0 ? (
            <div className="empty-state">還沒有任何記帳紀錄</div>
          ) : (
            recent.map((r, idx) => (
              <div className="item-card" key={idx}>
                <div className="item-info">
                  <div className="item-title">{r.item}</div>
                </div>
                <div className="item-meta">
                  <span className="item-category">{r.type}</span>
                  <span className="item-price">{r.amount}</span>
                  <span className="item-date">{`${r.date} ${r.time}`}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <Link href="/record" className="add-btn">
          添加記帳
        </Link>
      </div>
    </div>
  );
}
