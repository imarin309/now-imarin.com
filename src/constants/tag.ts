export type Tag = {
  slug: string;
  name: string;
};

export const tags: Tag[] = [
  { slug: "gundam", name: "ガンダム" },
  { slug: "gundam-seed", name: "ガンダムSEED" },
  { slug: "gundam-w", name: "ガンダムW" },
  { slug: "gquuuuuux", name: "GQuuuuuuX" },
  { slug: "code-geass", name: "コードギアス" },
  { slug: "fgo", name: "FGO" },
  { slug: "pokemon", name: "ポケモン" },
  { slug: "seiken-densetsu", name: "聖剣伝説" },
  { slug: "kiseki", name: "軌跡" },
  { slug: "gunvolt", name: "ガンヴォルト" },
  { slug: "youzitsu", name: "よう実" },
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
export function getTagName(slug: string): string {
  const tag = getTagBySlug(slug);
  return tag?.name ?? slug;
}
