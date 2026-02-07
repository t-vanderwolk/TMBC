import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import type { AdminAnalyticsPayload } from "@/types/adminAnalytics";

const formatPercent = (value: number | null | undefined) =>
  value === null || value === undefined ? "—" : `${value.toFixed(1)}%`;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const formatSeconds = (value: number | null | undefined) => {
  if (value == null || value <= 0) return "—";
  const rounded = Math.round(value);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
};

type Props = {
  data: AdminAnalyticsPayload["content"];
};

export default function ContentAnalyticsSection({ data }: Props) {
  return (
    <section className="space-y-6 rounded-3xl border border-[#E3D1DA] bg-white/90 p-6 shadow-sm md:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Content & Blog Analytics</p>
        <h2 className="text-3xl font-serif text-[#3E2F35]">Education that converts</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AdminStatCard
          title="Total views"
          value={data.kpis.totalViews.toLocaleString()}
          detail="Page impressions"
        />
        <AdminStatCard
          title="Blog → onboarding pct"
          value={formatPercent(data.kpis.blogToOnboardingConversionPct)}
          detail="Influenced registries / seeded"
        />
        <AdminStatCard
          title="Acceptance lift"
          value={formatPercent(data.kpis.acceptanceLiftPct)}
          detail="Lift after blog exposure"
        />
        <AdminStatCard
          title="Influenced revenue"
          value={formatCurrency(data.kpis.blogInfluencedRevenue)}
          detail="Brand + affiliate lift"
        />
      </div>

      <div className="space-y-3 rounded-3xl border border-[#E3D1DA] bg-[#FDF9FB] p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Blog impact</p>
          <h3 className="text-2xl font-serif text-[#3E2F35]">The Art of the Registry</h3>
          <p className="text-sm text-[#3E2F35]/70">
            Confidence signals collected from this authoritative clarity piece.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <AdminStatCard
            title="Total views"
            value={data.blogImpact.totalViews.toLocaleString()}
            detail="Readers reached"
          />
          <AdminStatCard
            title="% from spotlight"
            value={`${data.blogImpact.spotlightPct.toFixed(1)}%`}
            detail="Journal spotlight origin"
          />
          <AdminStatCard
            title="Avg scroll depth"
            value={`${data.blogImpact.avgScrollDepthPct.toFixed(1)}%`}
            detail="Depth reached across views"
          />
          <AdminStatCard
            title="Avg time on page"
            value={formatSeconds(data.blogImpact.avgTimeOnPageSeconds)}
            detail="Bucketed dwell time"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            title="Invite requests influenced"
            value={data.blogImpact.inviteRequestsInfluenced.toLocaleString()}
            detail="Soft attribution"
          />
          <AdminStatCard
            title="Onboarding completions"
            value={data.blogImpact.onboardingCompletionsInfluenced.toLocaleString()}
            detail="Members completing after reading"
          />
          <AdminStatCard
            title="Registry actions"
            value={data.blogImpact.registryActionsInfluenced.toLocaleString()}
            detail="Adds/removals/deferrals captured"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Blog-to-listening impact</p>
        <div className="overflow-x-auto rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-4">
          <table className="w-full text-left text-sm text-[#3E2F35]">
            <thead>
              <tr className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                <th className="py-2 pr-3 font-semibold">Post</th>
                <th className="py-2 px-3 font-semibold">Registries</th>
                <th className="py-2 px-3 font-semibold">Revenue</th>
                <th className="py-2 px-3 font-semibold">Acceptance lift</th>
                <th className="py-2 px-3 font-semibold">Purchase lift</th>
                <th className="py-2 px-3 font-semibold">Top brands</th>
              </tr>
            </thead>
            <tbody>
              {data.byPost.map((post) => (
                <tr key={post.slug} className="border-t border-[#E3D1DA] align-top">
                  <td className="py-2 pr-3 font-semibold">{post.title ?? post.slug}</td>
                  <td className="px-3 py-2">{post.influencedRegistries}</td>
                  <td className="px-3 py-2">{formatCurrency(post.influencedRevenue)}</td>
                  <td className="px-3 py-2">{formatPercent(post.acceptanceLiftPct)}</td>
                  <td className="px-3 py-2">{formatPercent(post.purchaseLiftPct)}</td>
                  <td className="px-3 py-2">
                    {post.topBrands.length
                      ? post.topBrands.map((brand) => (
                          <div key={brand.brand} className="text-[0.7rem] text-[#3E2F35]/80">
                            {brand.brand}: {formatCurrency(brand.revenue)}
                          </div>
                        ))
                      : "—"}
                  </td>
                </tr>
              ))}
              {data.byPost.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-xs text-[#3E2F35]/70">
                    No blog influence recorded this window.
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
