import type { AffiliateProduct } from '@/data/blogPosts';

type AffiliateInlineLinkProps = {
  product: AffiliateProduct;
};

export default function AffiliateInlineLink({ product }: AffiliateInlineLinkProps) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Taylor-Made Pick: ${product.title}. ${product.description}`}
      className="inline-flex items-baseline gap-1 text-tmDeepMauve text-[0.9rem] font-semibold uppercase tracking-[0.3em] underline decoration-tmBlush/60 underline-offset-2 transition hover:text-tmCharcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tmDeepMauve"
    >
      {product.title}
    </a>
  );
}
