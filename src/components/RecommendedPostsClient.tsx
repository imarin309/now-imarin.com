"use client";

import { useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import PostCardCompact from "./PostCardCompact";
import {
  defaultLocale,
  getLocalePathPrefix,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export type PostSummary = {
  title: string;
  slug: string;
  date: string;
  coverImage?: string;
  category: string;
};

export type PostSelector = (
  posts: PostSummary[],
  count: number,
) => PostSummary[];

const randomSelect: PostSelector = (posts, count) => {
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

interface RecommendedPostsClientProps {
  posts: PostSummary[];
  postsByLocale?: Partial<Record<Locale, PostSummary[]>>;
  count?: number;
  selectPosts?: PostSelector;
  locale?: Locale;
  pathPrefix?: string;
}

function getCurrentLocale(pathname: string, fallback: Locale): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : fallback;
}

function Skeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden border border-orange-100 bg-white"
        >
          <div className="aspect-[1200/675] bg-orange-100" />
          <div className="p-4">
            <div className="h-3 w-20 rounded bg-orange-100" />
            <div className="mt-3 h-5 w-3/4 rounded bg-orange-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecommendedPostsClient({
  posts,
  postsByLocale,
  count = 3,
  selectPosts = randomSelect,
  locale = defaultLocale,
  pathPrefix,
}: RecommendedPostsClientProps) {
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname, locale);
  const currentPathPrefix = pathPrefix ?? getLocalePathPrefix(currentLocale);
  const currentPosts = postsByLocale?.[currentLocale] ?? posts;
  const t = getMessages(currentLocale);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const selected = useMemo(
    () => (mounted ? selectPosts(currentPosts, count) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname triggers re-shuffle on navigation
    [mounted, currentPosts, count, selectPosts, pathname],
  );

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-6 text-lg font-semibold text-amber-800">
          {t.posts.recommended}
        </h2>
        {!mounted ? (
          <Skeleton count={count} />
        ) : selected.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {selected.map((post) => (
              <PostCardCompact
                key={post.slug}
                title={post.title}
                date={post.date}
                slug={post.slug}
                coverImage={post.coverImage}
                category={post.category}
                locale={currentLocale}
                pathPrefix={currentPathPrefix}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
