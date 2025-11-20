'use client';

import type { CSSProperties, DragEvent } from 'react';

import type { MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';

type MoodboardTileProps = {
  tile: MoodboardTileData;
  style?: CSSProperties;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onResize: () => void;
  onSavePin: () => void;
  saving?: boolean;
};

const MoodboardTile = ({
  tile,
  style,
  onDragStart,
  onDragOver,
  onDrop,
  onResize,
  onSavePin,
  saving,
}: MoodboardTileProps) => (
  <div
    draggable
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
    className="relative flex h-full w-full items-stretch overflow-hidden rounded-[26px] border border-white/30 bg-cover bg-center"
    style={{ backgroundImage: `url(${tile.imageUrl})`, ...style }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />
    <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.4em]">{tile.size}</p>
        <p className="mt-2 text-lg font-semibold leading-tight">{tile.caption || 'Moodboard tile'}</p>
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
);

export default MoodboardTile;
