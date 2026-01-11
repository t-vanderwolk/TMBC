"use client";

import type { ReactNode } from "react";

type ImageFrameProps = {
  className?: string;
  children: ReactNode;
};

export default function ImageFrame({ className = "", children }: ImageFrameProps) {
  return (
    <div
      className={[
        "group relative overflow-hidden",
        "rounded-[32px]",
        "border border-[var(--tmbc-mauve)]/20",
        "bg-white/90",
        "shadow-[0_25px_40px_rgba(0,0,0,0.08)]",
        "transition-all duration-500",
        "motion-safe:group-hover:-translate-y-0.5",
        className,
      ].join(" ")}
      data-image-frame
    >
      {children}
    </div>
  );
}
