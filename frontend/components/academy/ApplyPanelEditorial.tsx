import { Sparkles } from 'lucide-react';

import type { AcademyModule } from '../../app/dashboard/learn/modules';

type ApplyPanelEditorialProps = {
  module: AcademyModule;
};

const ApplyPanelEditorial = ({ module }: ApplyPanelEditorialProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <Sparkles className="h-5 w-5 text-[var(--tm-gold)]" />
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Action board</p>
        <h2 className="tm-serif-title text-3xl">Apply the rhythm</h2>
      </div>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      {module.content.apply.map((item) => (
        <div
          key={item}
          className="rounded-[26px] border border-[var(--tm-blush)] bg-white/80 p-4 text-sm text-[var(--tm-charcoal)]/80"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">Action</p>
          <p className="mt-2 text-[0.9rem]">{item}</p>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button className="rounded-full border border-[var(--tm-deep-mauve)] px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition hover:bg-[var(--tm-deep-mauve)]/10">
        Share with mentor
      </button>
      <button className="rounded-full bg-[var(--tm-gold)]/80 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white shadow-sm">
        Celebrate progress
      </button>
    </div>
  </section>
);

export default ApplyPanelEditorial;
