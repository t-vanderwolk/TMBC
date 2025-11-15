'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailPlus, Send, Users } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type Invite = {
  code: string;
  role: string;
  remainingUses: number;
  email?: string;
};

const fallbackInvites: Invite[] = [
  { code: 'TMBC-FAIRY', role: 'member', remainingUses: 3 },
  { code: 'TMBC-MENTOR', role: 'mentor', remainingUses: 1, email: 'mentor@example.com' },
];

export default function AdminInvitesPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invites, setInvites] = useState<Invite[]>(fallbackInvites);
  const [role, setRole] = useState('member');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      router.replace('/login');
      return;
    }

    const decodedRole = String(session.payload?.role ?? '').toLowerCase();
    if (decodedRole !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const fetchInvites = async () => {
      try {
        await api.get('/invite/list');
        // TODO: replace fallback data with invite API response
      } catch (error) {
        console.error('Invite list placeholder error', error);
      }
    };
    fetchInvites();
  }, [ready]);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Generate invite', { role, quantity, email });
    // TODO: call invite generate endpoint + refresh list
  };

  const handleSendInvite = (code: string) => {
    console.log('Send invite', code);
    // TODO: hook into invite send endpoint + email queue
  };

  if (!ready) return null;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Admin · Invites</p>
        <h1 className="text-4xl text-tmCharcoal">Curate who joins Taylor-Made.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Generate invite codes, assign roles, and send concierge-ready onboarding emails.
        </p>
      </header>

      <section className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        <form onSubmit={handleGenerate} className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.5em] text-tmMauve">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-2xl border border-tmBlush/40 bg-tmIvory/80 px-4 py-3 text-sm text-tmCharcoal outline-none"
            >
              <option value="member">Member</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.5em] text-tmMauve">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-2xl border border-tmBlush/40 bg-tmIvory/80 px-4 py-3 text-sm text-tmCharcoal outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs uppercase tracking-[0.5em] text-tmMauve">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vip@taylormadebaby.co"
              className="rounded-2xl border border-tmBlush/40 bg-tmIvory/80 px-4 py-3 text-sm text-tmCharcoal outline-none"
            />
          </div>
          <div className="md:col-span-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white shadow-soft">
              <MailPlus className="h-4 w-4" />
              Generate Invite
            </button>
          </div>
        </form>
        <p className="mt-2 text-xs text-tmCharcoal/60">// TODO: pagination + filters for large invite sets</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-tmMauve" />
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Invite Table</p>
            <h2 className="text-2xl text-tmCharcoal">Recent invites</h2>
          </div>
        </div>
        <div className="space-y-3">
          {invites.map((invite) => (
            <div key={invite.code} className="flex flex-col gap-3 rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-tmCharcoal">{invite.code}</p>
                <p className="text-sm text-tmCharcoal/70">
                  {invite.role.toUpperCase()} · Uses left {invite.remainingUses}
                </p>
                {invite.email && <p className="text-sm text-tmCharcoal/70">Reserved for {invite.email}</p>}
              </div>
              <button
                onClick={() => handleSendInvite(invite.code)}
                className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve"
              >
                <Send className="h-4 w-4" />
                Send invite
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
