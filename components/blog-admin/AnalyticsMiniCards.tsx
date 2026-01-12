"use client";

type AnalyticsMiniCardsProps = {
  metrics: {
    views: number;
    read75: number;
    shares: number;
    clicks: number;
  };
};

const CARD_CONFIG = [
  { key: "views", label: "Views", description: "Readers landed on this post" },
  { key: "read75", label: "Read 75%", description: "Readers completed 75% of content" },
  { key: "shares", label: "Shares", description: "Social and DM shares" },
  { key: "clicks", label: "Affiliate clicks", description: "Clicks through /r/blog redirects" },
] as const;

export default function AnalyticsMiniCards({ metrics }: AnalyticsMiniCardsProps) {
  const getValue = (key: typeof CARD_CONFIG[number]["key"]) => metrics[key] ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <article
          key={card.key}
          className="space-y-1 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-4 text-[#3E2F35]"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">{card.label}</p>
          <p className="text-2xl font-semibold">{getValue(card.key).toLocaleString("en-US")}</p>
          <p className="text-xs text-[#3E2F35]/70">{card.description}</p>
        </article>
      ))}
    </div>
  );
}
