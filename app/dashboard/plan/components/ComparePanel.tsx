"use client";

import StatusBadge from "./StatusBadge";
import { usePlanContext } from "../PlanContext";

export default function ComparePanel() {
  const { comparisons, meta } = usePlanContext();

  if (!comparisons.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D7C0C5] bg-[#FBF7F5] p-5">
        <p className="text-sm text-[#3E2F35]/70">Comparison boards stay soft until something is shortlisted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#3E2F35]">Compare</h3>
        <StatusBadge label={meta.canMentor ? "Oversight" : "Decision"} variant="default" />
      </header>
      <div className="space-y-4">
        {comparisons.map((snapshot) => (
          <article key={snapshot.category} className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#3E2F35]">{snapshot.category}</p>
              <StatusBadge label="Comparison" />
            </div>
            <div className="space-y-2">
              {snapshot.items.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between rounded-[20px] border border-[#F0E5E7] bg-[#FCF9F7] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#3E2F35]">{item.retailer}</p>
                    <p className="text-xs text-[#3E2F35]/70">ID: {item.itemId}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#3E2F35]">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
