"use client";

import Link from "next/link";

import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";

export default function ResultsClient() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Onboarding complete"
        subtitle="This helps your mentor understand your lifestyle."
      />

      <div className="rounded-[2rem] border border-[#E3C6D4] bg-[#FFFAF8] px-6 py-5 text-sm text-[#3E2F35]">
        <p className="text-base font-semibold text-[#3E2F35]">What happens next</p>
        <p className="mt-2 text-sm text-[#3E2F35]/75">
          Your mentor reviewed your onboarding answers and will guide your registry together with you.
          Your registry stays empty until you or your mentor add items.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard/plan">
          <StyledButton>Go to registry</StyledButton>
        </Link>
        <Link
          href="/dashboard/settings/questionnaire"
          className="rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] transition border border-[#C8A1B4] text-[#3E2F35] hover:text-[#B98AA5]"
        >
          Edit my answers
        </Link>
      </div>
    </div>
  );
}
