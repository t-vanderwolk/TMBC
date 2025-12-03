import Link from 'next/link';

import PlaceholderImageCard from '@/components/marketing/PlaceholderImageCard';
import { blogPosts } from '@/data/blogPosts';

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const BlogMarketingPage = () => {
  return (
    <div className="space-y-12 section-wrap">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">TMBC Journal</p>
        <h1 className="font-serif text-4xl text-[var(--tmbc-charcoal)]">Low-stress stories from the nursery floor</h1>
        <p className="text-sm text-[var(--tmbc-charcoal)]/80">
          Mentor essays, gear guides, and real chat that keeps you calm and curious. No curated stock photos—just honest, soft words.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="flex flex-col overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)] bg-white/80 shadow-soft">
            <PlaceholderImageCard className="w-full" />
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/70">
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl text-[var(--tmbc-charcoal)]">{post.title}</h2>
              <p className="text-sm text-[var(--tmbc-charcoal)]/80">{post.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--tmbc-charcoal)]/70">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--tmbc-blush)] px-3 py-1 font-semibold tracking-[0.2em]">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]"
              >
                Read the guide
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogMarketingPage;
