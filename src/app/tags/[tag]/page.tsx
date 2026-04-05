/**
 * タグ別記事一覧ページ（1ページ目）
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { posts } from "#site/content";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllTags } from "@/lib/tags";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} の記事一覧`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(tag)}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const filteredPosts = posts
    .filter((post) => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filteredPosts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  return (
    <PostList
      posts={pagePosts}
      title={`#${tag} の記事一覧`}
      currentPage={1}
      totalPages={totalPages}
      basePath={`/tags/${encodeURIComponent(tag)}`}
    />
  );
}
