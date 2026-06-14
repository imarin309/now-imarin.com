import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getPageBySlug } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug("privacy-policy");

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: "/privacy-policy",
    },
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default function PrivacyPage() {
  const page = getPageBySlug("privacy-policy");

  if (!page) {
    notFound();
  }

  const MDXContent = dynamic(() => import("../../../content/pages/privacy-policy.mdx"));

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
