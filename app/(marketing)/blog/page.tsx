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
      <div className="section-wrap space-y-10 py-12">
        <p className="text-center text-sm text-tmCharcoal/60">No journal entries are available yet.</p>
      </div>
    );
  }

  return (
    <div className="section-wrap space-y-10 py-12">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-tmCharcoal/60">Taylor-Made Journal</p>
        <h1 className="font-playfair text-4xl text-tmCharcoal sm:text-5xl">Low-stress stories from the nursery floor</h1>
        <p className="text-sm text-tmCharcoal/70 sm:text-base">
          Mentor essays, gear guides, and real chat that keeps you calm, curious, and ready for the next chapter.
        </p>
      </header>

      <section className="space-y-6">
        <article className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[40px] border border-tmMauve/40 bg-tmIvory shadow-editorial transition duration-300 hover:-translate-y-0.5 sm:flex-row">
          <div className="relative min-h-[320px] flex-1">
            <PlaceholderImageCard className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-br from-tmGold/20 via-tmIvory/80 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col gap-6 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmCharcoal/60">
              <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{featuredPost.readTime}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
              {featuredPost.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-tmBlush/70 px-3 py-1 font-semibold text-[0.55rem] tracking-[0.3em] text-tmCharcoal">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-playfair text-3xl text-tmCharcoal sm:text-4xl">{featuredPost.title}</h2>
            <p className="text-base leading-relaxed text-tmCharcoal/80">{featuredPost.description}</p>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="mt-auto inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.4em] text-tmCharcoal transition hover:text-tmDeepMauve"
            >
              Read the story
              <span aria-hidden>→</span>
            </Link>
          </div>
        </article>

        <div className="grid gap-6 md:grid-cols-2">
          {otherPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] border border-tmMauve/30 bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-tmCharcoal/50">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="h-36 rounded-[28px] bg-gradient-to-br from-tmMauve/30 via-tmBlush/70 to-tmIvory" />
                <h3 className="font-playfair text-2xl text-tmCharcoal">{post.title}</h3>
                <p className="text-sm leading-relaxed text-tmCharcoal/75">{post.description}</p>
                <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-tmBlush/70 px-3 py-1 text-[0.55rem] font-semibold text-tmCharcoal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-tmMauve/40 pt-4 text-sm uppercase tracking-[0.4em] text-tmCharcoal">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold">
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogMarketingPage;
