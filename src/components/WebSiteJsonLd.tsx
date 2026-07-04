import { siteAuthor, siteUrl } from "@/constants/meta";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { serializeJsonLd } from "@/lib/json-ld";

export default function WebSiteJsonLd({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
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
