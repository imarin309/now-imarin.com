import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import { getLocalePathPrefix, isLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  return {
    alternates: {
      canonical: `/${localeParam}`,
    },
  };
}

export default async function LocaleHome({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const posts = getAllPosts(locale);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice(0, POSTS_PER_PAGE);
  const pathPrefix = getLocalePathPrefix(locale);
  const t = getMessages(locale);

  return (
    <PostList
      posts={pagePosts}
      title={t.posts.latest}
      currentPage={1}
      totalPages={totalPages}
      locale={locale}
      pathPrefix={pathPrefix}
      basePath={pathPrefix}
    />
  );
}
