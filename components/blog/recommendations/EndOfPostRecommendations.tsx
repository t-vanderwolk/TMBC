type AffiliateProduct = {
  title: string;
  description: string;
  affiliateUrl: string;
  brand?: string;
};

type EndOfPostRecommendationsProps = {
  products: AffiliateProduct[];
  subtitle?: string;
};

export default function EndOfPostRecommendations({ products, subtitle }: EndOfPostRecommendationsProps) {
  if (!products.length) return null;

  return (
    <section className="space-y-6 rounded-[32px] border border-tmBlush/40 bg-white/90 p-8 shadow-soft">
      <div className="space-y-2">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Taylor-Made Recommendations</p>
        <p className="font-playfair text-3xl text-tmCharcoal">Products we genuinely love.</p>
        {subtitle && <p className="text-sm text-tmCharcoal/70">{subtitle}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <article key={product.title} className="space-y-2 rounded-3xl border border-tmBlush/50 bg-tmIvory/60 p-6">
            {product.brand && (
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-tmCharcoal/60">{product.brand}</p>
            )}
            <h3 className="font-playfair text-2xl text-tmCharcoal">{product.title}</h3>
            <p className="text-sm leading-relaxed text-tmCharcoal/80">{product.description}</p>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tmDeepMauve"
            >
              View Details
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
