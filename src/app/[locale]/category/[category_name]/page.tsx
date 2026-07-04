import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllCategories, getCategoryBySlug } from "@/constants/category";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import {
  getLocalePathPrefix,
  isLocale,
  locales,
  type Locale,
} from "@/i18n/config";

type LocaleCategoryPageProps = {
  params: Promise<{ locale: string; category_name: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const posts = getAllPosts(locale);
    return getAllCategories()
      .filter((category) =>
        posts.some((post) => post.category === category.slug),
      )
      .map((category) => ({
        locale,
        category_name: category.slug,
      }));
  });
}

export async function generateMetadata({
  params,
}: LocaleCategoryPageProps): Promise<Metadata> {
  const { locale: localeParam, category_name } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const category = getCategoryBySlug(category_name);
  if (!category) return {};

  return {
    title: category.names[locale],
    alternates: {
      canonical: `/${locale}/category/${category_name}`,
    },
  };
}

export default async function LocaleCategoryPage({
  params,
}: LocaleCategoryPageProps) {
  const { locale: localeParam, category_name } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const category = getCategoryBySlug(category_name);
  if (!category) notFound();

  const posts = getAllPosts(locale);
  const filteredPosts = posts.filter((post) => post.category === category_name);
  if (filteredPosts.length === 0) notFound();

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const pathPrefix = getLocalePathPrefix(locale);

  return (
    <PostList
      posts={pagePosts}
      title={category.names[locale]}
      currentPage={1}
      totalPages={totalPages}
      locale={locale}
      pathPrefix={pathPrefix}
      basePath={`${pathPrefix}/category/${category_name}`}
    />
  );
}
