import Link from 'next/link';

import PlaceholderImageCard from '@/components/marketing/PlaceholderImageCard';
import { blogPosts } from '@/data/blogPosts';

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const featuredPost = sortedPosts[0];
const otherPosts = sortedPosts.slice(1);

const BlogMarketingPage = () => {
  if (!featuredPost) {
    return (
      <section className="marketing-section text-center text-base text-[var(--tmbc-charcoal)] text-opacity-70">
        <p>No journal entries are available yet.</p>
      </section>
    );
  }

  return (
    <section className="marketing-section space-y-10">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-[var(--tmbc-charcoal)] text-opacity-60">Taylor-Made Journal</p>
        <h1 className="font-playfair text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
          Low-stress stories from the nursery floor
        </h1>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Mentor essays, gear guides, and real chat that keeps you calm, curious, and ready for the next chapter.
        </p>
      </header>

      <article className="mx-auto grid grid-cols-1 gap-6 overflow-hidden rounded-[40px] border border-tmMauve/40 bg-tmIvory shadow-editorial transition duration-300 hover:-translate-y-0.5 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="marketing-media relative min-h-[320px] flex-1">
          <PlaceholderImageCard className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-br from-tmGold/20 via-tmIvory/80 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            <span>
              {new Date(featuredPost.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{featuredPost.readTime}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            {featuredPost.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-tmBlush/70 px-3 py-1 font-semibold text-[0.55rem] tracking-[0.3em] text-tmCharcoal">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">{featuredPost.title}</h2>
          <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80">{featuredPost.description}</p>
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em] text-center sm:text-left"
          >
            Read the story
          </Link>
        </div>
      </article>

      <section className="space-y-6 marketing-section">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {otherPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] border border-tmMauve/30 bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <div className="h-36 rounded-[28px] bg-gradient-to-br from-tmMauve/30 via-tmBlush/70 to-tmIvory" />
                <h3 className="font-playfair text-xl sm:text-2xl text-[var(--tmbc-charcoal)]">{post.title}</h3>
                <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-75">{post.description}</p>
                <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-tmBlush/70 px-3 py-1 text-[0.55rem] font-semibold text-[var(--tmbc-charcoal)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-tmMauve/40 pt-4 text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold">
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default BlogMarketingPage;
