type FeatureCardProps = {
  title: string;
  description: string;
  meta?: string;
};

const FeatureCard = ({ title, description, meta }: FeatureCardProps) => {
  return (
    <article className="flex flex-col gap-4 rounded-[20px] border border-[rgba(62,47,53,0.12)] bg-white/95 p-6 text-[var(--tmbc-charcoal)] transition-colors duration-200 hover:border-[var(--tmbc-mauve)]/30">
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 rounded-xl border border-[rgba(62,47,53,0.15)] bg-[var(--tmbc-mauve)]/20" aria-hidden />
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
          {meta && <p className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-60">{meta}</p>}
        </div>
      </div>
      <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-80">{description}</p>
    </article>
  );
};

export default FeatureCard;
