'use client';

import type { SaveStatus } from '../../hooks/useWorkbook';

type WorkbookReflectionProps = {
  value: string;
  onChange: (value: string) => void;
  prompts: string[];
  status: SaveStatus;
};

const statusCopy: Record<SaveStatus, string> = {
  idle: 'Reflection auto-saved',
  saving: 'Saving reflections…',
  saved: 'Reflections saved',
  error: 'Unable to save reflections',
};

const WorkbookReflection = ({ value, onChange, prompts, status }: WorkbookReflectionProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Reflection lane</p>
        <p className="text-[0.75rem] text-[var(--tm-deep-mauve)]">{statusCopy[status]}</p>
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Mentor eyes only</span>
    </div>
    <div className="grid gap-3">
      {prompts.map((prompt) => (
        <div
          key={prompt}
          className="rounded-[24px] border border-[var(--tm-blush)] bg-white/80 px-4 py-3 text-sm text-[var(--tm-charcoal)]/80"
        >
          {prompt}
        </div>
      ))}
    </div>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={6}
      placeholder="Capture how your learnings are reshaping your rituals."
      className="w-full rounded-[28px] border border-[var(--tm-blush)] bg-white/90 px-5 py-4 text-sm leading-relaxed text-[var(--tm-charcoal)] outline-none transition focus:border-[var(--tm-deep-mauve)]"
    />
  </section>
);

export default WorkbookReflection;
