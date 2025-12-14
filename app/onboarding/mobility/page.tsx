"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function Mobility() {
  return (
    <OnboardingIntakeForm
      step="mobility"
      nextStep="/onboarding/dynamics"
      title="Mobility"
      description="Share how often you travel, attend events, or want to unlock effortless outings."
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        What kind of outings do you plan to take with baby in the first 6 months?
        <textarea
          name="outings"
          rows={4}
          className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Park strolls, city visits, weekend escapes..."
        />
      </label>
    </OnboardingIntakeForm>
  );
}
