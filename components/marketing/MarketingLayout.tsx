"use client";

import { Children, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/login", "/request-invite", "/thank-you"];
  const breakoutHeroRoutes = [
    "/",
    "/how-it-works",
    "/learn",
    "/plan",
    "/connect",
    "/reflect",
    "/membership",
    "/blog",
  ];
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const shouldHideFooter = hideFooterRoutes.includes(normalizedPathname);
  const shouldBreakoutHero = breakoutHeroRoutes.includes(normalizedPathname);

  const childArray = Children.toArray(children) as ReactNode[];
  const heroChild = shouldBreakoutHero ? childArray[0] : null;
  const restChildren = shouldBreakoutHero ? childArray.slice(1) : childArray;

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="pb-20 sm:pb-24 lg:pb-28">
        {heroChild}
        {restChildren.length > 0 && (
          <MarketingContainer className="space-y-20 md:space-y-24">{restChildren}</MarketingContainer>
        )}
      </main>
      {!shouldHideFooter && (
        <div className="pb-14 sm:pb-16">
          <MarketingContainer>
            <MarketingFooter />
          </MarketingContainer>
        </div>
      )}
    </div>
  );
}
