type QuotePanelProps = {
  quote: string;
  closing: string;
};

export default function QuotePanel({ quote, closing }: QuotePanelProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-blush)]/20 px-10 py-12 text-center lg:px-14 lg:py-14">
        <span className="pointer-events-none absolute left-8 top-6 text-7xl font-serif text-[var(--tmbc-charcoal)]/10 opacity-10 select-none">
          “
        </span>
        <p className="text-lg leading-relaxed text-[var(--tmbc-charcoal)]/80">{quote}</p>
        <p className="mt-6 text-base font-semibold text-[var(--tmbc-charcoal)]">{closing}</p>
      </div>
    </div>
  );
}
