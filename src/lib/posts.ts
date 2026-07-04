import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  description?: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags?: string[];
  noindex?: boolean;
};

export type Page = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  body: string;
};

const postsDir = path.join(process.cwd(), "content/posts");
const pagesDir = path.join(process.cwd(), "content/pages");

function getLocalizedContentDir(baseDir: string, locale: Locale): string {
  if (locale === defaultLocale) return baseDir;

  const localizedDir = path.join(baseDir, locale);
  if (fs.existsSync(localizedDir)) return localizedDir;
  return localizedDir;
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function getExcerpt(content: string): string {
  return content
    .replace(/<[^>]*>/g, "") // HTMLタグ除去
    .replace(/[#*`]/g, "") // Markdown記号除去
    .replace(/\n/g, " ") // 改行をスペースに
    .trim()
    .slice(0, 120);
}

function parsePost(filename: string, locale: Locale): Post {
  const filePath = path.join(
    getLocalizedContentDir(postsDir, locale),
    filename,
  );
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const slug = filename.replace(/\.mdx$/, "");

  if (!data.title || !data.date || !data.category) {
    throw new Error(`Missing required fields in ${filename}`);
  }

  return {
    slug,
    title: data.title,
    date: normalizeDate(data.date),
    category: data.category,
    description: data.description,
    excerpt: data.description || getExcerpt(content),
    body: content,
    coverImage: data.coverImage,
    tags: data.tags || [],
    noindex: data.noindex || false,
  };
}

function parsePage(filename: string, locale: Locale): Page {
  const filePath = path.join(
    getLocalizedContentDir(pagesDir, locale),
    filename,
  );
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const slug = filename.replace(/\.mdx$/, "");

  if (!data.title || !data.date) {
    throw new Error(`Missing required fields in ${filename}`);
  }

  return {
    slug,
    title: data.title,
    date: normalizeDate(data.date),
    description: data.description,
    body: content,
  };
}

// フォルダ内を再帰的に検索してMDXファイルを取得する
// excludeDirs: ロケール別サブディレクトリ（例: en/）を誤って別ロケールの記事として
// 拾わないよう、走査対象から除外するディレクトリ名
function getMDXFiles(dir: string, excludeDirs: string[] = []): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => !e.isDirectory() && e.name.endsWith(".mdx"))
    .map((e) => e.name);

  const subdirs = entries.filter(
    (e) => e.isDirectory() && !excludeDirs.includes(e.name),
  );
  for (const subdir of subdirs) {
    const subFiles = getMDXFiles(path.join(dir, subdir.name)).map((f) =>
      path.join(subdir.name, f),
    );
    files.push(...subFiles);
  }
  return files;
}

const otherLocaleDirs = locales.filter((locale) => locale !== defaultLocale);

export function getAllPosts(locale: Locale = defaultLocale): Post[] {
  const dir = getLocalizedContentDir(postsDir, locale);
  const excludeDirs = locale === defaultLocale ? otherLocaleDirs : [];
  const files = getMDXFiles(dir, excludeDirs);
  return files
    .map((file) => parsePost(file, locale))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Post | undefined {
  const posts = getAllPosts(locale);
  return posts.find((p) => p.slug === slug);
}

// hreflang用: 指定slugの記事が実際に存在する（noindexでない）ロケール一覧を返す
export function getAvailablePostLocales(slug: string): Locale[] {
  return locales.filter((locale) => {
    const post = getPostBySlug(slug, locale);
    return !!post && !post.noindex;
  });
}

export function getAllPages(locale: Locale = defaultLocale): Page[] {
  const dir = getLocalizedContentDir(pagesDir, locale);
  const files = getMDXFiles(dir);
  return files.map((file) => parsePage(file, locale));
}

export function getPageBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Page | undefined {
  const pages = getAllPages(locale);
  return pages.find((p) => p.slug === slug);
}
