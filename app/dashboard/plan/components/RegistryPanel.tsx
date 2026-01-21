"use client";

import StatusBadge from "./StatusBadge";
import { usePlanContext } from "../PlanContext";

const ITEM_VARIANTS: Record<string, "default" | "success" | "conflict"> = {
  suggested: "default",
  accepted: "success",
  deferred: "conflict",
};

export default function RegistryPanel() {
  const { registry, meta } = usePlanContext();
  const hasSections = registry.sections.length > 0 || registry.items.length > 0;

  if (!hasSections) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D7C0C5] bg-[#FBF7F5] p-5">
        <p className="text-sm text-[#3E2F35]/70">Registry rituals will appear here once someone begins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#3E2F35]">Registry workspace</h3>
        <StatusBadge label={meta.canMentor ? "Oversight" : "Your choices"} variant="success" />
      </header>
      <div className="space-y-4">
        {registry.sections.map((section) => (
          <article key={section.id} className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#3E2F35]">{section.sectionKey}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-[#A4556A]">
                  {section.decisionState} · {section.readyState}
                </p>
              </div>
              <StatusBadge label="Plan section" variant="default" />
            </div>
            <p className="text-xs text-[#3E2F35]/70">{section.memberNote ?? "Member context pending."}</p>
          </article>
        ))}
      </div>
      <div className="space-y-3">
        {registry.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-[22px] border border-[#F0E5E7] bg-[#FCF9F7] px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-[#3E2F35]">{item.title}</p>
              <p className="text-xs text-[#3E2F35]/70">{item.category}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge label={item.status} variant={ITEM_VARIANTS[item.status] ?? "default"} />
              {(item.priceMin != null || item.priceMax != null) && (
                <p className="text-[0.65rem] text-[#3E2F35]/60">
                  {item.priceMin != null ? `$${item.priceMin.toLocaleString()}` : "TBD"}
                  {" – "}
                  {item.priceMax != null ? `$${item.priceMax.toLocaleString()}` : "TBD"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
