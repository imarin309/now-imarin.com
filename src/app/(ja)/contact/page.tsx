import type { Metadata } from "next";
import { siteEmail } from "@/constants/meta";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "今を生きるへのお問い合わせはこちらから。",
  alternates: {
    canonical: "/contact",
    languages: {
      ja: "/contact",
      en: "/en/contact",
    },
  },
  openGraph: {
    title: "お問い合わせ",
    description: "今を生きるへのお問い合わせはこちらから。",
  },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <div className="mb-16">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
          お問い合わせ
        </h1>
        <p className="max-w-2xl text-amber-700">
          ご質問・ご感想はメールからお気軽にどうぞ。
        </p>
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
        いただいた個人情報は、ご連絡・対応の目的にのみ使用し、第三者への提供は行いません。
      </p>
    </article>
  );
}
