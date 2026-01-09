export default function ModuleSpotlightCard() {
  return (
    <section className="marketing-card space-y-6 text-[var(--tmbc-charcoal)]">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">ACADEMY SPOTLIGHT</p>
      <div className="space-y-2">
        <h3 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Car Seat Masterclass</h3>
        <p className="text-sm text-[var(--tmbc-charcoal)]/75">
          Real-time car-seat guidance for babies 0–12 months, so every ride feels steady.
        </p>
      </div>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
        GEAR JOURNEY • 0–12 MONTHS • 35 MIN
      </p>
      <div className="rounded-2xl bg-white/90 p-4 text-sm text-[var(--tmbc-charcoal)]/75">
        Mentor note: Focus on compatibility with your stroller chassis + base installation before your first drive.
      </div>
      <button
        type="button"
        className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
      >
        Continue Module
      </button>
    </section>
  );
}
