"use client";

type FlowHeaderProps = {
  stageLabel: string;
  title: string;
  description: string;
  status: string;
};

const FlowHeader = ({ stageLabel, title, description, status }: FlowHeaderProps) => {
  return (
    <section className="space-y-2 rounded-[36px] border border-[var(--tmbc-mauve)] bg-gradient-to-br from-white/80 to-[var(--tmbc-blush)]/40 p-6 shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/70">{stageLabel}</p>
      <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">{title}</h2>
      <p className="text-sm text-[var(--tmbc-charcoal)]/70">{description}</p>
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-gold)]">{status}</p>
    </section>
  );
};

export default FlowHeader;
