import { defineConfig, defineCollection, s } from "velite";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import { remarkTextStyle } from "./src/lib/remark-text-style";
import { remarkLinkCard } from "./src/lib/remark-link-card";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string().max(300).optional(),
      date: s.isodate(),
      category: s.string(),
      coverImage: s.string().optional(),
      tags: s.array(s.string()).optional().default([]),
      noindex: s.boolean().optional().default(false),
      slug: s.path(),
      body: s.raw(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^posts\//, ""),
    })),
});

const pages = defineCollection({
  name: "Page",
  pattern: "pages/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      description: s.string().max(300).optional(),
      date: s.isodate(),
      slug: s.path(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^pages\//, ""),
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, pages },
  mdx: {
    remarkPlugins: [
      remarkBreaks,
      remarkDirective,
      remarkTextStyle,
      remarkLinkCard,
    ],
    rehypePlugins: [],
  },
});
