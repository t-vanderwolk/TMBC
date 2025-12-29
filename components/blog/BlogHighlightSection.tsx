import Link from "next/link";

type HighlightProduct = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
};

type BlogHighlight = {
  id: string;
  productId: string | null;
  brandName: string | null;
  note: string;
  product: HighlightProduct | null;
};

export default function BlogHighlightSection({ highlights }: { highlights: BlogHighlight[] }) {
  if (!highlights.length) return null;

  return (
    <section className="space-y-6 rounded-[32px] border border-tmMauve/30 bg-white/95 p-8 shadow-soft">
      <div className="space-y-2">
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-tmCharcoal/60">
          Mentor highlights
        </p>
        <h2 className="font-playfair text-2xl text-tmCharcoal">Reference-only options</h2>
        <p className="text-sm text-tmCharcoal/70">
          These references are shared for context, not a buying list.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {highlights.map((highlight) => (
          <article
            key={highlight.id}
            className="space-y-3 rounded-3xl border border-tmBlush/50 bg-tmIvory/60 p-6"
          >
            <div className="space-y-1">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                {highlight.brandName || highlight.product?.brand || "Canon reference"}
              </p>
              <p className="text-lg font-semibold text-tmCharcoal">
                {highlight.product?.name || highlight.brandName || "Brand reference"}
              </p>
              {highlight.product?.category ? (
                <p className="text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
                  {highlight.product.category}
                </p>
              ) : null}
            </div>
            <p className="text-sm text-tmCharcoal/75">{highlight.note}</p>
            <div className="flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
              <span className="rounded-full border border-tmMauve/40 px-3 py-1">Reference only</span>
              <span className="rounded-full border border-tmMauve/40 px-3 py-1">Mentor context</span>
            </div>
            <Link
              href={`/r/blog/highlight/${highlight.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tmDeepMauve"
            >
              Open reference
            </Link>
          </article>
        ))}
      </div>
      <div className="space-y-2 text-[0.65rem] text-tmCharcoal/70">
        <p className="uppercase tracking-[0.35em] text-tmCharcoal/60">Disclosure</p>
        <p>
          Links are routed through our admin-owned redirect when available. We do not add prices or sales prompts, and
          mentors do not see affiliate details.
        </p>
      </div>
    </section>
  );
}
