import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "네이밍 마스터 - AI 상품명 생성기 | 쿠팡 & 스마트스토어 SEO 최적화",
  description:
    "AI가 쿠팡, 네이버 스마트스토어 검색 알고리즘에 최적화된 상품명을 자동 생성합니다. 매출을 높이는 상품명, 지금 바로 만들어보세요.",
  keywords: "상품명 생성기, 쿠팡 상품명, 스마트스토어 상품명, SEO 최적화, AI 네이밍",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
