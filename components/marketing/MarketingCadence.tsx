import React from "react";

type Bg = "white" | "ivory" | "blush";

export function cadenceBgByIndex(i: number): Bg {
  // Post-hero cadence: white → ivory → blush → white (repeat)
  const seq: Bg[] = ["white", "ivory", "blush", "white"];
  const idx = i % seq.length;
  return seq[idx] ?? "white";
}

export function bgClass(bg: Bg): string {
  // Use CSS vars if present; fall back to safe neutrals
  switch (bg) {
    case "ivory":
      return "bg-[var(--tmbc-ivory,#fef9f6)]";
    case "blush":
      return "bg-[var(--tmbc-blush-wash,#fde8ef)]";
    default:
      return "bg-white";
  }
}

export function sectionWrap(bg: Bg): string {
  return `${bgClass(bg)} py-20 md:py-24 lg:py-28`;
}

export function textCage(kind: "standard" | "intro" | "narrow" = "standard"): string {
  // Canonical max-width cages
  if (kind === "intro") return "mx-auto w-full max-w-[720px]";
  if (kind === "narrow") return "mx-auto w-full max-w-2xl";
  return "mx-auto w-full max-w-3xl";
}

export function cardBase(extra = ""): string {
  return `rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] ${extra}`.trim();
}

export function dividerRhythm(extra = ""): string {
  return `my-16 md:my-20 border-t border-black/5 ${extra}`.trim();
}

export function SectionBand(props: {
  bg: Bg;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const { bg, children, className } = props;
  return (
    <section className={`${sectionWrap(bg)} ${className ?? ""}`.trim()}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
}
