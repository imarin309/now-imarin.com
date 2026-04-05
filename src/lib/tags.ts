import { posts } from "#site/content";

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet);
}
