import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { blogPosts } from '@/data/blogPosts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.taylormadebaby.co';

export const generateMetadata = async (): Promise<Metadata> => {
  const title = 'Taylor-Made Baby Co. Blog | Concierge Pregnancy Guides & Gear Reviews';
  const description =
    'Curated baby gear guides, nursery inspiration, and concierge-level pregnancy tips from the Taylor-Made Baby Co. mentor team.';

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog`,
      siteName: 'Taylor-Made Baby Co.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
};

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

const BlogIndexPage = () => {
  return (
    <section className="section-wrap space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.6em] text-tmMauve">Journal</p>
        <h1 className="text-4xl text-tmCharcoal">Taylor-Made Baby Co. Blog</h1>
        <p className="text-base text-tmCharcoal/80">
          Expert-written guides blending concierge wisdom with real-life baby gear, nursery styling,
          and postpartum support.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {sortedPosts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col overflow-hidden rounded-3xl border border-tmBlush/50 bg-white/90 shadow-soft transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(199,166,199,0.25)]"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-tmMauve">
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-tmCharcoal/60">•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl text-tmCharcoal">{post.title}</h2>
              <p className="text-sm text-tmCharcoal/80">{post.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-tmCharcoal/70">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-tmBlush/60 px-3 py-1 font-semibold tracking-[0.2em] text-tmCharcoal">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex justify-end">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-white"
                >
                  Read More
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogIndexPage;
