/**
 * タグ別記事一覧ページ（1ページ目）
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllTags, getTagName } from "@/constants/tag";

export function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tagName = getTagName(tag);
  return {
    title: `#${tagName} の記事一覧`,
    alternates: {
      canonical: `/tags/${tag}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const posts = getAllPosts();
  const filteredPosts = posts
    .filter((post) => post.tags?.includes(tag));

  if (filteredPosts.length === 0) {
    notFound();
  }

  const tagName = getTagName(tag);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  return (
    <PostList
      posts={pagePosts}
      title={`#${tagName}`}
      currentPage={1}
      totalPages={totalPages}
      basePath={`/tags/${tag}`}
    />
  );
}
