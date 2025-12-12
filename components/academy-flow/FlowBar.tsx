"use client";

type FlowBarStep = {
  label: string;
  description: string;
  completed?: boolean;
};

type FlowBarProps = {
  steps: FlowBarStep[];
};

const FlowBar = ({ steps }: FlowBarProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.label}
          className={`rounded-[30px] border px-4 py-3 text-sm transition ${
            step.completed
              ? "border-[var(--tmbc-gold)] bg-[var(--tmbc-gold)]/20 text-[var(--tmbc-charcoal)]"
              : "border-[var(--tmbc-charcoal)]/10 bg-white text-[var(--tmbc-charcoal)]/70"
          }`}
        >
          <p className="text-[0.6rem] uppercase tracking-[0.4em]">{step.label}</p>
          <p className="mt-1 text-[0.85rem]">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export type { FlowBarStep };
export default FlowBar;
