import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./ledger.css";

const iansui = localFont({
  src: "./fonts/Iansui-Regular.ttf",
  variable: "--font-iansui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripLedger - 旅行貴啥小",
  description: "個人旅行記帳",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${iansui.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
