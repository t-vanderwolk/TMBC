'use client';

const highlightBadges = ['Invite-only', 'Mentor-guided', 'Soft concierge'];

type DashboardHeroEditorialProps = {
  memberName: string;
  stageLabel: string;
  status?: string;
  tagLine?: string;
};

export default function DashboardHeroEditorial({
  memberName,
  stageLabel,
  status,
  tagLine,
}: DashboardHeroEditorialProps) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-member-border-default bg-gradient-to-br from-member-background-soft via-member-background-card to-member-accent-secondary/80 p-8 shadow-[0_40px_90px_rgba(199,166,199,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_40%)]" />
      <div className="pointer-events-none absolute right-4 top-6 h-24 w-24 rounded-full bg-white/40 blur-3xl" />
      <div className="relative z-10 space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-member-text-secondary">
          Command center
        </p>
        <h1 className="font-serif text-4xl text-member-text-primary">Hello, {memberName}.</h1>
        <p className="text-sm text-member-text-secondary">{stageLabel}</p>
        {status && <p className="text-sm text-member-text-secondary">{status}</p>}
        {tagLine && (
          <p className="max-w-2xl text-sm text-member-text-secondary">{tagLine}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {highlightBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-member-border-soft bg-member-background-card px-4 py-1 text-[0.6rem] uppercase tracking-[0.45em] text-member-accent-primary"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
