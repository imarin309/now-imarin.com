"use client";

import { usePathname } from "next/navigation";
import { siteAuthor, siteUrl } from "@/constants/meta";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getCurrentLocale } from "@/i18n/routing";
import { serializeJsonLd } from "@/lib/json-ld";

export default function WebSiteJsonLd() {
  const pathname = usePathname();
  const locale = getCurrentLocale(pathname, defaultLocale);
  const t = getMessages(locale);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t.siteName,
    url: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
    description: t.siteDescription,
    author: {
      "@type": "Person",
      name: siteAuthor,
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
    />
  );
}
