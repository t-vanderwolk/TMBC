import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import type { AdminAnalyticsPayload } from "@/types/adminAnalytics";

const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatHours = (value: number | null) =>
  value === null ? "—" : `${value.toFixed(1)}h`;

type Props = {
  data: AdminAnalyticsPayload["registry"];
  rangeDays: number;
};

export default function RegistryAnalyticsSection({ data, rangeDays }: Props) {
  const kpis = [
    {
      title: "Registries seeded",
      value: data.kpis.registriesSeeded.toLocaleString(),
      detail: `Last ${rangeDays} days`,
    },
    {
      title: "Acceptance rate",
      value: formatPercent(data.kpis.acceptanceRate),
      detail: "Seeded suggestions accepted",
    },
    {
      title: "Modification rate",
      value: formatPercent(data.kpis.modificationRate),
      detail: "Swaps, edits, redeployments",
    },
    {
      title: "Deferral rate",
      value: formatPercent(data.kpis.deferralRate),
      detail: "Choices still awaiting review",
    },
  ];

  return (
    <section className="space-y-6 rounded-3xl border border-[#E3D1DA] bg-white/90 p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Registry Intelligence</p>
          <h2 className="text-3xl font-serif text-[#3E2F35]">Curation Performance</h2>
        </div>
        <p className="text-sm text-[#3E2F35]/70">{rangeDays}-day window</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((stat) => (
          <AdminStatCard key={stat.title} title={stat.title} value={stat.value} detail={stat.detail} />
        ))}
        <AdminStatCard
          title="Completion"
          value={`${data.kpis.avgCompletionPct.toFixed(1)}%`}
          detail="Purchased vs seeded items"
        />
        <AdminStatCard
          title="Mentor interventions"
          value={`${data.kpis.mentorInterventionRate.toFixed(1)}%`}
          detail="Mentor notes per seeded item"
        />
        <AdminStatCard
          title="Confident conversions"
          value={`${data.kpis.purchaseConfidenceScore.toFixed(1)}%`}
          detail="Purchases stable after 14 days"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8A1B4]">By category</p>
          <span className="text-xs text-[#3E2F35]/60">
            Showing {data.byCategory.length || 0} categories
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-4">
          <table className="w-full text-left text-sm text-[#3E2F35]">
            <thead>
              <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                <th className="py-2 pr-3 font-semibold">Category</th>
                <th className="py-2 px-3 font-semibold">Seeded</th>
                <th className="py-2 px-3 font-semibold">Accepted</th>
                <th className="py-2 px-3 font-semibold">Modified</th>
                <th className="py-2 px-3 font-semibold">Deferred</th>
                <th className="py-2 px-3 font-semibold">Avg decision</th>
              </tr>
            </thead>
            <tbody>
              {data.byCategory.map((category) => (
                <tr key={category.category} className="border-t border-[#E3D1DA]">
                  <td className="py-2 pr-3 font-semibold">{category.category}</td>
                  <td className="px-3 py-2">{category.seededCount.toLocaleString()}</td>
                  <td className="px-3 py-2">{category.accepted.toLocaleString()}</td>
                  <td className="px-3 py-2">{category.modified.toLocaleString()}</td>
                  <td className="px-3 py-2">{category.deferred.toLocaleString()}</td>
                  <td className="px-3 py-2">{formatHours(category.avgTimeToDecisionHours)}</td>
                </tr>
              ))}
              {data.byCategory.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-xs text-[#3E2F35]/70">
                    No seeded categories in this window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8A1B4]">High friction registries</p>
          <span className="text-xs text-[#3E2F35]/60">Decision hot spots</span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-white/80 p-4">
          <table className="w-full text-left text-sm text-[#3E2F35]">
            <thead>
              <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                <th className="py-2 pr-3 font-semibold">Member</th>
                <th className="py-2 px-3 font-semibold">Completion</th>
                <th className="py-2 px-3 font-semibold">Pending</th>
                <th className="py-2 px-3 font-semibold">Deferrals</th>
                <th className="py-2 px-3 font-semibold">Swaps</th>
                <th className="py-2 px-3 font-semibold">Flags</th>
                <th className="py-2 px-3 font-semibold">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {data.highFrictionRegistries.map((entry) => (
                <tr key={entry.registryId} className="border-t border-[#E3D1DA]">
                  <td className="py-2 pr-3 font-semibold">
                    {entry.memberName ?? entry.memberId}
                  </td>
                  <td className="px-3 py-2">{entry.completionPct.toFixed(1)}%</td>
                  <td className="px-3 py-2">{entry.pendingDecisions}</td>
                  <td className="px-3 py-2">{entry.deferrals}</td>
                  <td className="px-3 py-2">{entry.swaps}</td>
                  <td className="px-3 py-2">{entry.flags.join(", ") || "—"}</td>
                  <td className="px-3 py-2">{entry.lastActivityAt ? new Date(entry.lastActivityAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {data.highFrictionRegistries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-xs text-[#3E2F35]/70">
                    Everything is moving smoothly in this window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
