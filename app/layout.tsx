import type { Metadata } from "next";
import { Kalam, Noto_Sans_TC, Zhi_Mang_Xing } from "next/font/google";
import "./globals.css";
import "./ledger.css";

const kalam = Kalam({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-kalam",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

const zhiMangXing = Zhi_Mang_Xing({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zhi",
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
      className={`${kalam.variable} ${notoSansTC.variable} ${zhiMangXing.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
