"use client";

import OnboardingIntakeForm from "@/components/onboarding/IntakeForm";

export default function HomeLifestyle() {
  return (
    <OnboardingIntakeForm
      step="home-lifestyle"
      nextStep="/onboarding/mobility"
      title="Home & lifestyle"
      description="Tell us about your rituals so we can reflect them in mentor planning. This helps your mentor understand your lifestyle."
    >
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        How would you describe the feeling of your home?
        <textarea
          name="homeFeeling"
          rows={4}
          className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Warm blush, collected woods, or airy modern?"
        />
      </label>
    </OnboardingIntakeForm>
  );
}
