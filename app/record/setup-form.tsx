"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordSetupForm({ types }: { types: string[] }) {
  const router = useRouter();
  const [tradeType, setTradeType] = useState<"線上交易" | "線下交易">("線上交易");
  const [platform, setPlatform] = useState("");
  const [item, setItem] = useState("");
  const [category, setCategory] = useState(types[0] ?? "");
  const [withImage, setWithImage] = useState(false);

  function handleContinue() {
    if (!item.trim()) {
      alert("請輸入品項");
      return;
    }
    if (!category) {
      alert("請選擇類型");
      return;
    }
    if (tradeType === "線上交易" && !platform.trim()) {
      alert("請輸入交易平台");
      return;
    }
    const params = new URLSearchParams({
      tradeType,
      item: item.trim(),
      category,
      withImage: withImage ? "1" : "0",
    });
    if (tradeType === "線上交易") {
      params.set("platform", platform.trim());
    }
    router.push(`/record/confirm?${params.toString()}`);
  }

  return (
    <div className="page-center">
      <div className="container">
        <div className="header-title">
          <h1 className="title-en">TripLedger</h1>
          <h2 className="title-zh">旅行貴啥小</h2>
        </div>

        <div className="form-card">
          <div className="button-group">
            <button
              type="button"
              className={`toggle-btn ${tradeType === "線上交易" ? "active" : ""}`}
              onClick={() => setTradeType("線上交易")}
            >
              線上交易
            </button>
            <button
              type="button"
              className={`toggle-btn ${tradeType === "線下交易" ? "active" : ""}`}
              onClick={() => setTradeType("線下交易")}
            >
              線下交易
            </button>
          </div>

          {tradeType === "線上交易" && (
            <input
              type="text"
              className="input-box"
              placeholder="請輸入交易平台"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          )}

          <input
            type="text"
            className="input-box"
            placeholder="請輸入品項"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <select
            className="select-box"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="button-group">
            <button
              type="button"
              className={`toggle-btn ${withImage ? "active" : ""}`}
              onClick={() => setWithImage(true)}
            >
              附圖
            </button>
            <button
              type="button"
              className={`toggle-btn ${!withImage ? "active" : ""}`}
              onClick={() => setWithImage(false)}
            >
              不附圖
            </button>
          </div>

          <button type="button" className="submit-btn" onClick={handleContinue}>
            確認繼續
          </button>
        </div>
      </div>
    </div>
  );
}
