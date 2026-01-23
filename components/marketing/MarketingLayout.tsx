"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/login", "/request-invite", "/thank-you"];
  const heroGradientRoutes = ["/"];
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const shouldHideFooter = hideFooterRoutes.includes(normalizedPathname ?? "");
  const shouldHideHeroGradient = heroGradientRoutes.includes(normalizedPathname ?? "");

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
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      {!shouldHideHeroGradient && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--tmbc-blush)]/30 to-transparent"
          aria-hidden
        />
      )}
      <MarketingNav />
      <main className="relative">
        {children}
      </main>
      {!shouldHideFooter && (
        <div className="relative bg-transparent">
          <div className="mkt-container pt-16 pb-10">
            <MarketingFooter />
          </div>
        </div>
      )}
    </div>
  );
}
