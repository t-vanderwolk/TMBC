"use client";

import LearnPanel from "./LearnPanel";

export default function MemberLeftStack() {
  return (
    <div className="space-y-6">
      <LearnPanel />
      <div className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4 shadow-[0_5px_20px_rgba(62,47,53,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3E2F35]">Progress indicators</p>
          <span className="text-xs text-[#3E2F35]/70">Soft pace</span>
        </div>
        <div className="h-2 rounded-full bg-[#F3E9E9]">
          <div className="h-full w-2/5 rounded-full bg-[#B47484]" />
        </div>
        <div className="flex items-center justify-between text-xs text-[#3E2F35]/70">
          <span>Decision-set</span>
          <span>Harmony score</span>
        </div>
      </div>
    </div>
  );
}
