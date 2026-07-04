import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import { getLocalePathPrefix } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

const LOCALE = "en" as const;

export const metadata: Metadata = {
  alternates: {
    canonical: "/en",
    languages: {
      ja: "/",
      en: "/en",
    },
  },
};

export default function EnHome() {
  const posts = getAllPosts(LOCALE);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice(0, POSTS_PER_PAGE);
  const pathPrefix = getLocalePathPrefix(LOCALE);
  const t = getMessages(LOCALE);

  return (
    <PostList
      posts={pagePosts}
      title={t.posts.latest}
      currentPage={1}
      totalPages={totalPages}
      locale={LOCALE}
      pathPrefix={pathPrefix}
      basePath={pathPrefix}
    />
  );
}
