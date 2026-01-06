import type { ReactNode } from "react";

export default function MarketingContent({ children }: { children: ReactNode }) {
  return <div className="marketing-body px-4 md:px-10 lg:px-16">{children}</div>;
}
