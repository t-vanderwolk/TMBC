'use client';

import { FormEvent, useState } from 'react';

import type { ChecklistItem, SaveStatus } from '../../hooks/useWorkbook';

type WorkbookChecklistProps = {
  items: ChecklistItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onComplete?: () => void;
  onRemove: (id: string) => void;
  status: SaveStatus;
};

const statusCopy: Record<SaveStatus, string> = {
  idle: 'Checklists auto-saved',
  saving: 'Saving checklist…',
  saved: 'Checklist saved',
  error: 'Unable to save',
};

const WorkbookChecklist = ({ items, onAdd, onToggle, onComplete, onRemove, status }: WorkbookChecklistProps) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
  };

  const handleToggle = (item: ChecklistItem) => {
    onToggle(item.id);
    if (!item.completed) {
      onComplete?.();
    }
  };

  return (
    <section className="tm-editorial-card tm-paper-texture space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Apply checklist</p>
          <p className="text-[0.75rem] text-[var(--tm-deep-mauve)]">{statusCopy[status]}</p>
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">Mentor-ready</span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between rounded-[30px] border border-[var(--tm-blush)] bg-white/80 px-4 py-3 text-sm text-[var(--tm-charcoal)]"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggle(item)}
                  className="h-4 w-4 rounded border-[var(--tm-deep-mauve)] text-[var(--tm-deep-mauve)] focus:ring-[var(--tm-deep-mauve)]"
                />
              <span className={item.completed ? 'line-through text-[var(--tm-charcoal)]/60' : ''}>{item.text}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]"
            >
              remove
            </button>
          </label>
        ))}
        {!items.length && (
          <p className="rounded-[24px] border border-[var(--tm-blush)] bg-[var(--tm-ivory)]/70 p-3 text-xs text-[var(--tm-charcoal)]/70">
            Build your custom checklist by adding actions, links, and rituals that feel right for this module.
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="flex-1 min-w-[180px] rounded-full border border-[var(--tm-blush)] px-4 py-2 text-sm text-[var(--tm-charcoal)]"
          placeholder="Add another action"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--tm-deep-mauve)] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white shadow-sm"
        >
          Add
        </button>
      </form>
    </section>
  );
};

export default WorkbookChecklist;
