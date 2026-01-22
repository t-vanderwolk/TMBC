import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { AffiliateLink } from "@/components/blog/AffiliateLink";
import { getPostBySlug } from "@/lib/blog/posts";
import { getBlogPostMetadata } from "@/lib/blog/seo";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return getBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="space-y-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">
            TMBC Journal
          </p>
          <h1 className="text-4xl font-semibold text-foreground">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{post.readTime} min read</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
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
        </header>

        <section className="space-y-6 text-foreground [&_a]:text-indigo-600 [&_a]:underline [&_p]:text-foreground/80">
          <MDXRemote
            source={post.mdxSource}
            components={{
              AffiliateLink,
            }}
          />
        </section>
      </article>

      <footer className="mt-12 rounded-2xl border border-foreground/10 bg-foreground/5 p-6 text-sm text-foreground/80">
        <p className="text-base font-semibold text-foreground">
          Want help making sense of baby gear?
        </p>
        <p className="mt-2">
          Join the TMBC list. We send calm, honest takes on registry favorites
          and thoughtful affiliate finds.
        </p>
        <AffiliateLink
          href="https://taylor-made-baby-co.com/newsletter"
          className="mt-3 inline-flex text-sm font-semibold text-indigo-600"
        >
          Join the list
        </AffiliateLink>
      </footer>
    </main>
  );
}
