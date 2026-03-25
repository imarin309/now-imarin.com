import { MetadataRoute } from "next";
import { posts, pages } from "#site/content";
import { siteUrl } from "@/constants/meta";

export const dynamic = "force-static";

function getPageDate(slug: string) {
  const page = pages.find((p) => p.slug === slug);
  return page ? new Date(page.date) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.noindex)
    .map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

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
  ];
}
