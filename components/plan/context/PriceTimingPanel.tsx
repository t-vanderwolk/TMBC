export default function PriceTimingPanel() {
  return (
    <section className="space-y-3 rounded-[28px] border border-[#EAE2E8] bg-white/90 p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Price & Timing Insights</p>
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Collapsed by default</span>
      </header>
      <p className="text-sm text-[#3E2F35]/70">
        Static reference copy only. This panel will eventually surface price history, protection cues, and timing signals.
      </p>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
        Price history, retailer comparison, and protection signals are on deck.
      </p>
    </section>
  );
}
