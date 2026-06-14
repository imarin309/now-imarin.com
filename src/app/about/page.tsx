import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug("about");

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function AboutPage() {
  const page = getPageBySlug("about");

  if (!page) {
    notFound();
  }

  const { default: MDXContent } =
    (await import("../../../content/pages/about.mdx")) as {
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
