"use client";

const PlaceholderImageCard = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-white/80 p-6 shadow-[0_20px_65px_rgba(199,166,199,0.3)]">
    <div className="h-40 w-full rounded-[28px] bg-gradient-to-br from-[var(--tmbc-blush)] via-[var(--tmbc-ivory)] to-[var(--tmbc-mauve)] shadow-inner" />
    <p className="mt-4 text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">{title}</p>
    {subtitle && <p className="text-sm text-[var(--tmbc-charcoal)]/70">{subtitle}</p>}
  </div>
);

export default PlaceholderImageCard;
