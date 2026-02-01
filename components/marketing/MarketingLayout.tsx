import { type ReactNode } from "react";

import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-glow relative min-h-screen overflow-hidden bg-[var(--member-bg-page)] text-[var(--member-text-primary)]">
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
