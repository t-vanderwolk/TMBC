'use client';

import { Notebook } from 'lucide-react';

import type { MentorJournalShare } from '@/types/mentor';

type MentorJournalShareBannerProps = {
  shares: MentorJournalShare[];
};

const MentorJournalShareBanner = ({ shares }: MentorJournalShareBannerProps) => {
  if (!shares.length) {
    return (
      <div className="rounded-2xl border border-dashed border-member-border-soft bg-member-background-soft p-4 text-sm text-member-text-secondary">
        <p className="font-semibold text-member-text-primary">No journal entries shared yet</p>
        <p className="mt-1 text-xs text-member-text-secondary">
          This section will populate as mentees share reflections.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-member-border-soft bg-member-background-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-member-accent-secondary">
        <Notebook className="h-4 w-4 text-member-accent-primary" />
        Shared Journal Entries
      </div>
      <ul className="space-y-2 text-sm text-member-text-secondary">
        {shares.map((share) => (
          <li key={share.shareId} className="rounded-xl bg-member-background-soft p-3">
            <p className="font-semibold text-member-text-primary">{share.excerpt || "Reflection"}</p>
            <p className="text-xs text-member-text-secondary">
              Shared {new Date(share.sharedAt).toLocaleDateString()} · Entry {share.journalId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorJournalShareBanner;
