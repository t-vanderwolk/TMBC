import Link from 'next/link';

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  ctaLabel: string;
  ctaHref: string;
  featuredModule?: string;
};

const EditorialHero = ({
  eyebrow,
  title,
  description,
  highlight,
  ctaLabel,
  ctaHref,
  featuredModule,
}: EditorialHeroProps) => (
  <section className="tm-paper-texture tm-soft-fade rounded-[40px] border border-[var(--tm-blush)] bg-gradient-to-br from-[var(--tm-ivory)] via-[var(--tm-blush)] to-white/80 p-4">
    <div className="tm-editorial-card grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">{eyebrow}</p>
        <h1 className="tm-serif-title text-4xl md:text-5xl leading-tight">{title}</h1>
        <p className="text-lg leading-relaxed text-[var(--tm-charcoal)]/75">{description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition hover:bg-white"
          >
            {ctaLabel}
            <span aria-hidden="true" className="text-[var(--tm-gold)]">
              &rarr;
            </span>
          </Link>
          {featuredModule && (
            <span className="tm-gold-bracket text-[0.6rem] uppercase tracking-[0.6em] text-[var(--tm-deep-mauve)]">
              {featuredModule}
            </span>
          )}
        </div>
      </div>
      <div className="relative rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-inner">
        <div className="flex flex-col gap-2">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Studio signal</p>
          <p className="text-sm text-[var(--tm-charcoal)]/80 leading-relaxed">{highlight}</p>
          <div className="mt-5">
            <div className="tm-section-divider" aria-hidden="true" />
            <p className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
              Atelier whispers
            </p>
            <p className="text-sm text-[var(--tm-deep-mauve)]">Soft textures, hands-on rituals, and new modules every week.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default EditorialHero;
