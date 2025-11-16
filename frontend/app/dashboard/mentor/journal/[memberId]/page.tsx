'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, NotebookPen } from 'lucide-react';
import Link from 'next/link';

import { api } from '@/lib/api';
import type { MentorJournalShare } from '@/types/mentor';

type MentorJournalPageProps = {
  params: { memberId: string };
};

export default function MentorJournalPage({ params }: MentorJournalPageProps) {
  const { memberId } = params;
  const [entries, setEntries] = useState<MentorJournalShare[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await api.get(`/api/mentor/journal/shared/${memberId}`);
        setEntries(response.data?.data ?? []);
      } catch (error) {
        console.error('Mentor journal share placeholder error', error);
      }
    };

    fetchEntries();
  }, [memberId]);

  return (
    <div className="space-y-6 px-6 py-10 md:px-10">
      <Link
        href="/dashboard/mentor/workspace"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tmMauve"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workspace
      </Link>
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Member Journal</p>
        <h1 className="text-3xl text-tmCharcoal">Shared entries · {memberId}</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">// TODO: show member name + entry count</p>
      </header>

      <section className="space-y-4 rounded-3xl border border-tmBlush/40 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
          <NotebookPen className="h-4 w-4 text-tmMauve" />
          Shared reflections
        </div>
        {entries.length ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.shareId} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-sm text-tmCharcoal">{entry.excerpt || 'Reflection preview coming soon.'}</p>
                <p className="text-xs text-tmCharcoal/60">
                  Shared {new Date(entry.sharedAt).toLocaleString()} · Entry {entry.journalId}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-tmCharcoal/70">// TODO: show CTA for members to share entries</p>
        )}
      </section>
    </div>
  );
}
