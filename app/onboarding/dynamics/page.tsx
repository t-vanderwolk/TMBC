"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Dynamics() {
  return (
    <OnboardingIntakeForm
      step="dynamics"
      nextStep="/onboarding/style"
      title="Dynamics"
      description="How do you imagine your day-to-day flow once baby arrives?"
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Describe a typical morning, nap, or evening routine you dream of.
        <textarea
          name="routine"
          rows={4}
          className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Sunrise stretches, nursing, stroller naps..."
        />
      </label>
    </OnboardingIntakeForm>
  );
}
