"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function requestGeolocation(timeout = 8000): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("no gps"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout, enableHighAccuracy: false, maximumAge: 60000 },
    );
  });
}

export default function ConfirmForm({
  tradeType,
  platform,
  item,
  category,
  withImage,
}: {
  tradeType: "線上交易" | "線下交易";
  platform: string;
  item: string;
  category: string;
  withImage: boolean;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const locationRef = useRef<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tradeType !== "線下交易") return;
    requestGeolocation()
      .then((pos) => {
        locationRef.current = pos;
      })
      .catch(() => {
        // 拿不到 GPS 時，送出時會回退為「無法取得位置」
      });
  }, [tradeType]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage(e: React.MouseEvent) {
    e.stopPropagation();
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setMessage("請輸入正確金額");
      return;
    }

    setPending(true);
    setMessage("");

    try {
      let locationText = "";
      if (tradeType === "線下交易") {
        let pos = locationRef.current;
        if (!pos) {
          try {
            pos = await requestGeolocation();
            locationRef.current = pos;
          } catch {
            pos = null;
          }
        }
        locationText = pos ? `${pos.lat},${pos.lng}` : "無法取得位置";
      } else {
        locationText = platform;
      }

      let imagePath = "";
      if (image) {
        const fd = new FormData();
        fd.append("file", image);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await upRes.json().catch(() => null);
        if (!upRes.ok) {
          setMessage(upData?.error ?? "圖片上傳失敗");
          return;
        }
        imagePath = upData.path;
      }

      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item,
          type: category,
          amount: value,
          location: locationText,
          image: imagePath,
          note: "",
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.error ?? "記帳失敗");
        return;
      }

      router.replace("/overview");
      router.refresh();
    } catch {
      setMessage("無法連線，請稍後再試");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page-center">
      <div className="container">
        <div className="header-title">
          <h1 className="title-en">TripLedger</h1>
          <h2 className="title-zh">旅行貴啥小</h2>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="price-input-wrapper">
            <span className="currency-label">NT$</span>
            <input
              type="number"
              className="price-input"
              placeholder="請輸入金額"
              required
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {withImage && (
            <>
              <div
                className="upload-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="upload-text" style={{ display: preview ? "none" : "block" }}>
                  上傳附圖
                </span>
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element -- 本地 blob 預覽
                  <img className="image-preview" src={preview} alt="預覽圖" />
                )}
                <button
                  type="button"
                  className="remove-img-btn"
                  style={{ display: preview ? "flex" : "none" }}
                  onClick={removeImage}
                >
                  ✕
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleFile}
              />
            </>
          )}

          <p className="form-message" aria-live="polite">
            {message}
          </p>

          <button type="submit" className="submit-btn" disabled={pending}>
            {pending ? "送出中..." : "送出記帳"}
          </button>
        </form>
      </div>
    </div>
  );
}
