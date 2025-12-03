'use client';

import type { ReactNode } from 'react';

type SlideContainerProps = {
  moduleTitle?: string;
  children: ReactNode;
};

export default function SlideContainer({ moduleTitle, children }: SlideContainerProps) {
  return (
    <div className="animate-tmbcFade space-y-4">
      {moduleTitle && (
        <div className="relative inline-flex flex-col">
          <p className="text-sm uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
            {moduleTitle}
          </p>
          <span className="mt-2 h-1 w-20 rounded-full bg-[var(--tm-gold)] shadow-[0_0_20px_rgba(212,181,121,0.6)]" />
        </div>
      )}
      <div className="text-lg leading-relaxed text-[#3E2F35]">{children}</div>
    </div>
  );
}
