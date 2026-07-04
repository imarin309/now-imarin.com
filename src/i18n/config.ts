export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export const localeLabels: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
};

export const localeMeta: Record<
  Locale,
  {
    htmlLang: string;
    openGraphLocale: string;
    dateLocale: string;
    rssLanguage: string;
  }
> = {
  ja: {
    htmlLang: "ja",
    openGraphLocale: "ja_JP",
    dateLocale: "ja-JP",
    rssLanguage: "ja",
  },
  en: {
    htmlLang: "en",
    openGraphLocale: "en_US",
    dateLocale: "en-US",
    rssLanguage: "en",
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalePathPrefix(locale: Locale): string {
  return `/${locale}`;
}

export function getLocalizedPath(locale: Locale, path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getLocalePathPrefix(locale)}${normalizedPath === "/" ? "" : normalizedPath}`;
}
