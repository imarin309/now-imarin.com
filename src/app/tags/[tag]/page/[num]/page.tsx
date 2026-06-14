/**
 * タグ別記事一覧 - ページネーション（2ページ目以降）
 */
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllTags } from "@/constants/tag";

export function generateStaticParams() {
  const allParams: { tag: string; num: string }[] = [];
  const posts = getAllPosts();

  for (const { slug } of getAllTags()) {
    const count = posts.filter((post) => post.tags?.includes(slug)).length;
    const totalPages = Math.ceil(count / POSTS_PER_PAGE);

    if (totalPages <= 1) {
      allParams.push({ tag: slug, num: "2" });
    } else {
      for (let i = 2; i <= totalPages; i++) {
        allParams.push({ tag: slug, num: String(i) });
      }
    }
  }

  return allParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; num: string }>;
}): Promise<Metadata> {
  const { tag, num } = await params;
  const pageNum = Number(num);

  const posts = getAllPosts();
  const filteredCount = posts.filter((post) => post.tags?.includes(tag)).length;
  const totalPages = Math.ceil(filteredCount / POSTS_PER_PAGE);

  if (!Number.isInteger(pageNum) || pageNum <= 1 || pageNum > totalPages) {
    return {};
  }
  return {
    alternates: {
      canonical: `/tags/${tag}/page/${pageNum}`,
    },
  };
}

export default async function TagPaginatedPage({
  params,
}: {
  params: Promise<{ tag: string; num: string }>;
}) {
  const { tag, num } = await params;

  const posts = getAllPosts();
  const filteredPosts = posts
    .filter((post) => post.tags?.includes(tag));

  if (filteredPosts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pageNum = Number(num);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect(`/tags/${tag}`);
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <PostList
      posts={pagePosts}
      title={`ページ ${pageNum}`}
      currentPage={pageNum}
      totalPages={totalPages}
      basePath={`/tags/${tag}`}
    />
  );
}
