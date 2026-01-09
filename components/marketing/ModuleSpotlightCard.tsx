export default function ModuleSpotlightCard() {
  return (
    <section className="space-y-6 rounded-[32px] border border-[#C8A1B4]/40 bg-[#FFF9F5] p-6 shadow-[0_20px_50px_rgba(199,166,199,0.25)]">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">ACADEMY SPOTLIGHT</p>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Car Seat Masterclass</h3>
        <p className="text-sm text-[var(--tmbc-charcoal)]/75">
          Real-time car-seat guidance for babies 0–12 months, so every ride feels steady.
        </p>
      </div>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5]">
        GEAR JOURNEY • 0–12 MONTHS • 35 MIN
      </p>
      <div className="rounded-2xl bg-white/80 p-4 text-sm text-[var(--tmbc-charcoal)]/75">
        Mentor note: Focus on compatibility with your stroller chassis + base installation before your first drive.
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-[#C8A1B4] py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white"
      >
        Continue Module
      </button>
    </section>
  );
}
