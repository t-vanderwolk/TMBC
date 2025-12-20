import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  Users,
} from 'lucide-react';
import ActionButton from '@/components/dashboard/ui/ActionButton';
import DashboardCard from '@/components/dashboard/ui/DashboardCard';
import DashboardSection from '@/components/dashboard/ui/DashboardSection';

const QUICK_ACCESS = [
  {
    title: 'Academy',
    description: 'Continue the lessons that feel gentle today.',
    href: '/dashboard/member/learn',
    icon: <BookOpen className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Registry',
    description: 'Review curated essentials and gifted moments.',
    href: '/dashboard/member/registry',
    icon: <ClipboardList className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Community',
    description: 'See what other members are sharing this week.',
    href: '/dashboard/member/community',
    icon: <Users className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'My Baby Book',
    description: 'Capture soft stories and milestone notes.',
    href: '/dashboard/member/journal',
    icon: <BookOpen className="h-5 w-5" aria-hidden />,
  },
  {
    title: 'Mentor Support',
    description: 'Request concierge guidance or a mentor check-in.',
    href: '/dashboard/member/support',
    icon: <HelpCircle className="h-5 w-5" aria-hidden />,
  },
];

export default function QuickAccessSection() {
  return (
    <DashboardSection
      eyebrow="Quick access"
      title="Gentle shortcuts"
      action={
        <ActionButton
          href="/dashboard/member"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Open dashboard
        </ActionButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACCESS.map((item) => (
          <DashboardCard key={item.title} className="flex flex-col gap-3 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6E9E6]/80 text-[#B98AA5]">
              {item.icon}
            </div>
            <p className="text-lg font-semibold text-[#3E2F35]">{item.title}</p>
            <p className="text-xs font-normal text-[#3E2F35]/60">{item.description}</p>
            <ActionButton
              href={item.href}
              variant="ghost"
              className="sm:w-auto"
              fullWidth
            >
              Open
            </ActionButton>
          </DashboardCard>
        ))}
      </div>
    </DashboardSection>
  );
}
