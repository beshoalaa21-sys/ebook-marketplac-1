import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سوق الكتب الإلكترونية",
  description: "Marketplace for Arabic and English digital books",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
