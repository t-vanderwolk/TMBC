"use client";

import type { ReactNode } from "react";
import JourneyHeader from "./JourneyHeader";

type AcademySectionProps = {
  title: string;
  emotion: string;
  children: ReactNode;
  className?: string;
};

export default function AcademySection({ title, emotion, children, className = "" }: AcademySectionProps) {
  return (
    <section
      className={`space-y-5 rounded-[28px] border border-[#E3C6D4] bg-[#FFF9F5] p-5 shadow-sm ${className}`}
    >
      <JourneyHeader title={title} emotion={emotion} />
      {children}
    </section>
  );
}
