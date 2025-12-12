"use client";

type TodayFocusCardProps = {
  focusItems?: string[] | null;
  mantra?: string | null;
  timeLabel?: string | null;
  note?: string | null;
};

export default function TodayFocusCard({
  focusItems,
  mantra,
  timeLabel,
  note,
}: TodayFocusCardProps) {
  const safeFocusItems = focusItems?.length
    ? focusItems
    : [
        "Slow breaths before checking your screen.",
        "Share a gentle update with your mentor.",
        "Layer a soft scent for evening rest.",
      ];
  const safeMantra = mantra ?? "Choose tenderness over busyness.";
  const safeTimeLabel = timeLabel ?? "Today's focus";
  const safeNote =
    note ??
    "Set an intention before today unwinds; sync will be ready when you are.";

  return (
    <section className="rounded-[2.5rem] border border-[#E2D1D7] bg-[#FEF8F5] p-6 shadow-[0_25px_60px_rgba(200,161,180,0.15)]">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
          {safeTimeLabel}
        </p>
        <span className="text-[0.65rem] text-[#3E2F35]/60">Just for today</span>
      </div>
      <h2 className="mt-3 text-3xl font-serif text-[#3E2F35]">Focus with grace</h2>
      <p className="mt-3 text-sm text-[#3E2F35]/70">{safeMantra}</p>
      <ul className="mt-5 space-y-3 text-sm text-[#3E2F35]/80">
        {safeFocusItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#C8A1B4]" aria-hidden />
            <p>{item}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs uppercase tracking-[0.4em] text-[#3E2F35]/50">
        {safeNote}
      </p>
    </section>
  );
}
