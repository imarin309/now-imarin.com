import Link from "next/link";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  locale?: Locale;
}

const WINDOW_SIZE = 6;

function getPageWindow(current: number, total: number): number[] {
  if (total <= WINDOW_SIZE) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - Math.floor(WINDOW_SIZE / 2));
  const end = Math.min(total, start + WINDOW_SIZE - 1);
  if (end - start + 1 < WINDOW_SIZE) {
    start = Math.max(1, end - WINDOW_SIZE + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  locale = defaultLocale,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const t = getMessages(locale);

  const pageHref = (page: number) => {
    if (basePath) {
      return page === 1 ? basePath : `${basePath}/page/${page}`;
    }
    return page === 1 ? "/" : `/page/${page}`;
  };

  const pages = getPageWindow(currentPage, totalPages);
  const showStartEllipsis = pages[0] > 1;
  const showEndEllipsis = pages[pages.length - 1] < totalPages;

  const pageButtonBase =
    "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-200";
  const pageButtonActive =
    "bg-gradient-to-br from-[#d4500a] to-[#f4924b] text-white shadow-md shadow-orange-200 font-medium scale-110";
  const pageButtonInactive =
    "text-amber-700 hover:bg-accent hover:text-primary hover:scale-105";
  const arrowButtonActive =
    "flex h-9 w-9 items-center justify-center rounded-full text-amber-600 transition-all duration-200 hover:bg-accent hover:text-primary hover:scale-105";
  const arrowButtonDisabled =
    "flex h-9 w-9 items-center justify-center rounded-full text-orange-200 cursor-not-allowed";

  return (
    <nav
      aria-label={t.pagination.label}
      className="mt-10 flex items-center justify-center gap-1"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className={arrowButtonActive}
          aria-label={t.pagination.previous}
        >
          ‹
        </Link>
      ) : (
        <span className={arrowButtonDisabled}>‹</span>
      )}

      {showStartEllipsis && (
        <>
          <Link
            href={pageHref(1)}
            className={`${pageButtonBase} ${pageButtonInactive}`}
          >
            1
          </Link>
          <span className="flex h-9 w-5 items-end justify-center pb-1 text-xs tracking-widest text-amber-300">
            ···
          </span>
        </>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className={`${pageButtonBase} ${pageButtonActive}`}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className={`${pageButtonBase} ${pageButtonInactive}`}
          >
            {page}
          </Link>
        ),
      )}

      {showEndEllipsis && (
        <>
          <span className="flex h-9 w-5 items-end justify-center pb-1 text-xs tracking-widest text-amber-300">
            ···
          </span>
          <Link
            href={pageHref(totalPages)}
            className={`${pageButtonBase} ${pageButtonInactive}`}
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className={arrowButtonActive}
          aria-label={t.pagination.next}
        >
          ›
        </Link>
      ) : (
        <span className={arrowButtonDisabled}>›</span>
      )}
    </nav>
  );
}
