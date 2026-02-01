import type { ReactNode } from "react";

const panelBase = "rounded-[32px] border border-[#E5D6D8] bg-white/90 p-5 shadow-[0_10px_45px_rgba(62,47,53,0.08)]";

type PlanShellProps = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

export default function PlanShell({ left, center, right }: PlanShellProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1.6fr_0.9fr]">
      <section className={`${panelBase} space-y-5`}>{left}</section>
      <section className={`${panelBase} space-y-5`}>{center}</section>
      <section className={`${panelBase} space-y-5`}>{right}</section>
    </div>
  );
}
