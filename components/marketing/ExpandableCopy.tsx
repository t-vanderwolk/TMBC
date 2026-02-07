 "use client";

import { useState } from "react";

type ExpandableCopyProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ExpandableCopy({ children, className = "" }: ExpandableCopyProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className={`
          overflow-hidden
          transition-[max-height]
          duration-300
          ease-out
          md:overflow-visible
          md:max-h-none
          ${expanded ? "max-h-[999px]" : "max-h-[5.5rem]"}
          ${className}
        `.trim()}
      >
        {children}
      </div>
      <div className="mt-1 text-center md:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center min-h-[44px] px-2 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </div>
    </div>
  );
}
