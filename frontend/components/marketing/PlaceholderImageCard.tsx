type PlaceholderImageCardProps = {
  className?: string;
};

const PlaceholderImageCard = ({ className = '' }: PlaceholderImageCardProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[var(--tmbc-mauve)] bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)] ${className}`}
    >
      <div className="flex aspect-[16/9] items-center justify-center px-4 text-center text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">
        TMBC Image Placeholder
      </div>
    </div>
  );
};

export default PlaceholderImageCard;
