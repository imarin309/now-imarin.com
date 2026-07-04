import { getAllPosts } from "@/lib/posts";
import RecommendedPostsClient, {
  type PostSummary,
} from "./RecommendedPostsClient";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

function toPostSummaries(locale: Locale): PostSummary[] {
  const posts = getAllPosts(locale);
  return posts
    .filter((post) => !post.noindex)
    .map(({ title, slug, date, coverImage, category }) => ({
      title,
      slug,
      date,
      coverImage,
      category,
    }));
}

export default function RecommendedPosts({
  locale = defaultLocale,
  pathPrefix,
}: {
  locale?: Locale;
  pathPrefix?: string;
}) {
  const postsByLocale = Object.fromEntries(
    locales.map((item) => [item, toPostSummaries(item)]),
  ) as Record<Locale, PostSummary[]>;

  return (
    <RecommendedPostsClient
      posts={postsByLocale[locale]}
      postsByLocale={postsByLocale}
      locale={locale}
      pathPrefix={pathPrefix}
    />
  );
}
