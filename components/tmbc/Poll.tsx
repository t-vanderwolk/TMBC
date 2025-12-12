"use client";

import { useState } from "react";

export type PollProps = {
  question: string;
  options: string[];
};

export default function Poll({ question, options }: PollProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="space-y-3 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5">
      <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Today’s poll</p>
      <h3 className="text-sm font-semibold text-[#3E2F35]">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-2 text-sm text-[#3E2F35] ${
              selected === option ? "border-[#B98AA5] bg-[#F9E9F0]" : "border-[#E3C6D4]"
            }`}
          >
            {option}
            {selected === option && <span className="text-xs uppercase tracking-[0.4em] text-[#B98AA5]">Selected</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
