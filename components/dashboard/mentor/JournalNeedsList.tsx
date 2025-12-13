"use client";

export type JournalEntryPreview = {
  id: string;
  member: string;
  preview: string;
  updatedAt: string;
};

type JournalNeedsListProps = {
  journals: JournalEntryPreview[];
};

export default function JournalNeedsList({ journals }: JournalNeedsListProps) {
  if (!journals.length) {
    return <p className="text-sm text-[#3E2F35]/60">No journal replies pending.</p>;
  }

  return (
    <div className="journal-needs">
      {journals.map((entry) => (
        <article key={entry.id} className="journal-entry">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
              {entry.member}
            </p>
            <p className="font-serif text-lg text-[#3E2F35]">{entry.updatedAt}</p>
            <p className="mt-1 text-sm text-[#3E2F35]/70 journal-preview">
              {entry.preview.length > 120
                ? `${entry.preview.slice(0, 117).trim()}…`
                : entry.preview}
            </p>
          </div>
          <button type="button" className="mentor-task-item__action">
            Reply →
          </button>
        </article>
      ))}
    </div>
  );
}
