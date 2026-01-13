import type { AffiliatePolicy } from "@/lib/blog/affiliatePolicy";

import Link from "next/link";

type AffiliateLink = {
  id: string;
  partnerName: string;
  label: string;
  position: "INLINE" | "CALLOUT" | "END_CARD";
  isPrimary: boolean;
  policy?: AffiliatePolicy;
};

export default function BlogAffiliateEndCard({ links }: { links: AffiliateLink[] }) {
  const endCardLinks = links.filter((link) => link.position === "END_CARD");
  if (!endCardLinks.length) return null;

  return (
    <section className="space-y-6 rounded-[32px] border border-tmBlush/40 bg-white/90 p-8 shadow-soft">
      <div className="space-y-2">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Taylor-Made Recommendations</p>
        <p className="font-playfair text-3xl text-tmCharcoal">Products we genuinely love.</p>
        <p className="text-sm text-tmCharcoal/70">
          Tap to explore each recommendation through our affiliate-safe redirect.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {endCardLinks.map((link) => (
          <article key={link.id} className="space-y-3 rounded-3xl border border-tmBlush/50 bg-tmIvory/60 p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-tmCharcoal/60">{link.partnerName}</p>
            <p className="text-[0.55rem] uppercase tracking-[0.35em] text-tmCharcoal/60">Curated partner pick</p>
            {link.policy?.mode === "education_only" ? (
              <p className="text-[0.6rem] text-tmCharcoal/60">Education-only resource</p>
            ) : null}
            <Link
              href={`/r/blog/${link.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tmDeepMauve"
            >
              {link.label}
            </Link>
          </article>
        ))}
      </div>
      <p className="text-[0.6rem] uppercase tracking-[0.35em] text-tmCharcoal/60">Disclosure</p>
      <p className="text-[0.65rem] leading-relaxed text-tmCharcoal/70">
        Some links are affiliate links. If you choose to use them, it helps support Taylor-Made Baby Co. at no extra
        cost to you. We only recommend products we genuinely trust.
      </p>
    </section>
  );
}
