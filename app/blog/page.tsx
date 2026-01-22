import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { getAllPosts } from "@/lib/blog/posts";
import { extractUniqueTags } from "@/lib/blog/tags";
import { getBlogIndexMetadata } from "@/lib/blog/seo";

export const metadata = getBlogIndexMetadata();

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = extractUniqueTags(posts);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-10 space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
          Taylor-Made Baby Co.
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-foreground">
          TMBC Journal
        </h1>
        <p className="text-lg text-foreground/70">
          Essays on gear, routines, and the kind of education modern parents
          actually use.
        </p>
      </section>

      <BlogExplorer posts={posts} tags={tags} />
    </main>
  );
}
