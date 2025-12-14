"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Style() {
  return (
    <OnboardingIntakeForm
      step="style"
      nextStep="/onboarding/philosophy"
      title="Style"
      description="Which textures, patterns, and finishes feel like you?"
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Pick three words that describe your nursery moodboard.
        <input
          name="styleWords"
          className="mt-2 rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]"
          placeholder="Blush, organic, luminous"
        />
      </label>
    </OnboardingIntakeForm>
  );
}
