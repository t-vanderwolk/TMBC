'use client';

import AdminCard from './components/AdminCard';
import AdminTable from './components/AdminTable';
import { useAdminEvents } from '@/hooks/useAdminEvents';
import { useAdminModules } from '@/hooks/useAdminModules';
import { useAdminRegistryMonitor } from '@/hooks/useAdminRegistryMonitor';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function AdminOverviewPage() {
  const { data: statsData } = useAdminStats();
  const { data: eventsData } = useAdminEvents();
  const { data: usersData } = useAdminUsers();
  const { data: registryData } = useAdminRegistryMonitor();
  const { data: modulesData } = useAdminModules();
  const { settings } = useAdminSettings();

  const activityRows = eventsData.items.map((event) => ({
    id: event.id,
    cells: [
      <span key="title" className="font-semibold text-tmCharcoal">
        {event.title}
      </span>,
      <span key="detail" className="text-sm text-tmCharcoal/70">
        {event.detail}
      </span>,
      event.time,
      <span
        key="status"
        className="rounded-full border border-tmMauve/70 bg-tmMauve/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-tmDeepMauve"
      >
        {event.status}
      </span>,
    ],
  }));

  const userRows = usersData.preview.map((user) => ({
    id: user.id,
    cells: [
      <span key="name" className="font-semibold text-tmCharcoal">
        {user.name}
      </span>,
      user.plan,
      user.lastActive,
      <span
        key="status"
        className="rounded-full border border-tmGold/60 bg-tmGold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-tmCharcoal"
      >
        {user.status}
      </span>,
    ],
  }));

  const settingsRows = [
    {
      id: 'invite',
      cells: ['Invite-only mode', settings.inviteOnly ? 'Enabled' : 'Open'],
    },
    {
      id: 'mentor',
      cells: ['Default mentor', settings.defaultMentorId],
    },
    {
      id: 'merchant',
      cells: ['MyRegistry merchant ID', settings.myRegistryMerchantId],
    },
    {
      id: 'affiliate',
      cells: ['Affiliate network', settings.affiliateNetwork],
    },
    {
      id: 'pins',
      cells: ['Pinterest client ID', settings.pinterestClientId],
    },
  ];

  return (
    <div className="space-y-10">
      <section id="metrics" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Metrics</p>
            <h2 className="text-3xl font-serif text-tmDeepMauve">Concierge pulse</h2>
            <p className="text-sm text-tmCharcoal/60">{statsData.narrative}</p>
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
            {statsData.lastRefresh}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {statsData.metrics.map((metric) => (
            <AdminCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              description={metric.description}
              badge={metric.badge}
              accent={metric.accent}
            />
          ))}
        </div>
      </section>

      <section id="activity" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Activity</p>
            <h3 className="text-xl font-serif text-tmDeepMauve">Live pulse feed</h3>
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
            {eventsData.heartbeat}
          </p>
        </div>
        <AdminTable
          title="Activity Feed"
          columns={['Event', 'Detail', 'Time', 'Status']}
          rows={activityRows}
          footnote="Recent updates across experiences"
        />
      </section>

      <section id="users" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Users</p>
            <h3 className="text-xl font-serif text-tmDeepMauve">Preview roster</h3>
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
            {usersData.totalMembers.toLocaleString()} members
          </p>
        </div>
        <AdminTable
          title="Roster snapshot"
          columns={['Member', 'Plan', 'Latest touch', 'Status']}
          rows={userRows}
          footnote="Sorted by most recent activity"
        />
      </section>

      <section id="registry" className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Registry Monitor</p>
            <h3 className="text-xl font-serif text-tmDeepMauve">Curated traction</h3>
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
            {registryData.focus}
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {registryData.entries.map((entry) => (
            <div
              key={entry.id}
              className="space-y-2 rounded-2xl border border-tmBlush/60 bg-white/80 p-5 shadow-soft"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-tmCharcoal/60">
                <span>{entry.module}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-tmCharcoal">
                  {entry.status}
                </span>
              </div>
              <p className="text-lg font-serif text-tmCharcoal">{entry.label}</p>
              <p className="text-xs text-tmCharcoal/60">Updated {entry.updatedAt}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Module Editor Preview</p>
          <h3 className="text-xl font-serif text-tmDeepMauve">Spotlights in the queue</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {modulesData.modules.map((module) => (
            <AdminCard
              key={module.id}
              title={module.title}
              value={module.status}
              subtitle={module.nextMilestone}
              description={`Owner • ${module.owner}`}
              badge={module.focus}
              accent={module.status === 'Live' ? 'gold' : 'charcoal'}
            />
          ))}
        </div>
      </section>

      <section id="settings" className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Settings Preview</p>
          <h3 className="text-xl font-serif text-tmDeepMauve">System snapshot</h3>
        </div>
        <AdminTable
          title="Configuration highlights"
          columns={['Setting', 'Value']}
          rows={settingsRows}
          footnote="Live system values"
        />
      </section>
    </div>
  );
}
