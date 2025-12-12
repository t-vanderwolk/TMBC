'use client';

type AdminCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  accent?: 'mauve' | 'gold' | 'charcoal';
  badge?: string;
};

const badgeStyles = {
  mauve: 'border-tmMauve text-tmDeepMauve bg-tmMauve/20',
  gold: 'border-tmGold text-tmCharcoal bg-tmGold/20',
  charcoal: 'border-tmCharcoal text-white bg-tmCharcoal/70',
};

export default function AdminCard({ title, value, subtitle, description, accent = 'mauve', badge }: AdminCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-tmBlush/60 bg-gradient-to-br from-white/80 via-tmBlush/50 to-tmIvory p-5 shadow-soft transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{title}</p>
        {badge && (
          <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${badgeStyles[accent]}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-3xl font-serif text-tmCharcoal">{value}</p>
      {subtitle && <p className="text-sm text-tmCharcoal/70">{subtitle}</p>}
      {description && <p className="text-xs uppercase tracking-[0.3em] text-tmCharcoal/50">{description}</p>}
    </div>
  );
}
