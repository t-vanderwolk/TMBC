'use client';

import type { PinterestBoard, PinterestPin } from '@/hooks/usePinterest';

type PinPickerModalProps = {
  boards: PinterestBoard[];
  pins: PinterestPin[];
  selectedBoard: PinterestBoard | null;
  loadingBoards: boolean;
  loadingPins: boolean;
  error: string | null;
  onSelectBoard: (board: PinterestBoard) => Promise<void> | void;
  onSelectPin: (pin: PinterestPin) => void;
  onClose: () => void;
};

const getPinPreview = (pin: PinterestPin) => {
  const priority = ['736x', '564x', '400x400', 'original'];
  for (const key of priority) {
    const candidate = pin.media?.images?.[key];
    if (candidate?.url) return candidate.url;
  }
  const fallback = pin.media?.images ? Object.values(pin.media.images)[0] : undefined;
  return fallback?.url;
};

export default function PinPickerModal({
  boards,
  pins,
  selectedBoard,
  loadingBoards,
  loadingPins,
  error,
  onSelectBoard,
  onSelectPin,
  onClose,
}: PinPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl tm-fade-in">
        <h2 className="font-playfair text-2xl text-[var(--tm-deep-mauve)]">
          Import from Pinterest
        </h2>
        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        {!selectedBoard && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {loadingBoards && (
              <div className="col-span-2 rounded-2xl border border-dashed border-[var(--tm-mauve)]/30 bg-[var(--tm-mauve)]/10 p-4 text-sm text-[var(--tm-deep-mauve)]">
                Loading boards…
              </div>
            )}
            {!loadingBoards && !boards.length && (
              <div className="col-span-2 rounded-2xl border border-dashed border-[var(--tm-mauve)]/30 bg-[var(--tm-mauve)]/10 p-4 text-sm text-[var(--tm-deep-mauve)]">
                Connect Pinterest to browse your boards.
              </div>
            )}
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => void onSelectBoard(board)}
                className="rounded-2xl border border-[var(--tm-mauve)]/30 bg-[var(--tm-mauve)]/10 p-4 text-left transition hover:border-[var(--tm-mauve)]/60 hover:bg-white"
              >
                <p className="font-semibold text-[var(--tm-deep-mauve)]">{board.name}</p>
                <p className="text-xs text-[var(--tm-mauve)]/80">{board.description ?? '—'}</p>
              </button>
            ))}
          </div>
        )}

        {selectedBoard && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--tm-deep-mauve)]">{selectedBoard.name}</h3>
              <button
                type="button"
                onClick={() => selectedBoard && void onSelectBoard(selectedBoard)}
                className="text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]/70"
              >
                refresh
              </button>
            </div>
            <div className="rounded-2xl border border-[var(--tm-mauve)]/30 bg-[var(--tm-mauve)]/10 p-4 text-xs text-[var(--tm-deep-mauve)]/80">
              Browse the latest pins from this board.
            </div>
            <div className="grid grid-cols-3 gap-3 overflow-y-auto text-sm">
              {loadingPins && (
                <div className="col-span-3 rounded-2xl border border-dashed border-mauve-200 bg-white/80 p-4 text-center">
                  Gathering pins…
                </div>
              )}
              {!loadingPins && !pins.length && (
                <div className="col-span-3 rounded-2xl border border-dashed border-[var(--tm-mauve)]/30 bg-white/80 p-4 text-center text-[var(--tm-mauve)]">
                  This board has no pins yet.
                </div>
              )}
              {!loadingPins &&
                pins.map((pin) => {
                  const imageUrl = getPinPreview(pin);
                  return (
                    <button
                      key={pin.id}
                      onClick={() => onSelectPin(pin)}
                      className="group overflow-hidden rounded-2xl border border-mauve-100 bg-white shadow-sm transition hover:shadow-lg"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={pin.title ?? 'Pinterest pin'}
                          className="h-24 w-full object-cover transition duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-24 items-center justify-center text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]/70">
                          No preview
                        </div>
                      )}
                      <p className="px-3 py-2 text-xs text-[var(--tm-mauve)]/80">
                        {pin.title ?? pin.description ?? 'Untitled pin'}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-[var(--tm-mauve)]/50 px-5 py-2 text-xs uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]/80 transition hover:bg-[var(--tm-mauve)]/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
