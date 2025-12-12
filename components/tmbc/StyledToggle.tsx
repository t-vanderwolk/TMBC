"use client";

import { useId } from "react";

export type StyledToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function StyledToggle({ label, checked, onChange }: StyledToggleProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center gap-3 text-sm font-semibold text-[#3E2F35]">
      <span>{label}</span>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-12 rounded-full border border-[#E3C6D4] bg-white transition peer-checked:border-[#B98AA5]">
          <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-[#B98AA5] transition peer-checked:translate-x-6" />
        </div>
      </div>
    </label>
  );
}
