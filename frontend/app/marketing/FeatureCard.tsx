type FeatureCardProps = {
  title: string;
  description: string;
  meta?: string;
};

const FeatureCard = ({ title, description, meta }: FeatureCardProps) => {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[var(--tmbc-ivory)] bg-white/80 p-6 text-[var(--tmbc-charcoal)] shadow-sm transition hover:-translate-y-1 hover:bg-[var(--tmbc-blush)] hover:shadow-[0_25px_60px_rgba(199,166,199,0.25)]">
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 rounded-xl border border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/20" aria-hidden />
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          {meta && <p className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">{meta}</p>}
        </div>
      </div>
      <p className="text-sm text-[var(--tmbc-charcoal)]/80">{description}</p>
    </article>
  );
};

export default FeatureCard;
