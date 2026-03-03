import type { NextConfig } from "next";

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
};

export default nextConfig;
