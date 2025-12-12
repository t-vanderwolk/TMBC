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
    <section className="rounded-[2.5rem] border border-[#E6CFD5] bg-white/90 p-6 shadow-[0_25px_60px_rgba(200,161,180,0.15)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
        Journey progress
      </p>
      <h2 className="mt-3 text-3xl font-serif text-[#3E2F35]">{safeModule}</h2>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
          <span>Progress</span>
          <span>{safePercent}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[#eee]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FAD5E0] to-[#C8A1B4]"
            style={{ width: `${safePercent}%` }}
            aria-label={`Journey is ${safePercent}% complete`}
          />
        </div>
      </div>
      <p className="mt-6 text-sm text-[#3E2F35]/70">
        Next milestone: <strong>{safeMilestone}</strong>
      </p>
      <p className="mt-2 text-sm text-[#3E2F35]/60">{safeTouchpoint}</p>
    </section>
  );
}
