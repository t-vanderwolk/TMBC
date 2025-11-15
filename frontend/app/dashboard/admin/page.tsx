'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, ClipboardList, Sparkles } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

const stats = [
  { label: 'Total Members', value: '148', icon: Users },
  { label: 'Active Invites', value: '32', icon: Sparkles },
  { label: 'Waitlist Pending', value: '67', icon: ClipboardList },
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      router.replace('/login');
      return;
    }

    const role = String(session.payload?.role ?? '').toLowerCase();
    if (role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const fetchAdminData = async () => {
      try {
        await api.get('/api/admin/overview');
        // TODO: charts + analytics backend hookup
      } catch (error) {
        console.error('Admin overview placeholder error', error);
      }
    };
    fetchAdminData();
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Admin Command</p>
        <h1 className="text-4xl text-tmCharcoal">Taylor-Made HQ</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Monitor members, invites, mentors, and waitlist momentum from a single dashboard.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-tmBlush/40 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <stat.icon className="h-6 w-6 text-tmMauve" />
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">{stat.label}</p>
            </div>
            <p className="mt-2 text-3xl font-semibold text-tmCharcoal">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-tmMauve" />
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Growth Snapshot</p>
            <h2 className="text-2xl text-tmCharcoal">Invites, waitlist, mentor performance</h2>
          </div>
        </div>
        <p className="mt-3 text-sm text-tmCharcoal/70">
          Visuals plug in here to show weekly conversions and mentor KPIs.
        </p>
        <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: add charts + analytics integration</p>
      </section>
    </div>
  );
}
