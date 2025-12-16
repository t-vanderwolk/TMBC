'use client';

import { useState } from 'react';

import AddCustomItemModal from './AddCustomItemModal';
type AddCustomItemButtonProps = {
  onSuccess: () => void;
};

export default function AddCustomItemButton({ onSuccess }: AddCustomItemButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white shadow-soft"
        onClick={() => setOpen(true)}
      >
        Add Custom Item
      </button>
      <AddCustomItemModal open={open} onClose={() => setOpen(false)} onSuccess={onSuccess} />
    </>
  );
}
