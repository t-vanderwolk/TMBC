import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";

type BlogCardProps = {
  post: PostMeta;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-foreground/10 px-6 py-5 transition hover:border-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60"
      aria-label={`Read post ${post.title}`}
    >
      <div className="flex items-center justify-between text-sm text-foreground/80">
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span>{post.readTime} min read</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-foreground/90">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-foreground/70">{post.excerpt}</p>
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/30 px-3 py-1 text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
