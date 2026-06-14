import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function parsePost(filename: string): Post {
  const filePath = path.join(postsDir, filename);
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

function parsePage(filename: string): Page {
  const filePath = path.join(pagesDir, filename);
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
function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => !e.isDirectory() && e.name.endsWith(".mdx"))
    .map((e) => e.name);

  const subdirs = entries.filter((e) => e.isDirectory());
  for (const subdir of subdirs) {
    const subFiles = getMDXFiles(path.join(dir, subdir.name)).map((f) =>
      path.join(subdir.name, f),
    );
    files.push(...subFiles);
  }
  return files;
}

export function getAllPosts(): Post[] {
  const files = getMDXFiles(postsDir);
  return files.map(parsePost).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function getAllPages(): Page[] {
  const files = getMDXFiles(pagesDir);
  return files.map(parsePage);
}

export function getPageBySlug(slug: string): Page | undefined {
  const pages = getAllPages();
  return pages.find((p) => p.slug === slug);
}
