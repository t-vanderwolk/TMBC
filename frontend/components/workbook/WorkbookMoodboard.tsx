'use client';

import { DragEvent, FormEvent, useState } from 'react';

import type { SaveStatus, MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';
import MoodboardTile from './MoodboardTile';
import PinPickerModal from '@/components/pinterest/PinPickerModal';
import { detectBrandFromText } from '@/utils/pinSuggestions';
import type { PinterestPin, UsePinterestReturn } from '@/hooks/usePinterest';

type WorkbookMoodboardProps = {
  tiles: MoodboardTileData[];
  status: SaveStatus;
  onAddTile: (tile: Omit<MoodboardTileData, 'id'>) => void;
  onResizeTile: (id: string, size: MoodboardTileData['size']) => void;
  onReorderTiles: (sourceId: string, targetId: string) => void;
  onSavePin: (tile: MoodboardTileData) => Promise<void>;
  pinterest: UsePinterestReturn;
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
  const [draggingTileId, setDraggingTileId] = useState<string | null>(null);

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
    setDraggingTileId(id);
    event.dataTransfer?.setData('text/plain', id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    const sourceId = event.dataTransfer?.getData('text/plain');
    if (sourceId && sourceId !== targetId) {
      onReorderTiles(sourceId, targetId);
    }
    setDraggingTileId(null);
  };

  const handleDragEnd = () => {
    setDraggingTileId(null);
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

  const handlePinSelection = (pin: PinterestPin) => {
    const imageUrl = resolvePinImage(pin);
    if (!imageUrl) return;

    const caption = pin.title || pin.description || 'Pinterest inspiration ✨';
    const brandHint = detectBrandFromText(
      [pin.title, pin.description, pin.note].filter(Boolean).join(' '),
    );

    onAddTile({
      imageUrl,
      caption,
      link: pin.link ?? undefined,
      size: 'medium',
      sourceBrand: brandHint ?? undefined,
    });
    pinterest.closePicker();
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
            Pinterest · {pinterest.summary}
          </span>
          <button
            type="button"
            onClick={() => void pinterest.openPicker()}
            className="rounded-full border border-[var(--tm-deep-mauve)] bg-[var(--tm-mauve)]/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition hover:border-[var(--tm-deep-mauve)]/80 hover:bg-[var(--tm-mauve)]/20"
          >
            Import from Pinterest
          </button>
          <button
            type="button"
            onClick={() => void pinterest.initiateAuth()}
            disabled={pinterest.connected}
            className="rounded-full border border-[var(--tm-deep-mauve)] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition disabled:cursor-not-allowed disabled:text-[var(--tm-deep-mauve)]/60 disabled:border-[var(--tm-deep-mauve)]/40"
          >
            {pinterest.connected ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
      {pinterest.message && (
        <p className="text-xs text-[var(--tm-deep-mauve)]/80">{pinterest.message}</p>
      )}
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-white/80 p-4 shadow-[0_25px_55px_rgba(134,75,95,0.12)]">
        <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
          {tiles.map((tile) => (
            <div key={tile.id} className="mb-3 break-inside-avoid overflow-hidden rounded-[26px] border border-white/60 bg-gradient-to-b from-white to-white/70">
              <MoodboardTile
                tile={tile}
                onDragStart={(event) => handleDragStart(event, tile.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, tile.id)}
                onDragEnd={handleDragEnd}
                onResize={() => handleResize(tile)}
                onSavePin={() => handlePin(tile)}
                saving={savingTileId === tile.id}
                isDragging={draggingTileId === tile.id}
                isSaving={savingTileId === tile.id}
              />
            </div>
          ))}
          {!tiles.length && (
            <div className="mb-3 break-inside-avoid rounded-[26px] border border-dashed border-[var(--tm-blush)]/70 bg-[var(--tm-ivory)]/70 p-4 text-sm text-[var(--tm-charcoal)]/70">
              <p>Drag, drop, or import from Pinterest to craft a tactile moodboard.</p>
              <button
                type="button"
                onClick={() => void pinterest.openPicker()}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-[var(--tm-deep-mauve)] px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]"
              >
                Import pins
              </button>
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
      {pinterest.isPickerOpen && (
        <PinPickerModal
          boards={pinterest.boards}
          pins={pinterest.pins}
          selectedBoard={pinterest.selectedBoard}
          loadingBoards={pinterest.loadingBoards}
          loadingPins={pinterest.loadingPins}
          error={pinterest.pickerError}
          onSelectBoard={pinterest.selectBoard}
          onSelectPin={handlePinSelection}
          onClose={pinterest.closePicker}
        />
      )}
    </section>
  );
};

const resolvePinImage = (pin: PinterestPin): string | undefined => {
  const preferredSizes = ['736x', '564x', '400x400', 'original'];
  for (const size of preferredSizes) {
    const image = pin.media?.images?.[size];
    if (image?.url) {
      return image.url;
    }
  }

  const firstImage = pin.media?.images ? Object.values(pin.media.images)[0] : undefined;
  return firstImage?.url;
};

export default WorkbookMoodboard;
