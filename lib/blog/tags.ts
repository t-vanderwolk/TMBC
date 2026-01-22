import type { PostMeta } from "./posts";

export function extractUniqueTags(posts: PostMeta[]) {
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return [...tagSet].sort((a, b) => a.localeCompare(b));
}

export function filterPostsByTags(posts: PostMeta[], tags: string[]) {
  if (tags.length === 0) {
    return posts;
  }

  return posts.filter((post) =>
    tags.every((tag) => post.tags.includes(tag)),
  );
}
