'use client';

import Link from 'next/link';
import {
  Gift,
  HeartHandshake,
  Home,
  NotebookPen,
  Users,
} from 'lucide-react';

type DashboardSidebarProps = {
  activePath: string;
};

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Learn', href: '/dashboard/learn', icon: NotebookPen },
  { label: 'Registry', href: '/dashboard/registry', icon: Gift },
  { label: 'Community', href: '/dashboard/community', icon: Users },
  { label: 'Mentor', href: '/dashboard/mentor', icon: HeartHandshake },
];

const DashboardSidebar = ({ activePath }: DashboardSidebarProps) => {
  return (
    <aside className="w-[260px] shrink-0">
      <div className="sticky top-6 space-y-6 rounded-3xl bg-tmIvory/95 p-6 shadow-soft ring-1 ring-white/70">
        <div className="rounded-2xl bg-gradient-to-br from-white/70 via-tmIvory to-tmBlush/60 p-4 text-sm text-tmCharcoal/80">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Member suite</p>
          <p className="mt-2 text-sm text-tmCharcoal/80">
            Curated paths to guide every milestone with a concierge touch.
          </p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? activePath === item.href
                : activePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-tmMauve text-white shadow-lg shadow-tmMauve/30'
                    : 'text-tmCharcoal/80 hover:bg-tmBlush/80 hover:text-tmCharcoal'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-tmMauve'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl border border-white/80 bg-white/60 p-4 text-sm text-tmCharcoal/80 shadow-inner">
          <p className="font-semibold text-tmCharcoal">Concierge tip</p>
          <p className="mt-1 text-xs">
            Pause in Learn weekly—fresh rituals, playlists, and registry sprints drop every Friday.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
