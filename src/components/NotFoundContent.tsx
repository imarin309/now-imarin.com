import Link from "next/link";
import { defaultLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default function NotFoundContent({
  locale = defaultLocale,
  pathPrefix = "",
}: {
  locale?: Locale;
  pathPrefix?: string;
}) {
  const t = getMessages(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="text-8xl font-bold text-stone-300">404</p>
      <h1 className="mt-4 text-2xl font-medium text-foreground">
        {t.notFound.title}
      </h1>
      <p className="mt-2 text-secondary">{t.notFound.description}</p>
      <Link
        href={pathPrefix || "/"}
        className="mt-8 rounded-md bg-stone-700 px-6 py-2 text-sm text-stone-100 transition-colors hover:bg-stone-600"
      >
        {t.notFound.backHome}
      </Link>
    </div>
  );
}
