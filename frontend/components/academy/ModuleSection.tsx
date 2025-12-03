'use client';

import type { ReactNode } from 'react';

type ModuleSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export default function ModuleSection({
  id,
  title,
  description,
  className,
  children,
}: ModuleSectionProps) {
  return (
    <section
      id={id}
      className={`space-y-5 rounded-[32px] border border-[var(--tm-blush)] bg-white/80 p-6 shadow-editorial backdrop-blur ${className ?? ''}`}
    >
      {title && (
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">{title}</p>
          {description && (
            <p className="text-lg font-serif text-[var(--tm-deep-mauve)] leading-relaxed">{description}</p>
          )}
        </div>
      )}
      {!title && description && (
        <p className="text-lg font-serif text-[var(--tm-deep-mauve)] leading-relaxed">{description}</p>
      )}
      {children}
    </section>
  );
}
