"use client";

import Script from "next/script";

const AD_CLIENT = "ca-pub-1189493113133736";

export default function GoogleAdSense() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
