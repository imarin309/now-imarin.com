"use client";

import { useEffect, useRef } from "react";

interface TweetProps {
  url: string;
}

function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

const TWITTER_SCRIPT_TIMEOUT = 10_000;

function loadTwitterScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error Twitter widget global
    if (window.twttr?.widgets) {
      resolve();
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.setAttribute("charset", "utf-8");
      document.head.appendChild(script);
    }
    const timeout = setTimeout(() => {
      reject(new Error("Twitter widget script timed out"));
    }, TWITTER_SCRIPT_TIMEOUT);
    script.addEventListener("load", () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
    script.addEventListener("error", () => {
      clearTimeout(timeout);
      reject(new Error("Twitter widget script failed to load"));
    }, { once: true });
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

    loadTwitterScript()
      .then(() => {
        if (cancelled) return;
        // @ts-expect-error Twitter widget global
        window.twttr.widgets.createTweet(tweetId, container, {
          lang: "ja",
          align: "center",
        });
      })
      .catch(() => {
        // スクリプトの読み込み失敗時はリンクフォールバック
        if (!cancelled && container.isConnected) {
          container.innerHTML = `<a href="${url}">${url}</a>`;
        }
      });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [tweetId, url]);

  if (!tweetId) {
    return <a href={url}>{url}</a>;
  }

  return <div ref={ref} className="not-prose my-4" />;
}
