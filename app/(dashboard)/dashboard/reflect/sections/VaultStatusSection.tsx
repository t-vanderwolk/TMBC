"use client";

import SealVaultButton from "../components/SealVaultButton";

// TODO: Connect this status to the actual vault state when the sealing workflow is implemented.
export default function VaultStatusSection() {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-[#FFFAF8]/80 p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Vault status</p>
          <h2 className="text-xl font-semibold text-[#3E2F35]">🟢 Open</h2>
        </div>
        <SealVaultButton />
      </div>
      <p className="text-sm text-[#3E2F35]/70">
        The vault stays open for now — close it when you want to pause access. Sealing will lock this season in place with extra privacy.
      </p>
    </section>
  );
}
