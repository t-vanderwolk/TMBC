// TMBC Seal guardrails:
// - Appears at the end of every long-form journal entry
// - Editorial, not promotional
// - Never removed for monetization

export function TmbcSeal() {
  return (
    <div className="mt-16 rounded-2xl border border-muted bg-[#faf7f5] p-8 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
        The Taylor-Made Baby Co. Seal
      </p>

      <p className="mt-4 text-base text-muted-foreground max-w-[42ch] mx-auto">
        This journal is part of the Taylor-Made Baby Co. experience —
        built by mentors, shaped by real families, and designed to help
        you prepare with clarity instead of pressure.
      </p>
    </div>
  );
}
