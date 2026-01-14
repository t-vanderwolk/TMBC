import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import type { SafeUser } from '@/lib/auth/getUser';
import { getUserOrThrow } from '@/lib/auth/getUser';
import { getDashboardData } from '@/lib/services/server/dashboard.service';
import AffiliatePerksSection from '@/components/dashboard/member/dashboard/AffiliatePerksSection';
import EventsAnnouncementsSection from '@/components/dashboard/member/dashboard/EventsAnnouncementsSection';
import HeroSection from '@/components/dashboard/member/dashboard/HeroSection';
import JourneySnapshotSection from '@/components/dashboard/member/dashboard/JourneySnapshotSection';
import QuickAccessSection from '@/components/dashboard/member/dashboard/QuickAccessSection';
import SuggestionsSection from '@/components/dashboard/member/dashboard/SuggestionsSection';
import { HeroSkeleton, SectionSkeleton } from '@/components/dashboard/member/dashboard/Skeletons';
import StatusCard from '@/components/dashboard/member/dashboard/StatusCard';

const HERO_MICROCOPIES = [
  'Progress looks different for everyone — you’re exactly where you need to be.',
  'Soft, steady steps win the day. We are holding space for your bloom.',
  'When you’re ready, we’ll be right here with a gentle nudge.',
  'Every day is optional. Every day is a whisper of calm.',
];

const DEFAULT_MICROCOPY = HERO_MICROCOPIES[0] ?? 'Your baby journey, thoughtfully guided.';

export default async function MemberDashboardPage() {
  const user: SafeUser | null = await getUserOrThrow().catch(() => null);

  if (!user || user.role !== 'MEMBER') {
    redirect('/login');
  }

  if (!user.onboardingComplete) {
    redirect('/onboarding/questionnaire');
  }

  const userPayload = {
    id: user.id,
    name: user.name ?? undefined,
    firstName: user.name?.split(' ')[0] ?? undefined,
    dueDate: user.dueDate ?? undefined,
  };

  const dashboardPromise = getDashboardData(userPayload);
  const heroIndex = Math.abs(user.id.charCodeAt(0) % HERO_MICROCOPIES.length);
  const microcopyCandidate = HERO_MICROCOPIES[heroIndex];
  const microcopy = microcopyCandidate ?? DEFAULT_MICROCOPY;

  return (
    <main className="space-y-10">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection dataPromise={dashboardPromise} user={user} microcopy={microcopy} />
      </Suspense>

      <StatusCard
        title="Registry"
        status="Not Activated"
        note="MyRegistry integration coming soon"
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Suspense fallback={<SectionSkeleton />}>
            <SuggestionsSection dataPromise={dashboardPromise} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton lines={4} />}>
            <JourneySnapshotSection dataPromise={dashboardPromise} />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense fallback={<SectionSkeleton lines={4} />}>
            <EventsAnnouncementsSection dataPromise={dashboardPromise} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton lines={3} />}>
            <AffiliatePerksSection dataPromise={dashboardPromise} />
          </Suspense>
        </div>
      </div>

      <QuickAccessSection />
    </main>
  );
}
