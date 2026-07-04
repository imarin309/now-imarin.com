import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import SiteShell from "@/components/SiteShell";
import { siteUrl } from "@/constants/meta";
import { getMessages } from "@/i18n/messages";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const t = getMessages("en");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: t.siteName,
    template: `%s | ${t.siteName}`,
  },
  description: t.siteDescription,
  icons: {
    icon: "https://assets.now-imarin.com/meta/site-icon.webp",
    apple: "https://assets.now-imarin.com/meta/site-icon.webp",
  },
  openGraph: {
    type: "website",
    siteName: t.siteName,
    locale: "en_US",
    title: {
      default: t.siteName,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
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
      default: t.siteName,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
    images: ["https://assets.now-imarin.com/meta/og-image.webp"],
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <SiteShell locale="en" pathPrefix="/en">
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
