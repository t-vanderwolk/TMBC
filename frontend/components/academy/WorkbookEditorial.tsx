import { PenLine } from 'lucide-react';

import type { AcademyModule } from '../../app/dashboard/learn/modules';

type WorkbookEditorialProps = {
  module: AcademyModule;
};

const WorkbookEditorial = ({ module }: WorkbookEditorialProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-6">
    <div className="flex flex-wrap items-center gap-3">
      <PenLine className="h-5 w-5 text-[var(--tm-gold)]" />
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Workbook Studio</p>
        <h2 className="tm-serif-title text-3xl">Milestone companion</h2>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Milestone prompt</p>
        <p className="mt-3 text-lg text-[var(--tm-charcoal)]/80">{module.content.journalPrompt}</p>
      </div>
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-[var(--tm-blush)]/60 p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">Lecture note</p>
        <p className="mt-3 tm-pullquote">{module.content.explore}</p>
      </div>
    </div>
    <div className="rounded-[28px] border border-[var(--tm-gold)]/30 bg-white/70 p-5 text-sm text-[var(--tm-charcoal)]/80">
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">Concierge lecture</p>
      <p className="mt-2 whitespace-pre-line">{module.content.lecture}</p>
    </div>
  </section>
);

export default WorkbookEditorial;
