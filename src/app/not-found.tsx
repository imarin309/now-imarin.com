import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import NotFoundContent from "@/components/NotFoundContent";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "404 - ページが見つかりません",
  robots: { index: false },
};

// (ja)/(en) いずれのルートグループにもマッチしない未知のパス用の
// 最終フォールバック。どちらのレイアウトにも包まれないため、
// 自前で <html>/<body> を持つ必要がある。
export default function NotFound() {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <NotFoundContent locale="ja" pathPrefix="" />
      </body>
    </html>
  );
}
