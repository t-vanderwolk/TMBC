"use client";

import { useState } from "react";

type RegistryActionMenuProps = {
  className?: string;
};

const ACTIONS = [
  "Move section",
  "Mark purchased",
  "Remove from registry",
  "Add note",
];

export default function RegistryActionMenu({ className = "" }: RegistryActionMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-[#E3C6D4] bg-white/90 px-3 py-2 text-lg text-[#3E2F35] focus:outline focus:outline-2 focus:outline-[#C8A1B4]"
        aria-expanded={open}
        aria-label="Registry actions"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-[#E3C6D4] bg-white/95 p-3 shadow-[0_25px_60px_rgba(62,47,53,0.15)]">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Actions</p>
          <div className="mt-2 space-y-1">
            {ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                className="w-full rounded-2xl bg-[#FFFBF9] px-3 py-2 text-left text-sm text-[#3E2F35]/80 transition hover:bg-[#FFF5F0]"
                onClick={() => {
                  setOpen(false);
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
