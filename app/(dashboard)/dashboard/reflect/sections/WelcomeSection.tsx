"use client";

import AutoSaveIndicator from "../components/AutoSaveIndicator";
import PrivateBadge from "../components/PrivateBadge";

export default function WelcomeSection() {
  // TODO: Pull welcome prompts from content config after i18n decision.
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-[#FFFAF8]/80 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Welcome</p>
          <h2 className="text-2xl font-semibold text-[#3E2F35]">This space is yours</h2>
        </div>
        <PrivateBadge />
      </div>
      <p className="text-sm text-[#3E2F35]/70">
        There’s no right way to fill it — only your way. Gentle moments are all this needs.
      </p>
      <AutoSaveIndicator />
    </section>
  );
}
