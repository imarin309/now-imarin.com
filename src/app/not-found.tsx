import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "404 - ページが見つかりません",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="text-8xl font-bold text-stone-300">404</p>
          <h1 className="mt-4 text-2xl font-medium text-foreground">
            ページが見つかりませんでした
          </h1>
          <p className="mt-2 text-secondary">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <Link
            href="/"
            className="mt-8 rounded-md bg-stone-700 px-6 py-2 text-sm text-stone-100 transition-colors hover:bg-stone-600"
          >
            トップページへ戻る
          </Link>
        </div>
      </body>
    </html>
  );
}
