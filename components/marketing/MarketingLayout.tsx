"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[var(--tmbc-ivory)] via-[var(--tmbc-blush)]/60 to-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="-mt-10 pb-20 sm:mt-0 sm:pb-24 lg:pb-28">
        {shouldBreakoutHero ? (
          children
        ) : (
          <MarketingContainer className="space-y-20">{children}</MarketingContainer>
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
