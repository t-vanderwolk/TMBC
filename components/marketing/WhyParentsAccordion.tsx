"use client";

import { useState } from "react";

const loveReasons = [
  {
    id: "mentor-led",
    title: "Mentor-Led, Not Algorithm-Driven",
    copy:
      "You’re guided by someone who’s actually done this — not an algorithm optimizing for clicks or commissions. Every recommendation is shaped by real experience, professional insight, and your specific life — not trends, sponsorships, or popularity lists.",
  },
  {
    id: "brand-bias",
    title: "No Brand Bias — Just What Fits You",
    copy:
      "We don’t push “best sellers” or partner favorites. We help you understand why something might work for your home, your routines, and your comfort level — and when it’s something you can confidently skip.",
  },
  {
    id: "calm-guided",
    title: "Calm, Guided Planning — Not Information Overload",
    copy:
      "Baby prep shouldn’t feel frantic or endless. We break decisions into thoughtful steps and help you focus on what matters right now, so planning feels manageable instead of overwhelming.",
  },
  {
    id: "real-support",
    title: "Real Support at the Moments You Need It",
    copy:
      "Questions don’t arrive all at once — and neither should answers. Whether you’re choosing gear, navigating family opinions, or second-guessing a decision late at night, support is there when it actually counts.",
  },
  {
    id: "reflect",
    title: "A Space to Reflect — Not Just Prepare",
    copy:
      "Taylor-Made isn’t only about checklists and purchases. It’s a place to pause, reflect, and capture this season — creating something you’ll want to look back on, not just get through.",
  },
];

export default function WhyParentsAccordion() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded((current) => (current === id ? null : id));

  return (
    <div className="rounded-[36px] bg-gradient-to-br from-[#fdf6f8] via-[#fdecef] to-[#fdf6f8] px-6 py-8 md:px-8 md:py-10 mt-10">
      <div className="space-y-4">
        {loveReasons.map((reason) => {
          const isOpen = expanded === reason.id;
          return (
            <div
              key={reason.id}
              className="overflow-hidden rounded-2xl border border-white/40 bg-white/70 transition-colors"
            >
              <button
                type="button"
                id={`why-title-${reason.id}`}
                aria-controls={`why-copy-${reason.id}`}
                aria-expanded={isOpen}
                onClick={() => toggle(reason.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-semibold tracking-[0.02em] text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tmbc-charcoal)] focus-visible:outline-offset-2"
              >
                <span>{reason.title}</span>
                <span
                  className={`text-[1.25rem] leading-none transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>
              <div
                id={`why-copy-${reason.id}`}
                role="region"
                aria-labelledby={`why-title-${reason.id}`}
                className={`px-5 pb-5 text-sm leading-[1.7] text-[var(--tmbc-charcoal)]/90 transition-[max-height,opacity] duration-300 ease-out ${
                  isOpen ? "max-h-[400px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"
                }`}
              >
                <p className="m-0">{reason.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
