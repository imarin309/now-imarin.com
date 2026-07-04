import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "@/constants/meta";
import {
  isLocale,
  localeMeta,
  localeRouteLocales,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export const dynamic = "force-static";

type LocaleFeedProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return localeRouteLocales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: LocaleFeedProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const t = getMessages(locale);
  const sortedPosts = getAllPosts(locale)
    .filter((post) => !post.noindex)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const items = sortedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/${locale}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${locale}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ""}
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${t.siteName}]]></title>
    <link>${siteUrl}/${locale}</link>
    <description><![CDATA[${t.siteDescription}]]></description>
    <language>${localeMeta[locale].rssLanguage}</language>
    <atom:link href="${siteUrl}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
