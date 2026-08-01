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

        <svg className="taiwan-map" viewBox="0 0 130 215" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M96.3,1.2
C99.8,2.4 102.0,4.4 103.4,6.6
C104.2,8.0 103.4,9.4 104.6,11.0
C107.0,14.4 112.8,10.0 116.6,11.4
C118.4,12.0 119.6,15.0 120.5,18.6
C121.6,25.2 117.8,32.6 115.2,36.0
C112.6,39.2 111.6,41.6 112.8,43.2
C110.2,51.0 105.0,63.8 103.2,68.0
C100.8,73.4 100.0,77.4 99.6,80.4
C95.6,96.6 89.2,118.8 83.2,136.0
C79.2,149.4 75.6,150.6 74.3,153.6
C70.2,165.8 63.4,176.0 60.0,178.2
C58.0,179.8 57.2,190.0 57.8,205.0
C53.6,204.4 51.4,203.2 52.3,199.2
C53.4,194.6 45.0,185.2 39.6,180.6
C34.6,176.4 29.2,169.6 26.4,162.6
C23.2,154.2 20.2,145.4 19.3,137.4
C18.3,128.2 17.9,124.4 17.6,118.2
C17.0,108.6 24.6,97.4 30.0,88.0
C33.6,81.6 35.6,79.8 36.9,75.6
C39.4,67.8 39.6,63.0 41.3,58.2
C45.6,51.4 54.8,40.2 64.4,31.2
C67.8,28.2 69.8,23.4 71.5,18.0
C73.8,13.8 79.2,12.4 82.5,13.2
C85.4,14.0 89.4,10.6 90.8,10.2
C93.4,8.0 95.0,4.4 96.3,1.2Z"
            fill="#29b6f6"
            opacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
}
