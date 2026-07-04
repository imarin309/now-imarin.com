import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TagBadge from "@/components/TagBadge";
import { getCategoryName } from "@/constants/category";
import {
  siteAuthor,
  siteHeaderImage,
  siteName,
  siteUrl,
} from "@/constants/meta";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { serializeJsonLd } from "@/lib/json-ld";
import {
  defaultLocale,
  getLocalePathPrefix,
  isLocale,
  localeMeta,
  locales,
  type Locale,
} from "@/i18n/config";

type LocalePostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: LocalePostPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug, locale);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    robots: post.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `/${locale}/posts/${decodedSlug}`,
    },
    openGraph: {
      type: "article",
      locale: localeMeta[locale].openGraphLocale,
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage ?? siteHeaderImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage ?? siteHeaderImage],
    },
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      locale,
      slug: post.slug,
    })),
  );
}

async function importPost(locale: Locale, slug: string) {
  if (locale === defaultLocale) {
    return import(`../../../../../content/posts/${slug}.mdx`);
  }
  return import(`../../../../../content/posts/${locale}/${slug}.mdx`);
}

export default async function LocalePostPage({ params }: LocalePostPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug, locale);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString(
    localeMeta[locale].dateLocale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const pathPrefix = getLocalePathPrefix(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    url: `${siteUrl}/${locale}/posts/${post.slug}`,
    image: post.coverImage ?? siteHeaderImage,
    author: {
      "@type": "Person",
      name: siteAuthor,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };

  const { default: MDXContent } = (await importPost(locale, decodedSlug)) as {
    default: React.ComponentType;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-orange-100 pb-6">
          <time className="text-xs text-orange-300">{formattedDate}</time>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-amber-900 sm:text-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="bg-orange-600 px-3 py-1 text-xs text-white">
              {getCategoryName(post.category, locale)}
            </span>
            {post.tags?.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                locale={locale}
                pathPrefix={pathPrefix}
              />
            ))}
          </div>
        </header>

        <div className="prose prose-amber max-w-none prose-headings:font-semibold prose-a:text-orange-600 prose-a:underline-offset-2 hover:prose-a:text-orange-800">
          <MDXContent />
        </div>
      </article>
    </>
  );
}
