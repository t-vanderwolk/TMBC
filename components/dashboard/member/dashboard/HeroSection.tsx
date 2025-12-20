import type { SafeUser } from '@/lib/auth/getUser';
import type { DashboardData } from '@/lib/services/server/dashboard.service';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import StatBadge from '@/components/dashboard/ui/StatBadge';

type HeroSectionProps = {
  dataPromise: Promise<DashboardData>;
  user: SafeUser;
  microcopy: string;
};

export default async function HeroSection({ dataPromise, user, microcopy }: HeroSectionProps) {
  const data = await dataPromise;
  const firstName = user.name?.split(' ')[0] ?? 'Friend';

  return (
    <DashboardCard className="space-y-6">
      <div className="space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Member dashboard</p>
        <h1 className="text-3xl font-serif text-[#3E2F35] md:text-4xl">Welcome back, {firstName}</h1>
        <p className="text-sm text-[#3E2F35]/70">Your baby journey, thoughtfully guided.</p>
        <div className="flex flex-wrap gap-3">
          {data.dueDateLabel && <StatBadge label="Due" value={data.dueDateLabel} />}
          {data.babyStage && <StatBadge label="Stage" value={data.babyStage} />}
        </div>
        <p className="max-w-2xl whitespace-pre-wrap text-sm text-[#3E2F35]/65 italic">{microcopy}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1 rounded-2xl border border-[#F1DDE4] bg-gradient-to-b from-[#FFF8F6] to-white p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Academy progress</p>
          <p className="text-3xl font-serif text-[#3E2F35]">{data.progress.academy}%</p>
          <p className="text-[0.7rem] text-[#3E2F35]/70">
            {data.completedModules} of {data.totalModules} modules complete
          </p>
        </div>
        <div className="space-y-1 rounded-2xl border border-[#F1DDE4] bg-white/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Registry</p>
          <p className="text-2xl font-serif text-[#3E2F35]">{data.registryCount} items</p>
          <p className="text-[0.7rem] text-[#3E2F35]/70">{data.registryStatus.label}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-[#F1DDE4] bg-white/80 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Community</p>
          <p className="text-2xl font-serif text-[#3E2F35]">{data.communityStatus.label}</p>
          <p className="text-[0.7rem] text-[#3E2F35]/70">{data.communityStatus.detail}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton
          href="/dashboard/member/learn"
          className="sm:w-auto"
          fullWidth
        >
          Continue Academy
        </ActionButton>
        <ActionButton
          href="/dashboard/member/registry"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Open Registry
        </ActionButton>
      </div>
    </DashboardCard>
  );
}
