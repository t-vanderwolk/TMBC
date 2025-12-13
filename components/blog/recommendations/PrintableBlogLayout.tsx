import type { BlogPost } from '@/data/blogPosts';

import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import AffiliateDisclosure from '@/components/blog/affiliate/AffiliateDisclosure';
import EndOfPostRecommendations from '@/components/blog/recommendations/EndOfPostRecommendations';

import PrintTrigger from './PrintTrigger';

type PrintableBlogLayoutProps = {
  post: BlogPost;
};

export default function PrintableBlogLayout({ post }: PrintableBlogLayoutProps) {
  const endProducts = post.affiliateProducts?.filter((item) => item.placement === 'end') ?? [];
  const hasAffiliates = (post.affiliateProducts?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-white text-tmCharcoal">
      <PrintTrigger />
      <article className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <header className="space-y-3 border-b border-tmBlush/40 pb-6 text-center">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-tmCharcoal/60">Taylor-Made Journal</p>
          <h1 className="font-playfair text-4xl text-tmCharcoal">{post.title}</h1>
          {post.description && <p className="text-sm text-tmCharcoal/75">{post.description}</p>}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/65">
            {post.author && <span>{post.author}</span>}
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <section className="space-y-10">
          <MarkdownRenderer content={post.content} affiliates={post.affiliateProducts} />
        </section>

        {endProducts.length > 0 && (
          <EndOfPostRecommendations
            products={endProducts}
            subtitle="Products we genuinely love and often recommend to families."
          />
        )}

        {hasAffiliates && (
          <div className="border-t border-tmBlush/30 pt-6 text-[0.65rem] text-tmCharcoal/70">
            <AffiliateDisclosure />
          </div>
        )}
      </article>
    </div>
  );
}
