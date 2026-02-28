import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => {
    if (basePath) {
      return page === 1 ? basePath : `${basePath}/page/${page}`;
    }
    return page === 1 ? "/" : `/page/${page}`;
  };

  const prevHref = pageHref(currentPage - 1);
  const nextHref = pageHref(currentPage + 1);

  return (
    <nav
      aria-label="ページネーション"
      className="mt-10 flex items-center justify-center gap-4"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="border border-orange-200 px-4 py-2 text-sm text-amber-700 transition-colors hover:bg-orange-50"
        >
          前へ
        </Link>
      ) : (
        <span className="border border-orange-100 px-4 py-2 text-sm text-orange-200">
          前へ
        </span>
      )}

      <span className="text-sm text-amber-600">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="border border-orange-200 px-4 py-2 text-sm text-amber-700 transition-colors hover:bg-orange-50"
        >
          次へ
        </Link>
      ) : (
        <span className="border border-orange-100 px-4 py-2 text-sm text-orange-200">
          次へ
        </span>
      )}
    </nav>
  );
}
