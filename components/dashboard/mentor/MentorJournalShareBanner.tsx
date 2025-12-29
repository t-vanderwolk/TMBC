'use client';

import { Notebook } from 'lucide-react';

import type { MentorJournalShare } from '@/types/mentor';

type MentorJournalShareBannerProps = {
  shares: MentorJournalShare[];
};

const MentorJournalShareBanner = ({ shares }: MentorJournalShareBannerProps) => {
  if (!shares.length) {
    return (
      <div className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
        <p className="font-semibold text-tmCharcoal">No journal entries shared yet</p>
        <p className="mt-1 text-xs text-tmCharcoal/60">
          This section will populate as mentees share reflections.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-tmBlush/40 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-tmMauve">
        <Notebook className="h-4 w-4 text-tmMauve" />
        Shared Journal Entries
      </div>
      <ul className="space-y-2 text-sm text-tmCharcoal/80">
        {shares.map((share) => (
          <li key={share.shareId} className="rounded-xl bg-tmIvory/70 p-3">
            <p className="font-semibold text-tmCharcoal">{share.excerpt || 'Reflection'}</p>
            <p className="text-xs text-tmCharcoal/60">
              Shared {new Date(share.sharedAt).toLocaleDateString()} · Entry {share.journalId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorJournalShareBanner;
