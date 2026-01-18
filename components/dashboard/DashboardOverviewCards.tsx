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
    <section className="space-y-6 rounded-[32px] border border-member-border-default/60 bg-member-background-card p-6 shadow-[0_30px_80px_rgba(199,166,199,0.25)]">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-member-text-secondary/80">
          Today’s Journey
        </p>
        <span className="text-xs text-member-text-secondary">— a gentle trio of checkpoints</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col justify-between space-y-3 rounded-[30px] border border-member-border-soft bg-member-background-soft p-5 shadow-[0_20px_60px_rgba(199,166,199,0.2)]"
          >
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.5em] text-member-text-secondary">
                {card.title}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-member-text-primary">{card.status}</h3>
              <p className="mt-3 text-sm text-member-text-secondary">{card.detail}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-member-text-secondary">{card.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
