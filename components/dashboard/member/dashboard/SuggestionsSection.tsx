import type { ReactNode } from 'react';
import { CalendarCheck, Gift, Sparkles, Users } from 'lucide-react';
import type { DashboardData } from '@/lib/services/server/dashboard.service';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import DashboardSection from '@/components/dashboard/ui/DashboardSection';

type Suggestion = {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  icon: ReactNode;
};

type SuggestionsSectionProps = {
  dataPromise: Promise<DashboardData>;
};

const formatEventDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  } catch {
    return 'Upcoming event';
  }
};

export default async function SuggestionsSection({ dataPromise }: SuggestionsSectionProps) {
  const data = await dataPromise;
  const dynamicSuggestions: Suggestion[] = [];

  if (data.suggestions.nextModuleTitle) {
    dynamicSuggestions.push({
      id: 'academy',
      title: `Continue Academy: ${data.suggestions.nextModuleTitle}`,
      description: 'Return to the lesson that met you where you are.',
      href: '/dashboard/member/learn',
      ctaLabel: 'Continue',
      icon: <Sparkles className="h-4 w-4 text-[#B98AA5]" aria-hidden />,
    });
  }

  if (data.suggestions.needsRegistry) {
    dynamicSuggestions.push({
      id: 'registry',
      title: 'Review your registry',
      description: 'Share a few more essentials so the concierge knows your rhythm.',
      href: '/dashboard/member/registry',
      ctaLabel: 'Review',
      icon: <Gift className="h-4 w-4 text-[#B98AA5]" aria-hidden />,
    });
  }

  const [upcomingEvent] = data.events;
  if (upcomingEvent) {
    dynamicSuggestions.push({
      id: 'event',
      title: `Join ${upcomingEvent.title}`,
      description: `${formatEventDate(upcomingEvent.date)} · ${
        upcomingEvent.format ?? 'Virtual space'
      }`,
      href: '/dashboard/member/events',
      ctaLabel: 'RSVP',
      icon: <CalendarCheck className="h-4 w-4 text-[#B98AA5]" aria-hidden />,
    });
  }

  if (data.suggestions.encourageCommunity) {
    dynamicSuggestions.push({
      id: 'community',
      title: 'Share in Community',
      description: 'Your voice keeps the space soft and familiar.',
      href: '/dashboard/member/community',
      ctaLabel: 'Say hello',
      icon: <Users className="h-4 w-4 text-[#B98AA5]" aria-hidden />,
    });
  }

  const missingCount = Math.max(0, 3 - dynamicSuggestions.length);
  const checklistSuggestions = data.weeklyChecklist.slice(0, missingCount).map((item, index) => ({
    id: `checklist-${index}`,
    title: item,
    description: 'Keep this on your list for when the day calls for it.',
    href: '/dashboard/member/journal',
    ctaLabel: 'Add note',
    icon: <Sparkles className="h-4 w-4 text-[#B98AA5]" aria-hidden />,
  }));

  const suggestions = [...dynamicSuggestions, ...checklistSuggestions].slice(0, 3);

  return (
    <DashboardSection
      eyebrow="Today’s suggestions"
      title="Smart actions, no pressure."
      action={
        <ActionButton href="/dashboard/member/learn" variant="ghost" className="sm:w-auto" fullWidth>
          View academy
        </ActionButton>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <DashboardCard key={suggestion.id} className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F1DDE4] bg-[#F6E9E6]/60">
                {suggestion.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-[#3E2F35]">{suggestion.title}</p>
                <p className="text-sm text-[#3E2F35]/70">{suggestion.description}</p>
              </div>
              <ActionButton
                href={suggestion.href}
                variant="ghost"
                className="sm:w-auto"
                fullWidth
              >
                {suggestion.ctaLabel}
              </ActionButton>
            </div>
          </DashboardCard>
        ))}
      </div>
    </DashboardSection>
  );
}
