'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  note: string;
};

const fallbackEntries: WaitlistEntry[] = [
  { id: '1', name: 'Ariana Park', email: 'ariana@example.com', note: 'Austin member referral' },
  { id: '2', name: 'Camille Rhodes', email: 'camille@example.com', note: 'Interested in concierge registry' },
];

export default function AdminWaitlistPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>(fallbackEntries);

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
    const fetchWaitlist = async () => {
      try {
        const response = await api.get('/api/admin/waitlist');
        console.log(response.data);
        // TODO: replace placeholder entries with backend payload
      } catch (error) {
        console.error('Waitlist placeholder error', error);
      }
    };
    fetchWaitlist();
  }, [ready]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    console.log(`Waitlist ${action}:`, id);
    // TODO: call approve/reject endpoints + trigger email on approval
  };

  if (!ready) return null;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Admin · Waitlist</p>
        <h1 className="text-4xl text-tmCharcoal">Pending families waiting for a warm welcome.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Review applications, add concierge notes, and send approvals with one click.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-4 rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-base font-semibold text-tmCharcoal">{entry.name}</p>
              <p className="text-sm text-tmCharcoal/70">{entry.email}</p>
              <p className="mt-2 text-sm text-tmCharcoal/80">{entry.note}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAction(entry.id, 'approve')}
                className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-4 py-2 text-sm font-semibold text-white"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => handleAction(entry.id, 'reject')}
                className="inline-flex items-center gap-2 rounded-full border border-tmBlush/50 px-4 py-2 text-sm font-semibold text-tmCharcoal"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
        <p className="text-xs text-tmCharcoal/60">// TODO: email on approval + share concierge onboarding links</p>
      </section>
    </div>
  );
}
