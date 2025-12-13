import type { ReactNode } from "react";

import OnboardingRedirectGuard from "@/components/onboarding/OnboardingRedirectGuard";

type OnboardingLayoutProps = {
  children: ReactNode;
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8F4] to-[#FBE9EE] text-[#3E2F35]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-10 lg:px-12">
        <header className="space-y-2 rounded-[32px] border border-[#E3C6D4] bg-white/80 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
          <p className="text-[0.65rem] uppercase tracking-[0.6em] text-[#C8A1B4]">Taylor-Made Baby Co.</p>
          <h1 className="font-serif text-3xl text-[#3E2F35]">Bespoke onboarding</h1>
          <p className="max-w-3xl text-sm text-[#3E2F35]/70">
            Finish the three-step concierge flow to secure your profile, pair with a mentor, and unlock your dashboard.
          </p>
        </header>
        <main className="flex-1">
          <OnboardingRedirectGuard />
          {children}
        </main>
      </div>
    </div>
  );
}
