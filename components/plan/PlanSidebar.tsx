"use client";

import type { PlanContentSection } from "@/components/plan/PlanContent";

type PlanSidebarProps = {
  sections: PlanContentSection[];
  activeKey: string | null;
  onSelect: (key: string) => void;
};

const formatDecisionState = (value?: string | null) => {
  if (!value) return "Draft";
  return value
    .split(/[_-]/)
    .map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase())
    .join(" ");
};

export default function PlanSidebar({ sections, activeKey, onSelect }: PlanSidebarProps) {
  return (
    <aside className="space-y-3 rounded-[28px] border border-[#EAE2E8] bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Sections</p>
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Tap to open</span>
      </div>
      {sections.length ? (
        sections.map((section) => {
          const isActive = activeKey === section.sectionKey;
          return (
            <button
              key={section.sectionKey}
              type="button"
              onClick={() => onSelect(section.sectionKey)}
              className={`w-full text-left rounded-[20px] border px-4 py-3 transition ${
                isActive
                  ? "border-[#A4556A] bg-[#FFF4FA] text-[#3E2F35]"
                  : "border-transparent bg-white text-[#8B4A61] hover:border-[#E3C6D4]"
              }`}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                {section.title}
              </span>
              <p className="text-[0.7rem] text-[#8B4A61]/80">{section.summary}</p>
              <p className="mt-2 text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                Decision: {formatDecisionState(section.decisionState)}
              </p>
            </button>
          );
        })
      ) : (
        <p className="text-xs text-[#3E2F35]/70">
          Complete Academy modules to populate the plan workspace.
        </p>
      )}
    </aside>
  );
}
