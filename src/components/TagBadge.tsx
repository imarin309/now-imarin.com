import Link from "next/link";
import { getTagName } from "@/constants/tag";
import { defaultLocale, type Locale } from "@/i18n/config";

interface TagBadgeProps {
  tag: string;
  locale?: Locale;
  pathPrefix?: string;
}

export default function TagBadge({
  tag,
  locale = defaultLocale,
  pathPrefix = "",
}: TagBadgeProps) {
  return (
    <Link
      href={`${pathPrefix}/tags/${tag}`}
      className="border border-orange-300 px-2 py-1 text-xs text-orange-500 transition-colors hover:border-orange-500 hover:text-orange-700"
    >
      #{getTagName(tag, locale)}
    </Link>
  );
}
