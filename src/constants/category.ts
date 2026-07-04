import { defaultLocale, type Locale } from "@/i18n/config";

export type Category = {
  slug: string;
  names: Record<Locale, string>;
};

export const categories: Category[] = [
  { slug: "anime", names: { ja: "アニメ", en: "Anime" } },
  { slug: "game", names: { ja: "ゲーム", en: "Game" } },
  { slug: "other", names: { ja: "その他", en: "Other" } },
];

/**
 * 全カテゴリーを取得
 */
export function getAllCategories(): Category[] {
  return categories;
}

/**
 * slugからカテゴリーを取得
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

/**
 * slugから表示名を取得（見つからない場合はslugをそのまま返す）
 */
export function getCategoryName(
  slug: string,
  locale: Locale = defaultLocale,
): string {
  const category = getCategoryBySlug(slug);
  return category?.names[locale] ?? slug;
}
