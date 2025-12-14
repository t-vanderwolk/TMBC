"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[var(--tmbc-ivory)] via-[var(--tmbc-blush)]/60 to-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="py-12 sm:py-16 lg:py-20">
        <MarketingContainer className="space-y-16">{children}</MarketingContainer>
      </main>
      <div className="pb-10">
        <MarketingContainer>
          <Footer />
        </MarketingContainer>
      </div>
    </div>
  );
}
