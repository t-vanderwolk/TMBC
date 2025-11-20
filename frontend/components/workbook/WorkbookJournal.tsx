'use client';

import type { SaveStatus } from '../../hooks/useWorkbook';

type WorkbookJournalProps = {
  value: string;
  onChange: (value: string) => void;
  status: SaveStatus;
  disabled?: boolean;
};

const statusCopy: Record<SaveStatus, string> = {
  idle: 'Auto-saved',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Unable to save',
};

const WorkbookJournal = ({ value, onChange, status, disabled }: WorkbookJournalProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Workbook journal</p>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--tm-deep-mauve)]">{statusCopy[status]}</p>
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Mentor visibility on</span>
    </div>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      rows={9}
      className="min-h-[230px] w-full rounded-[28px] border border-[var(--tm-blush)] bg-white/90 px-5 py-4 text-sm leading-relaxed text-[var(--tm-charcoal)] outline-none transition focus:border-[var(--tm-deep-mauve)]"
      placeholder="Capture the rituals, instincts, and feelings that came up while designing this module."
    />
    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
      Auto-saving in the background for your mentor to reference during check-ins.
    </p>
  </section>
);

export default WorkbookJournal;
