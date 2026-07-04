import {
  defaultLocale,
  getLocalePathPrefix,
  isLocale,
  type Locale,
} from "./config";

export function getCurrentLocale(pathname: string, fallback: Locale): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : fallback;
}

export function getPathPrefix(pathname: string, locale: Locale): string {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? getLocalePathPrefix(locale) : "";
}

export function getPathForLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (locale === defaultLocale) {
    if (isLocale(firstSegment)) {
      const pathWithoutLocale = `/${segments.slice(2).join("/")}`;
      return pathWithoutLocale === "/"
        ? "/"
        : pathWithoutLocale.replace(/\/$/, "");
    }
    return pathname;
  }

  if (isLocale(firstSegment)) {
    segments[1] = locale;
    return segments.join("/") || getLocalePathPrefix(locale);
  }

  if (pathname === "/") {
    return getLocalePathPrefix(locale);
  }

  return `${getLocalePathPrefix(locale)}${pathname}`;
}
