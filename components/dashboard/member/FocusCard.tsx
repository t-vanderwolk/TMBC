"use client";

import { useState } from "react";

type FocusCardProps = {
  statement: string;
  actionLabel?: string;
  metaLabel?: string;
};

export default function FocusCard({ statement, actionLabel, metaLabel }: FocusCardProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <article className="relative rounded-[26px] border border-member-border-default/70 bg-member-background-card p-5 text-sm text-member-text-primary shadow-soft transition duration-300 hover:-translate-y-[2px]">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-member-text-secondary/80">
          Your focus this week
        </p>
        <p className="text-base font-serif text-member-text-primary">{statement}</p>
        {actionLabel ? (
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-member-text-secondary">
            {actionLabel}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-[0.55rem] uppercase tracking-[0.4em] text-member-text-secondary">
        {metaLabel ?? "Last viewed this morning"}
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 rounded-full bg-member-accent-primary px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-member-text-inverse transition hover:bg-member-accent-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-member-state-focus/40"
      >
        Dismiss
      </button>
    </article>
  );
}
