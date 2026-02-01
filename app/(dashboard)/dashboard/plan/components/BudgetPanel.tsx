"use client";

import { useState, type ChangeEvent } from "react";
import { usePlanContext } from "../PlanContext";

type BudgetPanelProps = {
  editable?: boolean;
};

export default function BudgetPanel({ editable = false }: BudgetPanelProps) {
  const { budget } = usePlanContext();
  const totalBudget = Math.max(budget.total ?? 0, 100);
  const allocatedTotal = budget.categories.reduce((sum, category) => sum + category.allocated, 0);
  const [value, setValue] = useState<number>(allocatedTotal);
  const remaining = Math.max(totalBudget - value, 0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!editable) return;
    setValue(Number(event.target.value));
  };

  return (
    <div className="space-y-3">
      <header>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Budget</p>
        <h3 className="text-lg font-semibold text-[#3E2F35]">{editable ? "Lean slider" : "Advisor view"}</h3>
      </header>
      <div className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-[#FCF9F7] p-4">
        <div className="flex items-center justify-between text-sm text-[#3E2F35]">
          <span>Total</span>
          <span>${totalBudget.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#3E2F35]">
          <span>Allocated</span>
          <span>${value.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[#3E2F35]">
          <span>Remaining</span>
          <span>${remaining.toLocaleString()}</span>
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={Math.max(totalBudget, value, 1)}
            value={value}
            onChange={handleChange}
            disabled={!editable}
            className="w-full accent-[#B47484]"
          />
        </div>
        <div className="space-y-2 text-xs text-[#3E2F35]/70">
          {budget.categories.length ? (
            budget.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <span>{category.category}</span>
                <span>${category.allocated.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>Budget signals load once you assign items.</p>
          )}
        </div>
      </div>
    </div>
  );
}
