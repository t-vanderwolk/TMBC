import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import type { AcademyModule } from '../../app/dashboard/learn/modules';
import { journeyMeta } from '../../app/dashboard/learn/modules';

type ModuleLayoutEditorialProps = {
  module: AcademyModule;
  children: ReactNode;
};

const ModuleLayoutEditorial = ({ module, children }: ModuleLayoutEditorialProps) => {
  const meta = journeyMeta[module.journey];

  return (
    <div className="space-y-10">
      <section className="tm-paper-texture rounded-[40px] border border-[var(--tm-blush)] bg-gradient-to-br from-white via-[var(--tm-blush)] to-[var(--tm-ivory)]">
        <div className="sticky top-20 z-20 rounded-[40px] bg-white/80 px-6 py-10 backdrop-blur-lg">
          <nav className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            <Link href="/dashboard" className="hover:text-[var(--tm-deep-mauve)]">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/learn" className="hover:text-[var(--tm-deep-mauve)]">
              Academy
            </Link>
            <span>/</span>
            <span className="text-[var(--tm-deep-mauve)]">{meta.label}</span>
          </nav>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-center">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
                {meta.label}
              </p>
              <h1 className="tm-serif-title mt-3 text-4xl md:text-5xl leading-tight">
                {module.title}
              </h1>
              <p className="mt-3 text-lg text-[var(--tm-charcoal)]/75">{module.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]">
                <span className="tm-gold-bracket">{module.registryFocus}</span>
                <span>{module.estimatedMinutes} min atelier</span>
                <span>{module.track}</span>
              </div>
            </div>
            <div className="relative h-52 w-full overflow-hidden rounded-[32px] border border-[var(--tm-blush)] bg-[var(--tm-ivory)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${module.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tm-charcoal)]/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.45em] text-white/90">
                Studio {module.order}
              </div>
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--tm-deep-mauve)]">
                <span>Next</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="space-y-8">{children}</div>
    </div>
  );
};

export default ModuleLayoutEditorial;
