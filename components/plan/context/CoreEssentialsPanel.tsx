const essentials = [
  "Pack calm layers for late-night check-ins.",
  "Keep a notebook near the crib to capture mentor cues.",
  "Prioritize rest over rushing toward completion.",
];

export default function CoreEssentialsPanel() {
  return (
    <section className="space-y-3 rounded-[28px] border border-[#EAE2E8] bg-gradient-to-br from-[#FFF9F5] to-white p-5 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Core essentials</p>
      <p className="text-sm text-[#3E2F35]/80">
        This space shares session-summary tone and confidence-oriented copy — no actions yet.
      </p>
      <ul className="space-y-2 text-sm text-[#3E2F35]/80">
        {essentials.map((item) => (
          <li key={item} className="rounded-[16px] border border-[#EAE2E8] bg-white/90 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">TODO: Link to mentor session summaries</p>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">TODO: Drive registry readiness signals</p>
    </section>
  );
}
