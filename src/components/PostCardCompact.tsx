import Image from "next/image";
import Link from "next/link";
import { getCategoryName } from "@/constants/category";
import { siteHeaderImage } from "@/constants/meta";

interface PostCardCompactProps {
  title: string;
  date: string;
  slug: string;
  coverImage?: string;
  category: string;
}

// PostCardCompact はdescriptionを持たないPostCard
export default function PostCardCompact({
  title,
  date,
  slug,
  coverImage,
  category,
}: PostCardCompactProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const image = coverImage ?? siteHeaderImage;

  return (
    <article className="group overflow-hidden border border-orange-100 bg-white transition-all hover:border-orange-200 hover:shadow-lg">
      <Link href={`/posts/${slug}`}>
        {image && (
          <div className="relative aspect-[1200/675] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute left-0 top-3">
              <span className="bg-orange-600 px-3 py-1 text-xs font-medium text-white">
                {getCategoryName(category)}
              </span>
            </div>
          </div>
        )}
        <div className="p-4">
          <time className="text-xs text-orange-300">{formattedDate}</time>
          <h2 className="mt-2 text-lg font-semibold leading-snug text-amber-800 group-hover:text-orange-600">
            {title}
          </h2>
        </div>
      </Link>
    </article>
  );
}
