'use client';

import { motion } from 'framer-motion';

type BreadcrumbEditorialProps = {
  journeyLabel: string;
  moduleTitle: string;
  sectionLabel: string;
};

export default function BreadcrumbEditorial({
  journeyLabel,
  moduleTitle,
  sectionLabel,
}: BreadcrumbEditorialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-2 rounded-2xl border border-[var(--tm-blush)] bg-white/80 px-4 py-3 text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]"
    >
      <div className="flex flex-wrap items-center gap-2 text-[0.6rem] font-serif font-semibold tracking-[0.4em] text-[var(--tm-deep-mauve)]">
        <span className="text-[var(--tm-mauve)]">{journeyLabel}</span>
        <span className="text-[var(--tm-gold)]">/</span>
        <span className="font-light text-[var(--tm-deep-mauve)]">{moduleTitle}</span>
        <span className="text-[var(--tm-gold)]">/</span>
        <span className="text-[var(--tm-gold)]">{sectionLabel}</span>
      </div>
      <div className="relative h-1 w-28 overflow-hidden">
        <div className="absolute inset-0 -left-4 h-full w-24 rounded-full bg-gradient-to-r from-[var(--tm-gold)] via-[var(--tm-blush)] to-transparent" />
        <div className="absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      </div>
      <p className="text-xs font-serif uppercase tracking-[0.5em] text-[var(--tm-deep-mauve)]">
        Voyage / Module / Studio
      </p>
    </motion.div>
  );
}
