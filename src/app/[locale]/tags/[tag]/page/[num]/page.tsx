import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/constants/tag";
import {
  getLocalePathPrefix,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

type LocaleTagPaginatedPageProps = {
  params: Promise<{ locale: string; tag: string; num: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const posts = getAllPosts(locale);
    return getAllTags().flatMap(({ slug }) => {
      const count = posts.filter((post) => post.tags?.includes(slug)).length;
      const totalPages = Math.ceil(count / POSTS_PER_PAGE);
      if (totalPages <= 1) return [];
      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        locale,
        tag: slug,
        num: String(i + 2),
      }));
    });
  });
}

export async function generateMetadata({
  params,
}: LocaleTagPaginatedPageProps): Promise<Metadata> {
  const { locale: localeParam, tag, num } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const pageNum = Number(num);
  const filteredCount = getAllPosts(locale).filter((post) =>
    post.tags?.includes(tag),
  ).length;
  const totalPages = Math.ceil(filteredCount / POSTS_PER_PAGE);

  if (!Number.isInteger(pageNum) || pageNum <= 1 || pageNum > totalPages) {
    return {};
  }

  return {
    alternates: {
      canonical: `/${locale}/tags/${tag}/page/${pageNum}`,
    },
  };
}

export default async function LocaleTagPaginatedPage({
  params,
}: LocaleTagPaginatedPageProps) {
  const { locale: localeParam, tag, num } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const filteredPosts = getAllPosts(locale).filter((post) =>
    post.tags?.includes(tag),
  );
  if (filteredPosts.length === 0) notFound();

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pageNum = Number(num);
  const pathPrefix = getLocalePathPrefix(locale);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect(`${pathPrefix}/tags/${tag}`);
  }

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);
  const t = getMessages(locale);

  return (
    <PostList
      posts={pagePosts}
      title={t.posts.pageTitle(pageNum)}
      currentPage={pageNum}
      totalPages={totalPages}
      locale={locale}
      pathPrefix={pathPrefix}
      basePath={`${pathPrefix}/tags/${tag}`}
    />
  );
}
