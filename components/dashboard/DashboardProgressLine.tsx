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
    <section className="rounded-[32px] border border-member-border-default/70 bg-member-background-card p-6 shadow-[0_25px_70px_rgba(199,166,199,0.25)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-member-text-secondary">
            Momentum line
          </p>
          <h2 className="font-serif text-2xl text-member-text-primary">Progress & milestones</h2>
        </div>
        <p className="text-sm text-member-text-secondary">
          Module {completedModules} of {totalModules} · {registryItems} registry pieces · {mentorNotes} mentor notes
        </p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-3 rounded-full bg-member-background-muted/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-member-accent-secondary to-member-accent-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-member-text-secondary">
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
                ? "border-member-accent-primary bg-member-accent-primary/80 text-member-text-inverse"
                : "border-member-border-default/70 bg-member-background-card text-member-text-secondary"
            }`}
          >
            {milestone.label} · {milestone.detail}
          </span>
        ))}
      </div>
    </section>
  );
}
