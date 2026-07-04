import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { POSTS_PER_PAGE } from "@/constants/config";
import { getAllPosts } from "@/lib/posts";
import { getAllTags, getTagName } from "@/constants/tag";
import { getLocalePathPrefix, isLocale, type Locale } from "@/i18n/config";

type LocaleTagPageProps = {
  params: Promise<{ locale: string; tag: string }>;
};

export function generateStaticParams() {
  const locales: Locale[] = ["ja", "en"];
  return locales.flatMap((locale) => {
    const posts = getAllPosts(locale);
    return getAllTags()
      .filter(({ slug }) => posts.some((post) => post.tags?.includes(slug)))
      .map(({ slug }) => ({ locale, tag: slug }));
  });
}

export async function generateMetadata({
  params,
}: LocaleTagPageProps): Promise<Metadata> {
  const { locale: localeParam, tag } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const tagName = getTagName(tag, locale);

  return {
    title: `#${tagName}`,
    alternates: {
      canonical: `/${locale}/tags/${tag}`,
    },
  };
}

export default async function LocaleTagPage({ params }: LocaleTagPageProps) {
  const { locale: localeParam, tag } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const filteredPosts = getAllPosts(locale).filter((post) =>
    post.tags?.includes(tag),
  );

  if (filteredPosts.length === 0) notFound();

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const pathPrefix = getLocalePathPrefix(locale);

  return (
    <PostList
      posts={pagePosts}
      title={`#${getTagName(tag, locale)}`}
      currentPage={1}
      totalPages={totalPages}
      locale={locale}
      pathPrefix={pathPrefix}
      basePath={`${pathPrefix}/tags/${tag}`}
    />
  );
}
