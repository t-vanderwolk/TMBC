"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Emotional() {
  return (
    <OnboardingIntakeForm
      step="emotional"
      nextStep="/onboarding/results"
      title="Emotional check-in"
      description="How can we keep your inner rhythm calm and resilient?"
      submitText="Save & see your results"
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        What emotion are you carrying most right now?
        <input
          name="emotion"
          className="mt-2 rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]"
          placeholder="Joy, overwhelmed, hopeful…"
        />
      </label>
    </OnboardingIntakeForm>
  );
}
