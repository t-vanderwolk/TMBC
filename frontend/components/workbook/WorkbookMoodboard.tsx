'use client';

import { DragEvent, FormEvent, useState } from 'react';

import type { SaveStatus, MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';
import MoodboardTile from './MoodboardTile';

const sizeSpanMap: Record<MoodboardTileData['size'], number> = {
  small: 6,
  medium: 8,
  large: 12,
};

type PinterestState = {
  status: string;
  message: string | null;
  summary: string;
  initiateAuth: () => Promise<void>;
};

type WorkbookMoodboardProps = {
  tiles: MoodboardTileData[];
  status: SaveStatus;
  onAddTile: (tile: Omit<MoodboardTileData, 'id'>) => void;
  onResizeTile: (id: string, size: MoodboardTileData['size']) => void;
  onReorderTiles: (sourceId: string, targetId: string) => void;
  onSavePin: (tile: MoodboardTileData) => Promise<void>;
  pinterest: PinterestState;
};

const WorkbookMoodboard = ({
  tiles,
  status,
  onAddTile,
  onResizeTile,
  onReorderTiles,
  onSavePin,
  pinterest,
}: WorkbookMoodboardProps) => {
  const [formState, setFormState] = useState({
    imageUrl: '',
    caption: '',
    link: '',
    size: 'medium' as MoodboardTileData['size'],
  });
  const [savingTileId, setSavingTileId] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.imageUrl) return;
    onAddTile({
      imageUrl: formState.imageUrl,
      caption: formState.caption,
      link: formState.link || undefined,
      size: formState.size,
    });
    setFormState({ imageUrl: '', caption: '', link: '', size: 'medium' });
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer?.setData('text/plain', id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    const sourceId = event.dataTransfer?.getData('text/plain');
    if (sourceId && sourceId !== targetId) {
      onReorderTiles(sourceId, targetId);
    }
  };

  const handleResize = (tile: MoodboardTileData) => {
    const order: MoodboardTileData['size'][] = ['small', 'medium', 'large'];
    const next = order[(order.indexOf(tile.size) + 1) % order.length];
    onResizeTile(tile.id, next);
  };

  const handlePin = async (tile: MoodboardTileData) => {
    setSavingTileId(tile.id);
    try {
      await onSavePin(tile);
    } finally {
      setSavingTileId(null);
    }
  };

  const statusCopy: Record<SaveStatus, string> = {
    idle: 'Moodboard auto-saved',
    saving: 'Saving moodboard…',
    saved: 'Moodboard saved',
    error: 'Unable to save moodboard',
  };

  return (
    <section className="tm-editorial-card tm-paper-texture space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Moodboard studio</p>
          <p className="text-[0.75rem] text-[var(--tm-deep-mauve)]">{statusCopy[status]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
            Pinterest · {pinterest.summary}
          </span>
          <button
            type="button"
            onClick={() => pinterest.initiateAuth()}
            className="rounded-full border border-[var(--tm-deep-mauve)] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]"
          >
            Connect
          </button>
        </div>
      </div>
      {pinterest.message && (
        <p className="text-xs text-[var(--tm-deep-mauve)]/80">{pinterest.message}</p>
      )}
      <div className="grid auto-rows-[5rem] gap-4 rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-4 shadow-[0_25px_55px_rgba(134,75,95,0.12)] sm:auto-rows-[6rem] lg:auto-rows-[8rem]">
        <div
          className="grid h-full gap-3 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridAutoRows: '150px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {tiles.map((tile) => (
            <MoodboardTile
              key={tile.id}
              tile={tile}
              style={{ gridRowEnd: `span ${sizeSpanMap[tile.size]}` }}
              onDragStart={(event) => handleDragStart(event, tile.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, tile.id)}
              onResize={() => handleResize(tile)}
              onSavePin={() => handlePin(tile)}
              saving={savingTileId === tile.id}
            />
          ))}
          {!tiles.length && (
            <div className="col-span-full rounded-[26px] border border-dashed border-[var(--tm-blush)]/70 bg-[var(--tm-ivory)]/70 p-4 text-sm text-[var(--tm-charcoal)]/70">
              Drag, drop, and resize tiles to craft a textured moodboard.
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-[28px] border border-[var(--tm-blush)] bg-[var(--tm-blush)]/30 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            Image URL
            <input
              value={formState.imageUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, imageUrl: event.target.value }))}
              className="mt-1 w-full rounded-[18px] border border-white/60 px-3 py-2 text-sm text-[var(--tm-charcoal)]"
              placeholder="https://..."
              required
            />
          </label>
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            Caption
            <input
              value={formState.caption}
              onChange={(event) => setFormState((prev) => ({ ...prev, caption: event.target.value }))}
              className="mt-1 w-full rounded-[18px] border border-white/60 px-3 py-2 text-sm text-[var(--tm-charcoal)]"
              placeholder="Soft glow, calming neutrals"
            />
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            Link (optional)
            <input
              value={formState.link}
              onChange={(event) => setFormState((prev) => ({ ...prev, link: event.target.value }))}
              className="mt-1 w-full rounded-[18px] border border-white/60 px-3 py-2 text-sm text-[var(--tm-charcoal)]"
              placeholder="Shop or inspiration link"
            />
          </label>
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            Tile size
            <select
              value={formState.size}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, size: event.target.value as MoodboardTileData['size'] }))
              }
              className="mt-1 w-full rounded-[18px] border border-white/60 bg-white px-3 py-2 text-sm text-[var(--tm-charcoal)]"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--tm-gold)] px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white shadow-sm transition hover:bg-[var(--tm-gold)]/90"
        >
          Add tile
        </button>
      </form>
    </section>
  );
};

export default WorkbookMoodboard;
