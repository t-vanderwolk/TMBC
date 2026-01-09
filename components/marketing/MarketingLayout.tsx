"use client";

import { Children, type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import RibbonDivider from "@/components/marketing/RibbonDivider";
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
 
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".marketing-section, .hero-motion, .ribbon-motion")
    );
    if (!targets.length) return;
    targets.forEach((target) => target.classList.add("motion-hidden"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="pb-20 sm:pb-24 lg:pb-28">
        {heroChild}
        {restChildren.length > 0 && (
          <MarketingContainer className="space-y-20 md:space-y-24">{restChildren}</MarketingContainer>
        )}
        <RibbonDivider className="my-16 md:my-20" />
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
