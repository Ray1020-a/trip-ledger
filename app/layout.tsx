import type { Metadata, Viewport } from "next";
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
  applicationName: "TripLedger",
  appleWebApp: {
    capable: true,
    title: "TripLedger",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#47d6dc",
  viewportFit: "cover",
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
