"use client";

import type { ReactNode } from "react";

type MarketingContainerProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingContainer({ children, className = "" }: MarketingContainerProps) {
  return <div className={`marketing-content ${className}`.trim()}>{children}</div>;
}
