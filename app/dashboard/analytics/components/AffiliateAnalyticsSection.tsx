import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import type { AdminAnalyticsPayload } from "@/types/adminAnalytics";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type Props = {
  data: AdminAnalyticsPayload["affiliate"];
};

export default function AffiliateAnalyticsSection({ data }: Props) {
  const transactions = data.transactions.slice(0, 8);
  const revenueBreakdown = data.kpis.revenueBreakdown ?? {
    productAffiliate: 0,
    eventService: 0,
    lead: 0,
  };

  return (
    <section className="space-y-6 rounded-3xl border border-[#E3D1DA] bg-white/90 p-6 shadow-sm md:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Affiliate Earnings</p>
        <h2 className="text-3xl font-serif text-[#3E2F35]">Decision-based attribution</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard
          title="Estimated commission"
          value={formatCurrency(data.kpis.estimatedCommission)}
          detail="Projected payout"
        />
        <AdminStatCard
          title="Confirmed commission"
          value={formatCurrency(data.kpis.confirmedCommission)}
          detail="Pending approvals"
        />
        <AdminStatCard
          title="Avg commission / registry"
          value={formatCurrency(data.kpis.avgCommissionPerRegistry)}
          detail="Per converting registry"
        />
        <AdminStatCard
          title="Attributed revenue"
          value={formatCurrency(data.kpis.revenueAttributed)}
          detail="Decision-aligned spend"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard
          title="Product affiliate revenue"
          value={formatCurrency(revenueBreakdown.productAffiliate)}
          detail="Affiliate-linked purchases"
        />
        <AdminStatCard
          title="Event & service revenue"
          value={formatCurrency(revenueBreakdown.eventService)}
          detail="Concierge & experience"
        />
        <AdminStatCard
          title="Lead revenue (MyRegistry CPL)"
          value={formatCurrency(revenueBreakdown.lead)}
          detail="AWIN lead payouts"
        />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Networks</p>
          <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-4">
            <table className="w-full text-left text-sm text-[#3E2F35]">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                  <th className="py-2 pr-3 font-semibold">Network</th>
                  <th className="py-2 px-3 font-semibold">Est. commission</th>
                  <th className="py-2 px-3 font-semibold">Confirmed</th>
                  <th className="py-2 px-3 font-semibold">Orders</th>
                </tr>
              </thead>
              <tbody>
                {data.byNetwork.map((row) => (
                  <tr key={row.network} className="border-t border-[#E3D1DA]">
                    <td className="py-2 pr-3 font-semibold">{row.network}</td>
                    <td className="px-3 py-2">{formatCurrency(row.estimated)}</td>
                    <td className="px-3 py-2">{formatCurrency(row.confirmed)}</td>
                    <td className="px-3 py-2">{row.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Decision sources</p>
            <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-white/80 p-4">
              <table className="w-full text-left text-sm text-[#3E2F35]">
                <thead>
                  <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                    <th className="py-2 pr-3 font-semibold">Source</th>
                    <th className="py-2 px-3 font-semibold">Estimated</th>
                    <th className="py-2 px-3 font-semibold">Confirmed</th>
                    <th className="py-2 px-3 font-semibold">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byDecisionSource.map((row) => (
                    <tr key={row.decisionSource} className="border-t border-[#E3D1DA]">
                      <td className="py-2 pr-3 font-semibold">{row.decisionSource.replace(/_/g, " ")}</td>
                      <td className="px-3 py-2">{formatCurrency(row.estimated)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.confirmed)}</td>
                      <td className="px-3 py-2">{row.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Brand impact</p>
            <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-white/80 p-4">
              <table className="w-full text-left text-sm text-[#3E2F35]">
                <thead>
                  <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                    <th className="py-2 pr-3 font-semibold">Brand</th>
                    <th className="py-2 px-3 font-semibold">Network</th>
                    <th className="py-2 px-3 font-semibold">Orders</th>
                    <th className="py-2 px-3 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byBrand.map((row) => (
                    <tr key={`${row.brand}-${row.network}`} className="border-t border-[#E3D1DA]">
                      <td className="py-2 pr-3 font-semibold">{row.brand}</td>
                      <td className="px-3 py-2">{row.network}</td>
                      <td className="px-3 py-2">{row.orders}</td>
                      <td className="px-3 py-2">{formatCurrency(row.estimated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Mentor earnings</p>
        <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-4">
          <table className="w-full text-left text-sm text-[#3E2F35]">
            <thead>
              <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                <th className="py-2 pr-3 font-semibold">Mentor</th>
                <th className="py-2 px-3 font-semibold">Estimated</th>
                <th className="py-2 px-3 font-semibold">Confirmed</th>
                <th className="py-2 px-3 font-semibold">Orders</th>
              </tr>
            </thead>
            <tbody>
              {data.mentorEarnings.map((mentor) => (
                <tr key={mentor.mentorId} className="border-t border-[#E3D1DA]">
                  <td className="py-2 pr-3 font-semibold">{mentor.mentorName ?? mentor.mentorId}</td>
                  <td className="px-3 py-2">{formatCurrency(mentor.estimated)}</td>
                  <td className="px-3 py-2">{formatCurrency(mentor.confirmed)}</td>
                  <td className="px-3 py-2">{mentor.orders}</td>
                </tr>
              ))}
              {data.mentorEarnings.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-xs text-[#3E2F35]/70">
                    No mentor-linked earnings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Recent conversions</p>
        <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-white/80 p-4">
          <table className="w-full text-left text-sm text-[#3E2F35]">
            <thead>
              <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Member</th>
                <th className="px-3 py-2 font-semibold">Network</th>
                <th className="px-3 py-2 font-semibold">Value</th>
                <th className="px-3 py-2 font-semibold">Commission</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.registryItemId} className="border-t border-[#E3D1DA]">
                  <td className="py-2 pr-3">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{txn.memberId}</td>
                  <td className="px-3 py-2">{txn.network}</td>
                  <td className="px-3 py-2">{formatCurrency(txn.orderValue ?? 0)}</td>
                  <td className="px-3 py-2">{formatCurrency(txn.estimatedCommission ?? 0)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-xs text-[#3E2F35]/70">
                    Awaiting affiliate conversions.
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
