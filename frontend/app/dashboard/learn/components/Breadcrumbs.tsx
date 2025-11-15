import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { AcademyModule } from '../modules';
import { journeyMeta } from '../modules';

type BreadcrumbsProps = {
  module: AcademyModule;
};

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Learn', href: '/dashboard/learn' },
];

const Breadcrumbs = ({ module }: BreadcrumbsProps) => {
  const journeyLabel = journeyMeta[module.journey].label;

  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal/60">
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-1">
          <Link href={item.href} className="hover:text-tmMauve">
            {item.label}
          </Link>
          <ChevronRight className="h-3 w-3 text-tmCharcoal/40" />
        </div>
      ))}
      <div className="flex items-center gap-1">
        <span className="hover:text-tmMauve">{journeyLabel}</span>
        <ChevronRight className="h-3 w-3 text-tmCharcoal/40" />
      </div>
      <span className="text-tmMauve">{module.title}</span>
    </nav>
  );
};

export default Breadcrumbs;
