'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { adminInviteApi, adminWaitlistApi } from '@/lib/api';
import { Auth } from '@/lib/auth.client';

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  status: string;
  createdAt: string;
}

const AdminWaitlistPage = () => {
  const router = useRouter();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const payload = Auth.decode();
    if (!payload || payload.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    const fetchPending = async () => {
      try {
        setLoading(true);
        const response = await adminWaitlistApi.listPending();
        setEntries(response.data || []);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Unable to load waitlist entries.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPending();
  }, [router]);

  const handleAction = async (id: string, type: 'approve' | 'reject') => {
    try {
      setActionError('');
      if (type === 'approve') {
        await adminWaitlistApi.approve(id);
      } else {
        await adminWaitlistApi.reject(id);
      }
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to update entry.';
      setActionError(message);
    }
  };

  if (loading) {
    return (
      <div className="card-surface text-center">
        <p className="text-sm text-tmCharcoal/70">Loading waitlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-surface text-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Admin</p>
        <h1 className="text-4xl">Waitlist Review</h1>
        <p className="text-sm text-tmCharcoal/80">Approve or reject pending applications.</p>
      </header>
      {actionError && <p className="text-sm font-medium text-red-500">{actionError}</p>}
      <div className="overflow-hidden rounded-3xl border border-tmDust bg-white/60">
        <table className="min-w-full divide-y divide-tmDust text-sm">
          <thead className="bg-tmBlush/60 text-left uppercase tracking-wide text-tmCharcoal/70">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Submitted</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tmDust">
            {entries.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-tmCharcoal/70" colSpan={4}>
                  No pending entries.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4">{entry.name || '—'}</td>
                <td className="px-6 py-4">{entry.email}</td>
                <td className="px-6 py-4">{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="btn-primary px-5 py-2 text-xs" onClick={() => handleAction(entry.id, 'approve')}>
                      Approve
                    </button>
                    <button className="btn-secondary px-5 py-2 text-xs" onClick={() => handleAction(entry.id, 'reject')}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWaitlistPage;
