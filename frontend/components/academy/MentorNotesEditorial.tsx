import { HeartHandshake } from 'lucide-react';

import type { AcademyModule } from '../../app/dashboard/learn/modules';

type MentorNotesEditorialProps = {
  module: AcademyModule;
};

const MentorNotesEditorial = ({ module }: MentorNotesEditorialProps) => (
  <section className="tm-editorial-card tm-paper-texture space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <HeartHandshake className="h-5 w-5 text-[var(--tm-gold)]" />
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Mentor notes</p>
        <h2 className="tm-serif-title text-3xl">Relationship with the team</h2>
      </div>
    </div>
    <p className="text-sm text-[var(--tm-charcoal)]/80">
      Stay in rhythm with your mentor by sharing every discovery. Mention this module's focus on <strong>{module.registryFocus}</strong> and how it intersects with your {module.track.toLowerCase()} rituals.
    </p>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-4 text-sm text-[var(--tm-charcoal)]/80">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">Gentle reminder</p>
        <p className="mt-2">Capture any sensory cues that make your space feel like home and drop them into Journal before your check-in.</p>
      </div>
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-4 text-sm text-[var(--tm-charcoal)]/80">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">Concierge tip</p>
        <p className="mt-2">List the {module.estimatedMinutes}-minute rituals you can repeat weekly and ask your mentor to spotlight one for accountability.</p>
      </div>
    </div>
  </section>
);

export default MentorNotesEditorial;
