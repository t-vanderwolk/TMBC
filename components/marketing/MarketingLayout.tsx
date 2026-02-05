import { type ReactNode } from "react";

// MARKETING EDITORIAL RESTRAINT
// Fewer CTAs > louder CTAs
// One visual leader per section
// Calm spacing > clever tricks
// Trust is built through restraint
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

// Mobile rhythm guardrails:
// - ≥16px vertical spacing between text blocks
// - ≥48px tap targets for CTAs
// - No stacked CTAs without spacing
// - Calm > density

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
