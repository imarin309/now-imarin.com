import { MetadataRoute } from "next";
import { getAllPosts, getAllPages } from "@/lib/posts";
import { siteUrl } from "@/constants/meta";
import { localeRouteLocales, type Locale } from "@/i18n/config";

export const dynamic = "force-static";

function getPageDate(slug: string, locale?: Locale) {
  const pages = getAllPages(locale);
  const page = pages.find((p) => p.slug === slug);
  return page ? new Date(page.date) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noindex)
    .map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const localizedEntries: MetadataRoute.Sitemap = localeRouteLocales.flatMap(
    (locale) => {
      const aboutDate = getPageDate("about", locale);
      const privacyDate = getPageDate("privacy-policy", locale);
      const localePosts = getAllPosts(locale)
        .filter((post) => !post.noindex)
        .map((post) => ({
          url: `${siteUrl}/${locale}/posts/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));

      return [
        {
          url: `${siteUrl}/${locale}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 1,
        },
        ...(aboutDate
          ? [
              {
                url: `${siteUrl}/${locale}/about`,
                lastModified: aboutDate,
                changeFrequency: "monthly" as const,
                priority: 0.5,
              },
            ]
          : []),
        ...(privacyDate
          ? [
              {
                url: `${siteUrl}/${locale}/privacy-policy`,
                lastModified: privacyDate,
                changeFrequency: "monthly" as const,
                priority: 0.3,
              },
            ]
          : []),
        {
          url: `${siteUrl}/${locale}/contact`,
          lastModified: new Date("2026-03-25"),
          changeFrequency: "monthly" as const,
          priority: 0.3,
        },
        ...localePosts,
      ];
    },
  );

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: getPageDate("about"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: getPageDate("privacy-policy"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...postEntries,
    ...localizedEntries,
  ];
}
