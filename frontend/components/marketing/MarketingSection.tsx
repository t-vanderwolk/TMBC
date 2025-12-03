import type { ReactNode } from 'react';

type MarketingSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const MarketingSection = ({ title, subtitle, children }: MarketingSectionProps) => {
  return (
    <section className="rounded-3xl border-l-4 border-[var(--tmbc-mauve)] bg-white/80 p-6 shadow-soft">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">{title}</p>
        {subtitle && <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">{subtitle}</h2>}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
};

export default MarketingSection;
