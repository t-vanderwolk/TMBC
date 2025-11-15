type TrackHeaderProps = {
  journeyLabel: string;
  trackName: string;
  description?: string;
  moduleCount: number;
};

const TrackHeader = ({
  journeyLabel,
  trackName,
  description,
  moduleCount,
}: TrackHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-inner md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.6em] text-tmMauve">
          {journeyLabel}
        </p>
        <h3 className="text-2xl text-tmCharcoal">{trackName}</h3>
        {description && (
          <p className="mt-2 text-sm text-tmCharcoal/70">{description}</p>
        )}
      </div>
      <span className="inline-flex items-center justify-center rounded-full bg-tmBlush/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-tmCharcoal">
        {moduleCount} modules
      </span>
    </div>
  );
};

export default TrackHeader;
