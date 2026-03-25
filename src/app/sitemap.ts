import { MetadataRoute } from "next";
import { posts } from "#site/content";
import { siteUrl } from "@/constants/meta";

export const dynamic = "force-static";

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
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...postEntries,
  ];
}
