export default function RegistryReadinessPanel() {
  return (
    <section className="space-y-3 rounded-[28px] border border-[#EAE2E8] bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Registry readiness</p>
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">No blocking</span>
      </div>
      <p className="text-sm text-[#3E2F35]/80">
        Readiness placeholders show when we will support MyRegistry activation and gentle nudges.
      </p>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
        Readiness scoring and MyRegistry activation copy will appear once integrations are live.
      </p>
    </section>
  );
}
