import Image from "next/image";
import Link from "next/link";
import { getCategoryName } from "@/constants/category";
import TagBadge from "@/components/TagBadge";
import { siteHeaderImage } from "@/constants/meta";
import type { Post } from "@/lib/posts";

function getExcerpt(body: string, length = 100): string {
  let text = body
    .replace(/^---[\s\S]*?---\n?/, "") // frontmatter
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "") // JSX components
    .replace(/<[A-Z][^>]*\/>/g, "") // self-closing JSX
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // markdown links
    .replace(/`[^`\n]*`/g, "") // inline code
    .replace(/https?:\/\/\S+/g, "") // bare URLs
    .replace(/#{1,6}\s/g, "") // headings
    .replace(/[*_~>#-]/g, ""); // markdown symbols

  // テキストディレクティブ (:large[...] など) を最大3段ネストまで展開
  for (let i = 0; i < 3; i++) {
    text = text.replace(/:[a-z]+\[([^\[\]]*)\]/g, "$1");
  }

  return text.replace(/\s+/g, " ").trim().slice(0, length);
}

interface PostCardProps {
  title: Post["title"];
  body: Post["body"];
  date: Post["date"];
  slug: Post["slug"];
  coverImage?: Post["coverImage"];
  category: Post["category"];
  tags?: Post["tags"];
}

export default function PostCard({
  title,
  body,
  date,
  slug,
  coverImage,
  category,
  tags = [],
}: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const image = coverImage ?? siteHeaderImage;

  return (
    <article className="group overflow-hidden border border-orange-100 bg-white transition-all hover:border-orange-200 hover:shadow-lg sm:flex">
      {image && (
        <div className="relative aspect-[1200/675] overflow-hidden sm:aspect-auto sm:w-72 sm:shrink-0 sm:self-stretch">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 640px) 288px, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute left-0 top-3">
            <span className="bg-orange-600 px-3 py-1 text-xs font-medium text-white">
              {getCategoryName(category)}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        <Link href={`/posts/${slug}`} className="p-4 pb-2">
          <time className="text-xs text-orange-300">{formattedDate}</time>
          <h2 className="mt-2 text-lg font-semibold leading-snug text-amber-800 group-hover:text-orange-600">
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-amber-600">
            {getExcerpt(body)}
          </p>
        </Link>
        <div className="flex min-h-6 flex-wrap gap-1 px-4 pb-4">
          {tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </article>
  );
}
