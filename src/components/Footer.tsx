"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  defaultLocale,
  getLocalePathPrefix,
  isLocale,
  type Locale,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

function getCurrentLocale(pathname: string, fallback: Locale): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : fallback;
}

function getPathPrefix(pathname: string, locale: Locale): string {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? getLocalePathPrefix(locale) : "";
}

export default function Footer({
  locale = defaultLocale,
  pathPrefix,
}: {
  locale?: Locale;
  pathPrefix?: string;
}) {
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname, locale);
  const currentPathPrefix =
    pathPrefix ?? getPathPrefix(pathname, currentLocale);
  const t = getMessages(currentLocale);

  return (
    <footer className="mt-auto border-t border-orange-100 bg-orange-950 py-6 text-center">
      <Link
        href={`${currentPathPrefix}/privacy-policy`}
        className="text-xs text-orange-400 underline transition-colors hover:text-orange-200"
      >
        {t.footer.privacyPolicy}
      </Link>
      <p className="mt-2 text-sm text-orange-300">
        &copy; {new Date().getFullYear()} {t.siteName}
      </p>
    </footer>
  );
}
