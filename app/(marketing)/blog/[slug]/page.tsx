import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, type AffiliateProduct } from '@/data/blogPosts';
import CardPlaceholder from '@/components/ui/CardPlaceholder';
import BlogPrintButton from '@/components/marketing/BlogPrintButton';
import MarkdownRenderer, { createHeadingId } from '@/components/blog/MarkdownRenderer';
import AffiliateDisclosure from '@/components/blog/affiliate/AffiliateDisclosure';
import EndOfPostRecommendations from '@/components/blog/recommendations/EndOfPostRecommendations';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.taylormadebaby.co';

type Params = {
  slug: string;
};

const getPost = (slug: string) => blogPosts.find((post) => post.slug === slug);

export const generateStaticParams = () =>
  blogPosts.map((post) => ({
    slug: post.slug,
  }));

export const generateMetadata = ({ params }: { params: Params }): Metadata => {
  const post = getPost(params.slug);
  if (!post) return {};

  const url = `${siteUrl}/blog/${post.slug}`;

  const openGraph: Metadata['openGraph'] = {
    title: post.title,
    description: post.description,
    url,
    siteName: 'Taylor-Made Baby Co.',
    type: 'article',
    publishedTime: post.date,
    authors: [post.author],
    ...(post.heroImage ? { images: [{ url: post.heroImage }] } : {}),
  };

  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    ...(post.heroImage ? { images: [post.heroImage] } : {}),
  };

  return {
    title: `${post.title} | Taylor-Made Baby Co.`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter,
  };
};

const getTableOfContents = (content: string) =>
  content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const heading = line.replace('## ', '').trim();
      const id = createHeadingId(heading);
      return { heading, id };
    });

const BlogArticlePage = ({ params }: { params: Params }) => {
  const post = getPost(params.slug);
  if (!post) notFound();

  const toc = getTableOfContents(post.content);
  const shareUrl = encodeURIComponent(`${siteUrl}/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);
  const hasAffiliateProducts = (post.affiliateProducts?.length ?? 0) > 0;
  const endProducts = post.affiliateProducts?.filter((item) => item.placement === 'end') ?? [];

  return (
    <>
      <article className="marketing-section bg-tmIvory/80">
        <div className="mx-auto space-y-12 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="relative overflow-hidden rounded-[40px] border border-tmMauve/40 bg-white/90 p-10 shadow-editorial">
            <CardPlaceholder className="absolute inset-0 h-full w-full opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-tmIvory via-white/90 to-white/70" />
            <div className="absolute -right-2 top-8 hidden text-[140px] font-playfair uppercase tracking-[0.2em] text-tmGold/20 lg:block">
              Journal
            </div>
            <div className="relative space-y-4 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.6em] text-tmCharcoal/60">Taylor-Made Journal</p>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-tmCharcoal">{post.title}</h1>
              <p className="text-base italic text-tmCharcoal/70">{post.description}</p>
              <BlogPrintButton slug={post.slug} />
              <div className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-tmCharcoal/65">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-tmMauve/40 px-3 py-1 text-[0.55rem] font-semibold text-tmCharcoal">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,240px)_1fr]">
          <aside className="tm-print-hide space-y-6 rounded-3xl border border-tmMauve/40 bg-white/90 p-6 shadow-soft">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-tmCharcoal/70">Table of Contents</p>
                <ul className="mt-4 space-y-3 text-sm text-tmCharcoal/80">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="transition hover:text-tmDeepMauve">
                        {item.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 border-t border-tmMauve/40 pt-4">
                <p className="text-xs uppercase tracking-[0.5em] text-tmCharcoal/70">Share</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                  >
                    Facebook
                  </a>
                  <a
                    href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                    className="rounded-full border border-tmMauve px-3 py-1 text-xs font-semibold text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                  >
                    Email
                  </a>
                </div>
              </div>
            </aside>

          <div className="tm-print-wrapper space-y-8 rounded-[32px] border border-tmMauve/30 bg-white/95 p-8 shadow-soft">
            <div className="tm-print-brand-mark tm-print-only">
              <p className="text-[0.7rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Taylor-Made Baby Co.</p>
              <div className="tm-print-divider" />
            </div>
            <MarkdownRenderer content={post.content} affiliates={post.affiliateProducts} />
            {endProducts.length > 0 && (
              <EndOfPostRecommendations
                products={endProducts}
                subtitle="Products we genuinely love and often recommend to families."
              />
            )}
            <div className="rounded-3xl border-l-4 border-tmGold/60 bg-tmIvory/80 px-6 py-6">
              <p className="font-playfair text-2xl uppercase tracking-[0.3em] text-tmCharcoal">
                “Taylor-Made concierge care turns preparation into a love letter for your baby.”
              </p>
            </div>
            <div className="tm-print-hide rounded-3xl border border-tmGold/40 bg-gradient-to-r from-tmMauve/70 via-tmBlush/70 to-tmIvory p-8 text-white shadow-editorial">
              <p className="text-xs uppercase tracking-[0.6em]">Need bespoke support?</p>
              <h2 className="mt-3 text-3xl">Want personalized help? Request an Invite.</h2>
              <p className="mt-2 text-sm text-white/85">
                Tap into concierge mentors, curated registry planning, and the Taylor-Made Academy tailored to your due date.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]"
              >
                Request Invite
              </Link>
            </div>
            <div className="tm-print-footer tm-print-only">
              <p className="mt-6 text-[0.75rem] uppercase tracking-[0.4em] text-tmCharcoal/60">
                Prepared with care by Taylor-Made Baby Co.
              </p>
            </div>
          </div>
        </div>

        <div className="tm-print-hide border-t border-tmMauve/30 pt-6 text-base text-tmCharcoal/70">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.5em] text-tmCharcoal">
            ← Back to Journal
          </Link>
          <p className="mt-2 max-w-3xl leading-relaxed text-base">
            Want a more guided conversation? Drop us a note and a mentor will help map every detail—registry, gear, safety checks, and the rituals that keep you steady.
          </p>
        </div>
        {hasAffiliateProducts && (
          <div className="mt-8 text-sm text-tmCharcoal/70">
            <AffiliateDisclosure />
          </div>
        )}
      </div>
    </article>
  </>
);
};

export default BlogArticlePage;
