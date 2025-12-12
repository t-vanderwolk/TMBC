'use client';

import type { AcademyModule } from '../../app/dashboard/learn/modules';

type ModuleHeroEditorialProps = {
  module: AcademyModule;
};

export default function ModuleHeroEditorial({ module }: ModuleHeroEditorialProps) {
  return (
    <section className="space-y-6 rounded-[40px] border border-[var(--tm-mauve)] bg-gradient-to-br from-[#F6EDF7] via-white to-[var(--tm-ivory)] p-8 shadow-editorial shadow-[0_25px_60px_rgba(143,77,104,0.25)]">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
          Taylor-Made Baby Academy
        </p>
        <h1 className="tm-serif-title text-4xl leading-tight text-[var(--tm-deep-mauve)]">
          {module.title}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--tm-charcoal)]/80">{module.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">
            {module.subtitle}
          </p>
          <p className="text-sm text-[var(--tm-charcoal)]/70 leading-relaxed">{module.registryFocus}</p>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-3xl border border-[var(--tm-gold)] bg-white/80 p-4 text-center">
          <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
            Atelier duration
          </span>
          <strong className="text-2xl font-serif text-[var(--tm-gold)]">{module.estimatedMinutes} min</strong>
          <span className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--tm-deep-mauve)]">
            {module.track}
          </span>
        </div>
      </div>
    </section>
  );
}
