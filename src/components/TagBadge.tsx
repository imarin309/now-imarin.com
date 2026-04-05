import Link from "next/link";

interface TagBadgeProps {
  tag: string;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="border border-orange-300 px-2 py-1 text-xs text-orange-500 transition-colors hover:border-orange-500 hover:text-orange-700"
    >
      #{tag}
    </Link>
  );
}
