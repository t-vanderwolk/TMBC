import { Children, Fragment, isValidElement, type ReactNode } from "react";

import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingHero from "@/components/marketing/MarketingHero";
import FadeInSection from "@/components/motion/FadeInSection";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  // Motion guardrail:
  // Marketing pages use FadeInSection for calm, editorial entrance motion.
  // Do NOT add parallax, looping animation, or hero motion.
  // This component is intentionally presentation-only to remain Turbopack-safe.

  let fadeOrder = 0;

  const wrapNodes = (node: ReactNode): ReactNode => {
    if (!isValidElement(node)) return node;

    if (node.type === MarketingHero || node.type === FadeInSection) {
      return node;
    }

    if (node.type === Fragment) {
      return (
        <Fragment key={node.key}>
          {Children.map(node.props.children, wrapNodes)}
        </Fragment>
      );
    }

    fadeOrder += 1;
    const delayMs = fadeOrder * 80;

    return (
      <FadeInSection key={node.key ?? `fade-${fadeOrder}`} delayMs={delayMs}>
        {node}
      </FadeInSection>
    );
  };

  const wrappedChildren = Children.map(children, wrapNodes);

  return (
    <div className="marketing-glow relative min-h-screen overflow-hidden bg-[var(--member-bg-page)] text-[var(--member-text-primary)]">
      <MarketingNav />
      <main className="relative">{wrappedChildren}</main>
      <div className="relative bg-transparent">
        <div className="mkt-container pt-16 pb-10">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
