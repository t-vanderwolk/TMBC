import type { DashboardData } from '@/lib/services/server/dashboard.service';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import DashboardSection from '@/components/dashboard/ui/DashboardSection';

type AffiliatePerksSectionProps = {
  dataPromise: Promise<DashboardData>;
};

const buildLogoText = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default async function AffiliatePerksSection({ dataPromise }: AffiliatePerksSectionProps) {
  const data = await dataPromise;

  return (
    <DashboardSection
      eyebrow="Affiliate perks of the week"
      title="Curated offers for gentle prep"
      action={
        <ActionButton
          href="/dashboard/plan"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Browse registry
        </ActionButton>
      }
    >
      <div className="space-y-3">
        {data.affiliatePerks.map((perk) => (
          <DashboardCard
            key={perk.name}
            className="space-y-3 bg-[#FFF8F6]/70 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C7A7B7] text-lg font-semibold uppercase text-white">
                {buildLogoText(perk.name)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#3E2F35]">{perk.name}</p>
                <p className="text-xs text-[#3E2F35]/70">{perk.notes}</p>
              </div>
              <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#B98AA5]">
                {perk.code}
              </span>
            </div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">Offer valid this week</p>
          </DashboardCard>
        ))}
      </div>
    </DashboardSection>
  );
}
