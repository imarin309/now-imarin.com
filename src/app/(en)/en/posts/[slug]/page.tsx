import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TagBadge from "@/components/TagBadge";
import { getCategoryName } from "@/constants/category";
import { siteAuthor, siteHeaderImage, siteUrl } from "@/constants/meta";
import {
  getAllPosts,
  getAvailablePostLocales,
  getPostBySlug,
} from "@/lib/posts";
import { serializeJsonLd } from "@/lib/json-ld";
import { getMessages } from "@/i18n/messages";
import {
  getLocalePathPrefix,
  getLocalizedPath,
  localeMeta,
} from "@/i18n/config";

const LOCALE = "en" as const;

type EnPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EnPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug, LOCALE);
  if (!post) return {};

  const availableLocales = getAvailablePostLocales(decodedSlug);

  return {
    title: post.title,
    description: post.description,
    robots: post.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `/en/posts/${decodedSlug}`,
      ...(availableLocales.length > 1
        ? {
            languages: Object.fromEntries(
              availableLocales.map((locale) => [
                locale,
                getLocalizedPath(locale, `/posts/${decodedSlug}`),
              ]),
            ),
          }
        : {}),
    },
    openGraph: {
      type: "article",
      locale: localeMeta[LOCALE].openGraphLocale,
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

// 英語記事が存在しない間は placeholder のみを返す。この slug は notFound() で
// 404（noindex）になり、sitemap にも載せないため、薄い記事ページは index されない。
// output: export は generateStaticParams が空配列だとエラーになるための回避策。
export function generateStaticParams() {
  const posts = getAllPosts(LOCALE);
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map((post) => ({ slug: post.slug }));
}

async function importEnPost(locale: string, slug: string) {
  return import(`../../../../../../content/posts/${locale}/${slug}.mdx`);
}

export default async function EnPostPage({ params }: EnPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug, LOCALE);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString(
    localeMeta[LOCALE].dateLocale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const pathPrefix = getLocalePathPrefix(LOCALE);
  const t = getMessages(LOCALE);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    url: `${siteUrl}/en/posts/${post.slug}`,
    image: post.coverImage ?? siteHeaderImage,
    author: {
      "@type": "Person",
      name: siteAuthor,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: t.siteName,
      url: siteUrl,
    },
  };

  const { default: MDXContent } = (await importEnPost(LOCALE, decodedSlug)) as {
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
              {getCategoryName(post.category, LOCALE)}
            </span>
            {post.tags?.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                locale={LOCALE}
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
