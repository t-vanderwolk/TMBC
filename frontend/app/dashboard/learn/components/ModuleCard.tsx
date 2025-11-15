import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { AcademyModule } from '../modules';

type ModuleCardProps = {
  module: AcademyModule;
};

const ModuleCard = ({ module }: ModuleCardProps) => {
  return (
    <Link
      href={`/dashboard/learn/${module.id}`}
      className="group flex flex-col justify-between rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-5 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-tmMauve">
          {module.track}
        </p>
        <h4 className="text-xl font-semibold text-tmCharcoal">{module.title}</h4>
        <p className="text-sm text-tmCharcoal/80">{module.description}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-tmMauve">
        Enter module
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default ModuleCard;
