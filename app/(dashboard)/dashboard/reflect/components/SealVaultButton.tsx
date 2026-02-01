"use client";

export default function SealVaultButton() {
  // TODO: Hook this button up to vault sealing logic when the backend workflow is available.
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center justify-center rounded-full border border-[#E3C6D4] px-4 py-2 text-[0.7rem] uppercase tracking-[0.4em] text-[#A4556A] transition"
    >
      Seal vault
    </button>
  );
}
