"use client";

import { useEffect, useRef } from "react";

interface TweetProps {
  url: string;
}

function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

function loadTwitterScript(): Promise<void> {
  return new Promise((resolve) => {
    // @ts-expect-error Twitter widget global
    if (window.twttr?.widgets) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.setAttribute("charset", "utf-8");
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      // @ts-expect-error Twitter widget global
      if (window.twttr?.widgets) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export function Tweet({ url }: TweetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tweetId = extractTweetId(url);

  useEffect(() => {
    if (!ref.current || !tweetId) return;
    const container = ref.current;
    container.innerHTML = "";
    let cancelled = false;

    loadTwitterScript().then(() => {
      if (cancelled) return;
      // @ts-expect-error Twitter widget global
      window.twttr.widgets.createTweet(tweetId, container, {
        lang: "ja",
        align: "center",
      });
    });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [tweetId]);

  if (!tweetId) {
    return <a href={url}>{url}</a>;
  }

  return <div ref={ref} className="not-prose my-4" />;
}
