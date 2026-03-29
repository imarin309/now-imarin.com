import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RecommendedPosts from "@/components/RecommendedPosts";
import GoogleAnalytics from "@/components/google/GoogleAnalytics";
import GoogleAdSense from "@/components/google/GoogleAdSense";
import {
  siteName,
  siteDescription,
  siteUrl,
  siteAuthor,
} from "@/constants/meta";

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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  author: {
    "@type": "Person",
    name: siteAuthor,
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        {process.env.NODE_ENV === "production" &&
          process.env.CF_PAGES_BRANCH === "main" && (
            <>
              <GoogleAnalytics />
              <GoogleAdSense />
            </>
          )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <NavBar />
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          {children}
        </main>
        <RecommendedPosts />
        <Footer />
      </body>
    </html>
  );
}
