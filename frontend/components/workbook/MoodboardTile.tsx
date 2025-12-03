'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties, DragEvent } from 'react';

import CardPlaceholder from '@/components/ui/CardPlaceholder';
import type { MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';

type MoodboardTileProps = {
  tile: MoodboardTileData;
  style?: CSSProperties;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onResize: () => void;
  onSavePin: () => void;
  onDragEnd: () => void;
  saving?: boolean;
  isDragging?: boolean;
  isSaving?: boolean;
};

const MoodboardTile = ({
  tile,
  style,
  onDragStart,
  onDragOver,
  onDrop,
  onResize,
  onSavePin,
  onDragEnd,
  saving,
  isDragging,
  isSaving,
}: MoodboardTileProps) => (
  <motion.div
    className="h-full w-full"
    style={style}
    animate={isDragging ? { rotate: [0, -3, 3, -2, 0], scale: [1, 1.01, 0.99, 1] } : { rotate: 0, scale: 1 }}
    transition={
      isDragging
        ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' }
        : { type: 'spring', stiffness: 140, damping: 18 }
    }
  >
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="relative flex h-full w-full items-stretch overflow-hidden rounded-[26px] border border-white/30"
    >
      <CardPlaceholder className="absolute inset-0 !rounded-[26px] !border-white/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />
      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em]">{tile.size}</p>
          <p className="mt-2 text-lg font-semibold leading-tight">{tile.caption || 'Moodboard tile'}</p>
          {tile.sourceBrand && (
            <span className="mt-2 inline-flex items-center rounded-full bg-white/30 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">
              {tile.sourceBrand}
            </span>
          )}
          {tile.link && (
            <a
              href={tile.link}
              target="_blank"
              rel="noreferrer"
              className="text-[0.65rem] text-[var(--tm-gold)] underline"
            >
              View source
            </a>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onResize}
            className="rounded-full border border-white/70 bg-white/30 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em]"
          >
            Resize
          </button>
          <button
            type="button"
            onClick={onSavePin}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--tm-gold)] bg-[var(--tm-gold)]/80 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-charcoal)]"
          >
            {saving ? 'Saving…' : 'Save pin'}
          </button>
        </div>
      </div>
    </div>
    <AnimatePresence>
      {isSaving && (
        <motion.span
          className="pointer-events-none absolute -top-3 right-3 rounded-full border border-white/70 bg-[var(--tm-gold)]/90 px-2 py-1 text-[0.6rem] font-semibold text-[var(--tm-deep-mauve)] shadow-lg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          ✨ Sparkle
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
);

export default MoodboardTile;
