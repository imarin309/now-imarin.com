import { getAllPosts } from "@/lib/posts";
import RecommendedPostsClient, {
  type PostSummary,
} from "./RecommendedPostsClient";
import { defaultLocale, type Locale } from "@/i18n/config";

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
  const posts = toPostSummaries(locale);

  return (
    <RecommendedPostsClient
      posts={posts}
      locale={locale}
      pathPrefix={pathPrefix}
    />
  );
}
