'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

import { useEasterEggs } from '@/components/academy/Interactions';

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlight: string;
  ctaLabel: string;
  ctaHref: string;
  featuredModule?: string;
};

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EditorialHero = ({
  eyebrow,
  title,
  description,
  highlight,
  ctaLabel,
  ctaHref,
  featuredModule,
}: EditorialHeroProps) => {
  const { highlightClicked, fairyIsPresent, dismissFairy } = useEasterEggs();

  const fairyCopy = useMemo(() => ({
    title: '✨ Nursery Fairy appears',
    detail: 'She leaves a trail of lullaby confetti and a reminder to breathe between minutes.',
  }), []);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fade}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="tm-paper-texture tm-soft-fade relative overflow-hidden rounded-[40px] border border-[var(--tm-blush)] bg-gradient-to-br from-[var(--tm-ivory)] via-[var(--tm-blush)] to-white/80 p-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="tm-editorial-card grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">{eyebrow}</p>
          <h1 className="tm-serif-title text-4xl md:text-5xl leading-tight text-[var(--tm-deep-mauve)]">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-[var(--tm-charcoal)]/75">{description}</p>
          <motion.div
            role="button"
            tabIndex={0}
            onClick={highlightClicked}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                highlightClicked();
              }
            }}
            className="rounded-2xl border border-[var(--tm-gold)] bg-white/80 px-5 py-3 text-sm font-medium leading-snug text-[var(--tm-deep-mauve)] shadow-[0_20px_60px_rgba(213,193,158,0.15)]"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 45px rgba(213,193,158,0.35)' }}
            whileTap={{ scale: 0.98 }}
          >
            {highlight}
          </motion.div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition hover:bg-white"
            >
              {ctaLabel}
              <span aria-hidden="true" className="text-[var(--tm-gold)]">
                &rarr;
              </span>
            </Link>
            {featuredModule && (
              <span className="tm-gold-bracket text-[0.6rem] uppercase tracking-[0.6em] text-[var(--tm-deep-mauve)]">
                {featuredModule}
              </span>
            )}
          </div>
        </div>
        <motion.div
          className="relative rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-inner"
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          <div className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Studio signal</p>
            <p className="text-sm text-[var(--tm-charcoal)]/80 leading-relaxed">{highlight}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="rounded-full bg-[var(--tm-blush)]/40 px-3 py-1 text-[0.7rem] font-semibold text-[var(--tm-deep-mauve)]">
                Atelier concierge
              </div>
              <motion.div
                className="rounded-full bg-[var(--tm-gold)]/30 px-3 py-1 text-[0.65rem] font-semibold text-[var(--tm-gold)]"
                animate={{ boxShadow: ['0 0 0 rgba(213,193,158,0.2)', '0 0 14px rgba(213,193,158,0.45)', '0 0 0 rgba(213,193,158,0.2)'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                GlowPulse
              </motion.div>
            </div>
            <div className="mt-5">
              <div className="tm-section-divider" aria-hidden="true" />
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
                Atelier whispers
              </p>
              <p className="text-sm text-[var(--tm-deep-mauve)]">Soft textures, hands-on rituals, and new modules every week.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 w-36 opacity-30"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="h-full w-full bg-gradient-to-b from-[var(--tm-gold)]/20 via-transparent to-transparent blur-3xl" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -bottom-6 left-5 h-32 w-32 rounded-full bg-[var(--tm-gold)]/30 blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="absolute -top-16 left-10 h-40 w-40 rounded-full bg-[var(--tm-blush)] blur-3xl" />
        <div className="absolute bottom-0 right-6 h-36 w-36 rounded-full bg-[var(--tm-mauve)]/60 blur-3xl" />
      </motion.div>
      <AnimatePresence>
        {fairyIsPresent && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[40px] bg-[var(--tm-deep-mauve)]/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-xs rounded-[32px] border border-white/40 bg-white/90 p-6 text-center">
              <p className="text-lg font-semibold text-[var(--tm-deep-mauve)]">{fairyCopy.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--tm-charcoal)]/80">{fairyCopy.detail}</p>
              <button
                type="button"
                onClick={dismissFairy}
                className="mt-4 rounded-full border border-[var(--tm-deep-mauve)] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--tm-deep-mauve)]"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default EditorialHero;
