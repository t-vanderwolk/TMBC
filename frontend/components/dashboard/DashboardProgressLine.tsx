'use client';

export type MilestoneBadge = {
  label: string;
  detail: string;
  achieved?: boolean;
};

type DashboardProgressLineProps = {
  completedModules: number;
  totalModules: number;
  registryItems: number;
  mentorNotes: number;
  milestones: MilestoneBadge[];
};

export default function DashboardProgressLine({
  completedModules,
  totalModules,
  registryItems,
  mentorNotes,
  milestones,
}: DashboardProgressLineProps) {
  const percentage = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <section className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_25px_70px_rgba(199,166,199,0.25)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/60">Momentum line</p>
          <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Progress & milestones</h2>
        </div>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Module {completedModules} of {totalModules} · {registryItems} registry pieces · {mentorNotes} mentor notes
        </p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-3 rounded-full bg-[var(--tmbc-blush)]/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--tmbc-mauve)] via-[var(--tmbc-deep-mauve)] to-[var(--tmbc-gold)] transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
          <span>Academy rhythm</span>
          <span>{percentage}% complete</span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {milestones.map((milestone) => (
          <span
            key={milestone.label}
            className={`rounded-full border px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] ${
              milestone.achieved
                ? 'border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/80 text-white'
                : 'border-[var(--tmbc-charcoal)]/20 bg-white/70 text-[var(--tmbc-charcoal)]/80'
            }`}
          >
            {milestone.label} · {milestone.detail}
          </span>
        ))}
      </div>
    </section>
  );
}
