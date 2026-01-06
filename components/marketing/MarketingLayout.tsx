"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/login", "/request-invite", "/thank-you"];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[var(--tmbc-ivory)] via-[var(--tmbc-blush)]/60 to-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="pb-20 sm:pb-24 lg:pb-28">
        <MarketingContainer className="space-y-20">{children}</MarketingContainer>
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
