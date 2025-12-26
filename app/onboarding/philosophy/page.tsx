"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Philosophy() {
  return (
    <OnboardingIntakeForm
      step="philosophy"
      nextStep="/onboarding/budget"
      title="Philosophy"
      description="How do you want to show up for your family during this season? This helps your mentor understand your lifestyle."
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Describe the core value that guides your parenting practice.
        <textarea
          name="philosophy"
          rows={3}
          className="rounded-2xl border border-[#3E2F35] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Presence, ease, ritual, playful intention…"
        />
      </label>
    </OnboardingIntakeForm>
  );
}
