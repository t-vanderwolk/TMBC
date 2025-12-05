'use client';

export type JourneyCard = {
  title: string;
  status: string;
  detail: string;
  meta: string;
};

type DashboardOverviewCardsProps = {
  cards: JourneyCard[];
};

export default function DashboardOverviewCards({ cards }: DashboardOverviewCardsProps) {
  return (
    <section className="space-y-6 rounded-[32px] border border-[var(--tmbc-blush)]/50 bg-white/90 p-6 shadow-[0_30px_80px_rgba(199,166,199,0.25)]">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/60">
          Today’s Journey
        </p>
        <span className="text-xs text-[var(--tmbc-charcoal)]/70">— a gentle trio of checkpoints</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col justify-between space-y-3 rounded-[30px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/90 p-5 shadow-[0_20px_60px_rgba(199,166,199,0.2)]"
          >
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">{card.title}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--tmbc-charcoal)]">{card.status}</h3>
              <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">{card.detail}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">{card.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
