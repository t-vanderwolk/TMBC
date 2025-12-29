'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { adminInviteApi } from '@/lib/api';
import { Auth } from '@/lib/auth';
import { routeForRole } from '@/lib/auth/routeForRole';

interface InviteEntry {
  id: string;
  code: string;
  email?: string;
  role?: string;
  used: boolean;
  usedAt?: string;
  createdAt: string;
  createdByEmail?: string | null;
  sentAt?: string | null;
}

const AdminInvitesPage = () => {
  const router = useRouter();
  const [role, setRole] = useState<'member' | 'mentor' | 'admin'>('member');
  const [email, setEmail] = useState('');
  const [maxUses, setMaxUses] = useState(1);
  const [invites, setInvites] = useState<InviteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resolveStatus = (invite: InviteEntry) => {
    if (invite.used) return 'approved';
    if (invite.sentAt) return 'sent';
    return 'pending';
  };

  useEffect(() => {
    const payload = Auth.decode();
    if (!payload || payload.role !== 'admin') {
      router.replace(routeForRole(payload?.role));
      return;
    }

    const fetchInvites = async () => {
      try {
        setLoading(true);
        const response = await adminInviteApi.list();
        setInvites(response.data.invites || []);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Unable to load invites.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchInvites();
  }, [router]);

  const handleGenerateInvite = async () => {
    try {
      setError('');
      setSuccess('');
      const response = await adminInviteApi.generate({
        role,
        email,
        maxUses,
      });
      setInvites((prev) => [...response.data.invites, ...prev]);
      setEmail('');
      setSuccess('Invite generated successfully.');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to generate invite.';
      setError(message);
    }
  };

  const handleCopyCode = async (inviteCode: string) => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setSuccess('Invite code copied.');
    } catch {
      setError('Unable to copy invite code.');
    }
  };

  if (loading) {
    return (
      <div className="card-surface">
        <p className="text-sm text-tmCharcoal/70">Loading invites...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Admin</p>
        <h1 className="text-4xl">Invite Management</h1>
        <p className="text-sm text-tmCharcoal/80">Generate and review invites for members and mentors.</p>
      </header>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      {success && <p className="text-sm font-medium text-tmMauve">{success}</p>}

      <div className="rounded-3xl border border-tmDust bg-white/70 p-6 space-y-4">
        <h2 className="text-2xl">Generate Invite</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as 'member' | 'mentor' | 'admin')}
              className="rounded-full border border-tmDust bg-white px-4 py-3 text-sm"
            >
              <option value="member">Member</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Email (optional)</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="invitee@email.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Max uses</label>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(event) => setMaxUses(Number(event.target.value))}
            />
          </div>
        </div>
        <button className="btn-primary" onClick={handleGenerateInvite}>
          Generate Invite
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-tmDust bg-white/60">
        <table className="min-w-full divide-y divide-tmDust text-sm">
          <thead className="bg-tmBlush/60 text-left uppercase tracking-wide text-tmCharcoal/70">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Created by</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last sent</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tmDust">
            {invites.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-tmCharcoal/70" colSpan={7}>
                  No invites generated yet.
                </td>
              </tr>
            )}
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td className="px-6 py-4 font-mono">
                  <div className="flex items-center gap-3">
                    <span>{invite.code}</span>
                    <button
                      className="btn-secondary px-3 py-1 text-[0.6rem]"
                      onClick={() => handleCopyCode(invite.code)}
                    >
                      Copy
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">{invite.email || '—'}</td>
                <td className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-tmCharcoal/70">
                  {invite.createdByEmail || '—'}
                </td>
                <td className="px-6 py-4 capitalize">{invite.role?.toLowerCase() || 'member'}</td>
                <td className="px-6 py-4 capitalize">{resolveStatus(invite)}</td>
                <td className="px-6 py-4">
                  {invite.sentAt ? new Date(invite.sentAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4 text-right">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInvitesPage;
