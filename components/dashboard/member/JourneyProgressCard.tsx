"use client";

type JourneyProgressCardProps = {
  currentModule?: string | null;
  progressPercent?: number | null;
  nextMilestone?: string | null;
  lastTouchpoint?: string | null;
};

export default function JourneyProgressCard({
  currentModule,
  progressPercent,
  nextMilestone,
  lastTouchpoint,
}: JourneyProgressCardProps) {
  const safeModule = currentModule ?? "Your next gentle chapter";
  const safePercent = Math.min(100, Math.max(0, progressPercent ?? 0));
  const safeMilestone = nextMilestone ?? "Awaiting your next prompt";
  const safeTouchpoint = lastTouchpoint ?? "Your mentor is sending warmth.";

  return (
    <section className="rounded-2xl border border-[#E6CFD5] bg-white/90 p-6 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Journey progress</p>
      <h2 className="mt-3 text-3xl font-serif text-[#3E2F35] md:text-4xl">{safeModule}</h2>
      <div className="mt-6 space-y-3">
        <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60 md:flex-row md:items-center md:justify-between">
          <span>Progress</span>
          <span>{safePercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#eee]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FAD5E0] to-[#C8A1B4]"
            style={{ width: `${safePercent}%` }}
            aria-label={`Journey is ${safePercent}% complete`}
          />
        </div>
      </div>
      <p className="mt-6 text-sm text-[#3E2F35]/70 md:text-base">
        Next milestone: <strong>{safeMilestone}</strong>
      </p>
      <p className="mt-2 text-sm text-[#3E2F35]/60 md:text-base">{safeTouchpoint}</p>
    </section>
  );
}
