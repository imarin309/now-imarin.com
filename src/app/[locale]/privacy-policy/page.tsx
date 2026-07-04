import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/posts";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";

type LocaleStaticPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales
    .filter((locale) => getPageBySlug("privacy-policy", locale))
    .map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleStaticPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const page = getPageBySlug("privacy-policy", locale);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locale}/privacy-policy`,
      languages: {
        ja: "/ja/privacy-policy",
        en: "/en/privacy-policy",
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

async function importPage(locale: Locale) {
  if (locale === defaultLocale) {
    return import(`../../../../content/pages/privacy-policy.mdx`);
  }
  return import(`../../../../content/pages/${locale}/privacy-policy.mdx`);
}

export default async function LocalePrivacyPage({
  params,
}: LocaleStaticPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const page = getPageBySlug("privacy-policy", locale);
  if (!page) notFound();

  const { default: MDXContent } = (await importPage(locale)) as {
    default: React.ComponentType;
  };

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-orange-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-amber-900 sm:text-3xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="mt-4 text-amber-600">{page.description}</p>
        )}
      </header>

      <div className="prose prose-amber max-w-none prose-headings:font-semibold prose-a:text-orange-600 prose-a:underline-offset-2 hover:prose-a:text-orange-800">
        <MDXContent />
      </div>
    </article>
  );
}
