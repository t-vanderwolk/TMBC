import Link from 'next/link';
import type { DashboardData } from '@/lib/services/server/dashboard.service';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import DashboardSection from '@/components/dashboard/ui/DashboardSection';
import StatBadge from '@/components/dashboard/ui/StatBadge';

type JourneySnapshotSectionProps = {
  dataPromise: Promise<DashboardData>;
};

export default async function JourneySnapshotSection({ dataPromise }: JourneySnapshotSectionProps) {
  const data = await dataPromise;

  return (
    <DashboardSection
      eyebrow="My journey snapshot"
      title="Progress across your TMBC paths"
      description="A calm view of how your Academy, Registry, and Community align."
      action={
        <ActionButton href="/dashboard/member/learn" variant="ghost" className="sm:w-auto" fullWidth>
          View academy
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {data.journeyProgress.map((journey) => (
          <DashboardCard key={journey.id} className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#3E2F35]">{journey.title}</p>
                <p className="text-xs text-[#3E2F35]/70">{journey.description}</p>
              </div>
              <StatBadge label="Complete" value={`${journey.percent}%`} />
            </div>
            <div className="h-2 rounded-full bg-[#F1DDE4]">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#F6E9E6] to-[#C7A7B7]"
                style={{ width: `${journey.percent}%` }}
              />
            </div>
            <p className="text-xs text-[#3E2F35]/60">
              {journey.completed}/{journey.total} completed
            </p>
          </DashboardCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Registry status</p>
              <p className="text-sm font-semibold text-[#3E2F35]">{data.registryStatus.label}</p>
            </div>
          </div>
          <p className="text-xs text-[#3E2F35]/70">{data.registryStatus.detail}</p>
          <ActionButton
            href="/dashboard/plan"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            Review registry
          </ActionButton>
        </DashboardCard>

        <DashboardCard className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Community</p>
              <p className="text-sm font-semibold text-[#3E2F35]">{data.communityStatus.label}</p>
            </div>
          </div>
          <p className="text-xs text-[#3E2F35]/70">{data.communityStatus.detail}</p>
          <Link href="/dashboard/member/community" className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#B98AA5]">
            {data.communityStatus.prompt}
          </Link>
        </DashboardCard>
      </div>
    </DashboardSection>
  );
}
