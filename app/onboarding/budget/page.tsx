"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Budget() {
  return (
    <OnboardingIntakeForm
      step="budget"
      nextStep="/onboarding/emotional"
      title="Budget"
      description="Share what feels luxe vs. practical so we tailor intel to you."
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Where do you want to splurge (details, rituals, education)?
        <input
          name="splurge"
          className="mt-2 rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]"
          placeholder="Nursery armchair, mentor consultations…"
        />
      </label>
    </OnboardingIntakeForm>
  );
}
