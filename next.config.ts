import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkBreaks from "remark-breaks";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "./src/lib/remark-link-card";
import { remarkTextStyle } from "./src/lib/remark-text-style";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "r2.now-imarin.com",
      },
      {
        protocol: "https",
        hostname: "assets.now-imarin.com",
      },
      {
        protocol: "https",
        hostname: "now-imarin.com",
      },
      {
        protocol: "https",
        hostname: "hbb.afl.rakuten.co.jp",
      },
      {
        protocol: "https",
        hostname: "static.affiliate.rakuten.co.jp",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      remarkBreaks,
      remarkDirective,
      remarkTextStyle,
      remarkLinkCard,
    ],
  },
});

export default withMDX(nextConfig);
