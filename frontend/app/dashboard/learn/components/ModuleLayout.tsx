import type { ReactNode } from 'react';

import { journeyMeta } from '../modules';
import type { AcademyModule } from '../modules';
import Breadcrumbs from './Breadcrumbs';

type ModuleLayoutProps = {
  module: AcademyModule;
  children: ReactNode;
};

const ModuleLayout = ({ module, children }: ModuleLayoutProps) => {
  const meta = journeyMeta[module.journey];

  return (
    <div className="space-y-8 px-6 py-10 md:px-10">
      <Breadcrumbs module={module} />
      <div className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-8 shadow-soft">
        <p className="font-script text-3xl text-tmMauve">
          Taylor-Made Baby Academy
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-tmCharcoal/70">
              {meta.label}
            </p>
            <h1 className="mt-2 text-4xl text-tmCharcoal">{module.title}</h1>
            <p className="mt-3 text-base text-tmCharcoal/80">
              {module.subtitle}
            </p>
          </div>
          <div className="rounded-3xl border border-tmBlush/50 bg-white/70 px-6 py-4 text-sm text-tmCharcoal/80 shadow-inner">
            <p className="font-semibold text-tmCharcoal">Focus</p>
            <p className="text-tmMauve">{module.registryFocus}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.4em] text-tmCharcoal/60">
              {module.estimatedMinutes} min studio
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default ModuleLayout;
