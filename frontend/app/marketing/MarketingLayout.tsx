"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[var(--tmbc-ivory)] via-[var(--tmbc-blush)]/60 to-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      <Navbar />
      <main className="space-y-16 px-6 py-12 md:px-10 lg:px-16 xl:px-20">
        {children}
      </main>
      <div className="px-6 pb-10 md:px-10 lg:px-16 xl:px-20">
        <Footer />
      </div>
    </div>
  );
}
