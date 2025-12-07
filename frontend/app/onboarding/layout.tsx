import { ReactNode } from 'react';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#3E2F35]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-8 lg:px-10">
        <header className="rounded-[32px] border border-[#C8A1B4]/40 bg-white/80 p-6 shadow-[0_35px_90px_rgba(189,147,189,0.18)]">
          <p className="text-[0.6rem] uppercase tracking-[0.6em] text-[#C8A1B4]/70">Taylor-Made Baby Co.</p>
          <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Lifestyle Onboarding</h1>
          <p className="mt-1 max-w-3xl font-nunito text-base text-[#3E2F35]/80">
            Tell us about your home, routine, and travel style so we can curate gear that truly feels tailored to your
            growing family.
          </p>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
