/**
 * タグ別記事一覧 - ページネーション（2ページ目以降）
 */
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { posts } from "#site/content";
import { POSTS_PER_PAGE } from "@/constants/config";

function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet);
}

export function generateStaticParams() {
  const allParams: { tag: string; num: string }[] = [];

  for (const tag of getAllTags()) {
    const count = posts.filter((post) => post.tags.includes(tag)).length;
    const totalPages = Math.ceil(count / POSTS_PER_PAGE);

    if (totalPages <= 1) {
      allParams.push({ tag, num: "2" });
    } else {
      for (let i = 2; i <= totalPages; i++) {
        allParams.push({ tag, num: String(i) });
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
  const decodedTag = decodeURIComponent(tag);
  const pageNum = Number(num);

  const filteredCount = posts.filter((post) =>
    post.tags.includes(decodedTag),
  ).length;
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
  const decodedTag = decodeURIComponent(tag);

  const filteredPosts = posts
    .filter((post) => post.tags.includes(decodedTag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      title={`#${decodedTag} の記事一覧 - ページ ${pageNum}`}
      currentPage={pageNum}
      totalPages={totalPages}
      basePath={`/tags/${tag}`}
    />
  );
}
