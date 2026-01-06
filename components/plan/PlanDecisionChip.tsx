"use client";

import type { PlanDecisionState } from "@/lib/services/server/planSections.service";

const decisionOptions: Array<{ value: PlanDecisionState; label: string }> = [
  { value: "considering", label: "In conversation" },
  { value: "waiting", label: "On hold for now" },
  { value: "approved", label: "Aligned for now" },
  { value: "deferred", label: "Revisit when ready" },
];

type PlanDecisionChipProps = {
  value: PlanDecisionState;
  onChange?: (value: PlanDecisionState) => void;
};

export default function PlanDecisionChip({ value, onChange }: PlanDecisionChipProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {decisionOptions.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            title="This reflects the current state of the conversation - not a fixed decision."
            className={`rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition ${
              isActive
                ? "border-[#C8A1B4] bg-[#F7E7EF] text-[#7C3B53]"
                : "border-[#E3C6D4] bg-white/90 text-[#A4556A] hover:border-[#C8A1B4]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
