import type { ReactNode } from "react";

import MarketingContent from "@/components/marketing/MarketingContent";

type MarketingContainerProps = {
  children: ReactNode;
  className?: string;
};

export function MarketingContainer({ children, className = "" }: MarketingContainerProps) {
  return (
    <div className={`marketing-content space-y-20 md:space-y-28 ${className}`.trim()}>
      <MarketingContent>{children}</MarketingContent>
    </div>
  );
}
