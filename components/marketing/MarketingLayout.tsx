import type { ReactNode } from "react";

import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  // This component is intentionally presentation-only to remain Turbopack-safe.
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <MarketingNav />
      <main className="relative">{children}</main>
      <div className="relative bg-transparent">
        <div className="mkt-container pt-16 pb-10">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
