import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import {
  getLocalePathPrefix,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

type LocalePaginatedPageProps = {
  params: Promise<{ locale: string; num: string }>;
};

export async function generateMetadata({
  params,
}: LocalePaginatedPageProps): Promise<Metadata> {
  const { locale: localeParam, num } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const totalPages = Math.ceil(getAllPosts(locale).length / POSTS_PER_PAGE);
  const pageNum = Number(num);
  if (!Number.isInteger(pageNum) || pageNum <= 1 || pageNum > totalPages) {
    return {};
  }

  return {
    alternates: {
      canonical: `/${locale}/page/${pageNum}`,
    },
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const totalPages = Math.ceil(getAllPosts(locale).length / POSTS_PER_PAGE);
    if (totalPages <= 1) return [];
    return Array.from({ length: totalPages - 1 }, (_, i) => ({
      locale,
      num: String(i + 2),
    }));
  });
}

export default async function LocalePaginatedPage({
  params,
}: LocalePaginatedPageProps) {
  const { locale: localeParam, num } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const posts = getAllPosts(locale);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pageNum = Number(num);
  const pathPrefix = getLocalePathPrefix(locale);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect(pathPrefix);
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
  const t = getMessages(locale);

  return (
    <PostList
      posts={pagePosts}
      title={t.posts.pageTitle(pageNum)}
      currentPage={pageNum}
      totalPages={totalPages}
      locale={locale}
      pathPrefix={pathPrefix}
      basePath={pathPrefix}
    />
  );
}
