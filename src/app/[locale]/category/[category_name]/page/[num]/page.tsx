import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllCategories, getCategoryBySlug } from "@/constants/category";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import { getLocalePathPrefix, isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

type LocaleCategoryPaginatedPageProps = {
  params: Promise<{ locale: string; category_name: string; num: string }>;
};

export function generateStaticParams() {
  const locales: Locale[] = ["ja", "en"];
  return locales.flatMap((locale) => {
    const posts = getAllPosts(locale);
    return getAllCategories().flatMap((category) => {
      const count = posts.filter(
        (post) => post.category === category.slug,
      ).length;
      const totalPages = Math.ceil(count / POSTS_PER_PAGE);
      if (totalPages <= 1) return [];
      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        locale,
        category_name: category.slug,
        num: String(i + 2),
      }));
    });
  });
}

export async function generateMetadata({
  params,
}: LocaleCategoryPaginatedPageProps): Promise<Metadata> {
  const { locale: localeParam, category_name, num } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const category = getCategoryBySlug(category_name);
  if (!category) return {};

  const filteredCount = getAllPosts(locale).filter(
    (post) => post.category === category_name,
  ).length;
  const totalPages = Math.ceil(filteredCount / POSTS_PER_PAGE);
  const pageNum = Number(num);
  if (!Number.isInteger(pageNum) || pageNum <= 1 || pageNum > totalPages) {
    return {};
  }

  return {
    title: `${category.names[locale]} ${pageNum}`,
    alternates: {
      canonical: `/${locale}/category/${category_name}/page/${pageNum}`,
    },
  };
}

export default async function LocaleCategoryPaginatedPage({
  params,
}: LocaleCategoryPaginatedPageProps) {
  const { locale: localeParam, category_name, num } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const category = getCategoryBySlug(category_name);
  if (!category) notFound();

  const filteredPosts = getAllPosts(locale).filter(
    (post) => post.category === category_name,
  );
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pageNum = Number(num);
  const pathPrefix = getLocalePathPrefix(locale);

  if (pageNum === 1 || pageNum > totalPages) {
    redirect(`${pathPrefix}/category/${category_name}`);
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
      basePath={`${pathPrefix}/category/${category_name}`}
    />
  );
}
