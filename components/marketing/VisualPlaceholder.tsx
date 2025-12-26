type VisualPlaceholderProps = {
  label: string;
  className?: string;
  minHeightClassName?: string;
};

const VisualPlaceholder = ({
  label,
  className = "",
  minHeightClassName = "min-h-[240px]",
}: VisualPlaceholderProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[var(--tmbc-mauve)] bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)] ${className}`}
    >
      <div
        className={`flex ${minHeightClassName} items-center justify-center px-6 text-center text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70`}
      >
        {label}
      </div>
    </div>
  );
};

export default VisualPlaceholder;
