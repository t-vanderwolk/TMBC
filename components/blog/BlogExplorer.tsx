"use client";

import { useMemo, useState } from "react";

import { BlogCard } from "@/components/blog/BlogCard";
import { TagFilter } from "@/components/blog/TagFilter";
import type { PostMeta } from "@/lib/blog/posts";
import { filterPostsByTags } from "@/lib/blog/tags";

type BlogExplorerProps = {
  posts: PostMeta[];
  tags: string[];
};

export function BlogExplorer({ posts, tags }: BlogExplorerProps) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const visiblePosts = useMemo(
    () => filterPostsByTags(posts, activeTags),
    [activeTags, posts],
  );

  return (
    <div className="space-y-6">
      <TagFilter
        availableTags={tags}
        activeTags={activeTags}
        onChange={setActiveTags}
      />
      {visiblePosts.length === 0 ? (
        <p className="text-sm text-foreground/60">
          No posts match that combination of tags yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
