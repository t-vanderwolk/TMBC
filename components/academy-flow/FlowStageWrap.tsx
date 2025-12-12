"use client";

const FlowStageWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-8 rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/90 p-6 shadow-[0_20px_70px_rgba(199,166,199,0.2)]">
    {children}
  </div>
);

export default FlowStageWrap;
