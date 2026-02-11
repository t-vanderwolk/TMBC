"use client";

import { useState } from "react";

export default function InviteOnlyAccordion() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((current) => !current);

  return (
    <section className="invite-accordion-section invite-only-card">
      <button
        type="button"
        className="invite-accordion-trigger"
        aria-expanded={open}
        aria-controls="invite-only-content"
        onClick={toggleOpen}
        id="invite-only-trigger"
      >
        <div className="flex flex-col gap-1 text-left">
          <span className="invite-accordion-subhead">
            Why access is curated
          </span>
          <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Why Taylor-Made Is Invite-Only</h2>
        </div>
        <span
          className={`invite-accordion-icon text-[1.5rem] leading-none transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <div
        id="invite-only-content"
        className={`invite-accordion-content ${open ? "invite-accordion-open" : ""}`}
        role="region"
        aria-labelledby="invite-only-trigger"
      >
        <p>
          Because support works best when it’s personal — not rushed, scaled, or run by a robot with a spreadsheet.
        </p>
        <p>
          We keep Taylor-Made intentionally small so every parent is thoughtfully matched, genuinely supported, and
          guided by a real mentor who understands real life — not an algorithm guessing at your lifestyle.
        </p>
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Mentors guard the pace</p>
        <p>
          Invite-only lets us move at a human pace. Fewer people. Better care. Space for real questions, second thoughts,
          and planning without pressure.
        </p>
        <ul className="no-list space-y-1 text-[var(--tmbc-charcoal)]/90">
          <li>No feeds.</li>
          <li>No rankings.</li>
          <li>No “you should already know this.”</li>
        </ul>
        <p className="invite-only-close">
          Because parenthood should start with confidence, not confusion.
        </p>
      </div>
    </section>
  );
}
