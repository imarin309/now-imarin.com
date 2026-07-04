import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { siteName, siteDescription, siteUrl } from "@/constants/meta";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: "https://assets.now-imarin.com/meta/site-icon.webp",
    apple: "https://assets.now-imarin.com/meta/site-icon.webp",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "ja_JP",
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    images: [
      {
        url: "https://assets.now-imarin.com/meta/og-image.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    images: ["https://assets.now-imarin.com/meta/og-image.webp"],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function JaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <SiteShell locale="ja" pathPrefix="">
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
