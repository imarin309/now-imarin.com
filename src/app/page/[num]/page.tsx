/**
 * ページネーション - 2ページ目以降の記事一覧
 */
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { POSTS_PER_PAGE } from "@/constants/config";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

const sortedPosts = getAllPosts();
const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ num: string }>;
}): Promise<Metadata> {
  const { num } = await params;
  const pageNum = Number(num);
  if (!Number.isInteger(pageNum) || pageNum <= 1 || pageNum > totalPages) {
    return {};
  }
  return {
    alternates: {
      canonical: `/page/${pageNum}`,
    },
  };
}

export function generateStaticParams() {
  if (totalPages <= 1) {
    return [{ num: "2" }];
  }
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    num: String(i + 2),
  }));
}

export default async function PaginatedPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const pageNum = Number(num);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect("/");
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedPosts.slice(start, start + POSTS_PER_PAGE);
  const t = getMessages(defaultLocale);

  return (
    <>
      <PostList
        posts={pagePosts}
        title={t.posts.pageTitle(pageNum)}
        currentPage={pageNum}
        totalPages={totalPages}
      />
    </>
  );
}
