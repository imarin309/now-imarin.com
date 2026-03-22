"use client";

import { useSyncExternalStore } from "react";

function countChars(raw: string): number {
  return raw
    .replace(/^---[\s\S]*?---\n?/, "") // frontmatter
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/<[A-Z][^>]*\/>/g, "") // self-closing JSX components
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "") // JSX components
    .replace(/`[^`\n]*`/g, "") // inline code (同一行のみ)
    .replace(/\s/g, "").length;
}

export function DevWordCount({ body }: { body: string }) {
  const show = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname === "localhost",
    () => false,
  );

  if (!show) return null;

  const count = countChars(body);

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 px-3 py-2 text-xs text-white shadow-lg">
      {count.toLocaleString()} 文字
    </div>
  );
}
