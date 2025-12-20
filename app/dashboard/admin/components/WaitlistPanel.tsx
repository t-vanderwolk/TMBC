'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { AdminWaitlistEntry } from '@/lib/services/server/waitlist.service';

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

type WaitlistPanelProps = {
  entries: AdminWaitlistEntry[];
};

export default function WaitlistPanel({ entries: initialEntries }: WaitlistPanelProps) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async (entryId: string) => {
    setError(null);
    setInvitingId(entryId);

    try {
      const response = await fetch(`/api/admin/waitlist/${entryId}/invite`, { method: 'POST' });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to convert this entry to an invite.');
      }

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                invited: true,
                invitedAt: payload?.data?.createdAt ?? new Date().toISOString(),
                invite: payload?.data ?? entry.invite,
              }
            : entry,
        ),
      );

      router.refresh();
    } catch (err) {
      console.error('[WaitlistPanel] invite failed', err);
      setError(err instanceof Error ? err.message : 'Unable to send the invite.');
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <section className="space-y-5 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_60px_rgba(62,47,53,0.2)]">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Admin · Waitlist</p>
        <h2 className="text-3xl font-serif text-[#3E2F35]">Waitlist concierge</h2>
        <p className="text-sm text-[#3E2F35]/70">
          Invite families with a single tap and keep the concierge tone intact without rearranging the invite workflow.
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-[#E3D0D7] bg-[#FFF8F6]/70 p-6 text-center text-sm uppercase tracking-[0.35em] text-[#3E2F35]/70">
            No waitlist entries yet. Families will appear here as they reach out.
          </div>
        ) : (
          entries.map((entry) => {
            const sourceLabel = entry.source?.trim() || 'Homepage request';
            const submittedLabel = formatDate(entry.createdAt);
            const isInviting = invitingId === entry.id;

            return (
              <article
                key={entry.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#E3D0D7] bg-[#FFFBFA]/80 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[#3E2F35]">{entry.email}</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">{sourceLabel}</p>
                  {entry.note && <p className="text-sm text-[#3E2F35]/70">{entry.note}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                  <p className="text-[0.6rem] tracking-[0.4em] text-[#C8A1B4]">Submitted</p>
                  <p className="text-[0.75rem] tracking-[0.25em] text-[#3E2F35]/70">{submittedLabel}</p>
                  {entry.invited ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-700">
                      Invited
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInvite(entry.id)}
                      disabled={isInviting}
                      className="rounded-full border border-[#E3D0D7] bg-[#3E2F35] px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#2a2327] disabled:opacity-60"
                    >
                      {isInviting ? 'Sending…' : 'Send invite'}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
