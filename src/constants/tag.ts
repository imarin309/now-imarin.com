import { defaultLocale, type Locale } from "@/i18n/config";

export type Tag = {
  slug: string;
  names: Record<Locale, string>;
};

export const tags: Tag[] = [
  { slug: "gundam", names: { ja: "ガンダム", en: "Gundam" } },
  { slug: "gundam-seed", names: { ja: "ガンダムSEED", en: "Gundam SEED" } },
  { slug: "gundam-w", names: { ja: "ガンダムW", en: "Gundam Wing" } },
  { slug: "gquuuuuux", names: { ja: "GQuuuuuuX", en: "GQuuuuuuX" } },
  { slug: "code-geass", names: { ja: "コードギアス", en: "Code Geass" } },
  { slug: "fgo", names: { ja: "FGO", en: "FGO" } },
  { slug: "pokemon", names: { ja: "ポケモン", en: "Pokemon" } },
  {
    slug: "seiken-densetsu",
    names: { ja: "聖剣伝説", en: "Mana Series" },
  },
  { slug: "kiseki", names: { ja: "軌跡", en: "Trails" } },
  { slug: "gunvolt", names: { ja: "ガンヴォルト", en: "Gunvolt" } },
  { slug: "youzitsu", names: { ja: "よう実", en: "Classroom of the Elite" } },
  { slug: "zanadu", names: { ja: "ザナドゥ", en: "Xanadu" } },
];

/**
 * 全タグを取得
 */
export function getAllTags(): Tag[] {
  return tags;
}

/**
 * slugからタグを取得
 */
export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((tag) => tag.slug === slug);
}

/**
 * slugから表示名を取得（見つからない場合はslugをそのまま返す）
 */
export function getTagName(
  slug: string,
  locale: Locale = defaultLocale,
): string {
  const tag = getTagBySlug(slug);
  return tag?.names[locale] ?? slug;
}
