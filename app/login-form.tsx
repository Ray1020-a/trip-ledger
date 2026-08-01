"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/overview");
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "登入失敗");
      }
    } catch {
      setError("無法連線，請稍後再試");
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

        <div className="login-card">
          <div className="lock-icon-container">
            <svg
              className="lock-icon"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="25"
                y="42"
                width="50"
                height="42"
                rx="10"
                fill="#47D6DC"
                stroke="#222"
                strokeWidth="3"
              />
              <path
                d="M35 42V28C35 19.7157 41.7157 13 50 13C58.2843 13 65 19.7157 65 28V42"
                stroke="#222"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="50" cy="58" r="4" fill="#222" />
              <path d="M50 62V72" stroke="#222" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <form
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <input
                type={show ? "text" : "password"}
                id="password"
                className="password-input"
                placeholder="請輸入密碼"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                aria-label="切換密碼顯示"
                onClick={() => setShow((v) => !v)}
              >
                {show ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            <p className="login-error" aria-live="polite">
              {error}
            </p>

            <button type="submit" className="submit-btn" disabled={pending}>
              登入
            </button>
          </form>
        </div>

        <svg className="taiwan-map" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M110,20 Q130,30 140,50 Q160,80 150,110 Q140,140 160,170 Q170,200 150,230 Q130,260 120,290 Q110,320 95,350 Q85,370 75,380 Q65,370 60,340 Q55,300 70,260 Q80,220 75,180 Q65,140 80,100 Q90,60 100,30 Z"
            fill="#29b6f6"
            opacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
}
