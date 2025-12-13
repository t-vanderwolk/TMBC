import type { AffiliateProduct } from '@/data/blogPosts';

type AffiliateCalloutProps = {
  product: AffiliateProduct;
};

export default function AffiliateCallout({ product }: AffiliateCalloutProps) {
  return (
    <div className="rounded-[32px] border border-tmBlush/60 bg-tmIvory/80 p-6 shadow-soft">
      <p className="text-[0.6rem] uppercase tracking-[0.45em] text-tmCharcoal/60">Taylor-Made Pick</p>
      <h3 className="mt-3 font-playfair text-2xl text-tmCharcoal">{product.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-tmCharcoal/80">{product.description}</p>
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-full border border-tmMauve/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tmDeepMauve"
      >
        View Details
      </a>
    </div>
  );
}
