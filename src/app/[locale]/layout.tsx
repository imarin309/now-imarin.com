import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { siteUrl } from "@/constants/meta";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const t = getMessages(locale);

  return {
    title: {
      default: t.siteName,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ja: `${siteUrl}/ja`,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      siteName: t.siteName,
      locale: localeMeta[locale].openGraphLocale,
      title: {
        default: t.siteName,
        template: `%s | ${t.siteName}`,
      },
      description: t.siteDescription,
    },
    twitter: {
      title: {
        default: t.siteName,
        template: `%s | ${t.siteName}`,
      },
      description: t.siteDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return children;
}
