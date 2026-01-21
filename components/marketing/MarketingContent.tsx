import type { ReactNode } from "react";

export default function MarketingContent({ children }: { children: ReactNode }) {
  return <div className="mkt-container">{children}</div>;
}
