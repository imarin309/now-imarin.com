import type { Metadata } from "next";
import { siteEmail } from "@/constants/meta";
import { getMessages } from "@/i18n/messages";

const LOCALE = "en" as const;
const t = getMessages(LOCALE);

export const metadata: Metadata = {
  title: t.contact.title,
  description: t.contact.description,
  alternates: {
    canonical: "/en/contact",
    languages: {
      ja: "/contact",
      en: "/en/contact",
    },
  },
  openGraph: {
    title: t.contact.title,
    description: t.contact.description,
  },
};

export default function EnContactPage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <div className="mb-16">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
          {t.contact.title}
        </h1>
        <p className="max-w-2xl text-amber-700">{t.contact.intro}</p>
      </div>

      <div className="flex flex-col gap-10">
        <a
          href={`mailto:${siteEmail}`}
          className="group inline-flex flex-col gap-2 border-b border-orange-100 pb-4 transition-colors hover:border-orange-400"
        >
          <span className="text-xs uppercase tracking-widest text-amber-400 transition-colors group-hover:text-orange-600">
            Email
          </span>
          <span className="text-xl tracking-wide text-amber-800 sm:text-2xl">
            {siteEmail}
          </span>
        </a>
      </div>

      <p className="mt-16 max-w-xl text-sm leading-relaxed text-amber-400">
        {t.contact.privacyNote}
      </p>
    </article>
  );
}
