import type { SystemActivity } from "@/lib/services/server/admin.service";

export default function SystemHealthPanel({ activities }: { activities: SystemActivity[] }) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_60px_rgba(62,47,53,0.2)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">System health</p>
          <h3 className="text-2xl font-serif text-[#3E2F35]">Live activity</h3>
        </div>
        <span className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
          {activities.length} updates
        </span>
      </div>
      <div className="mt-6 space-y-4 text-sm text-[#3E2F35]">
        {activities.map((activity) => (
          <article key={activity.id} className="rounded-2xl border border-[#E3D0D7]/70 bg-[#FFFAF8]/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-[#3E2F35]">{activity.summary}</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
              {activity.timestamp}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
