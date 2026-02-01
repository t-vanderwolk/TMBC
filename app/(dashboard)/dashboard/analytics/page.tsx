import { redirect } from "next/navigation";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getAdminAnalytics } from "@/lib/services/server/adminAnalytics.service";
import AffiliateAnalyticsSection from "./components/AffiliateAnalyticsSection";
import ContentAnalyticsSection from "./components/ContentAnalyticsSection";
import RegistryAnalyticsSection from "./components/RegistryAnalyticsSection";

const DEFAULT_RANGE_DAYS = 30;

type AnalyticsPageProps = {
  searchParams?: {
    rangeDays?: string;
  };
};

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const user = await getUserOrThrow();
  if (user.role !== "ADMIN") {
    redirect("/login");
  }

  const parsedRange = Number(searchParams?.rangeDays);
  const rangeDays = Number.isFinite(parsedRange) && parsedRange > 0 ? parsedRange : DEFAULT_RANGE_DAYS;

  const analytics = await getAdminAnalytics({ rangeDays });

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin intelligence</p>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-serif text-4xl text-[#3E2F35]">Analytics</h1>
          <span className="text-sm text-[#3E2F35]/70">Range: last {rangeDays} days</span>
        </div>
        <p className="max-w-2xl text-sm text-[#3E2F35]/70">
          Decision quality, confidence, and refinement across registries, affiliates, and blog content.
        </p>
      </header>

      <RegistryAnalyticsSection data={analytics.registry} rangeDays={rangeDays} />
      <AffiliateAnalyticsSection data={analytics.affiliate} />
      <ContentAnalyticsSection data={analytics.content} />
    </div>
  );
}
