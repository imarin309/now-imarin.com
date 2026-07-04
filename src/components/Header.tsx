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
  return isLocale(segment) ? getLocalePathPrefix(locale) : "/";
}

export default function Header({
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
    <header className="relative w-full">
      <picture>
        <source
          media="(min-width: 640px)"
          srcSet="https://assets.now-imarin.com/meta/header-pc.webp"
        />
        <img
          src="https://assets.now-imarin.com/meta/header-mobile.webp"
          alt={t.siteName}
          fetchPriority="high"
          className="h-auto w-full"
        />
      </picture>
      <div className="absolute inset-0 bg-orange-950/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Link
            href={currentPathPrefix}
            className="text-2xl font-bold tracking-wider text-white drop-shadow-lg transition-opacity hover:opacity-80 sm:text-3xl"
          >
            {t.siteName}
          </Link>
          <p className="mt-1 text-sm tracking-wide text-orange-100 drop-shadow sm:text-base">
            {t.siteCatchCopy}
          </p>
        </div>
      </div>
    </header>
  );
}
