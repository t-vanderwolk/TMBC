import type { ReactNode } from "react";

type Tone = "white" | "ivory" | "blush";

type PageSectionProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

const toneMap: Record<Tone, string> = {
  white: "bg-white",
  ivory: "bg-[#faf7f5]",
  blush: "bg-[#f6eef2]",
};

export function PageSection({ children, tone = "white", className = "" }: PageSectionProps) {
  return (
    <section className={`${toneMap[tone]} py-20 md:py-24 lg:py-28 ${className}`}>
      <div className="mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}
