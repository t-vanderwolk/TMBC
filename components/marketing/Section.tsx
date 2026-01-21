import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export default function Section({ children, className = "", innerClassName = "" }: SectionProps) {
  return (
    <section className={`w-full ${className}`.trim()}>
      <div className="mkt-section">
        <div className={`mkt-container ${innerClassName}`.trim()}>{children}</div>
      </div>
    </section>
  );
}
