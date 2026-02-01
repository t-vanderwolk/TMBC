"use server";

import Link from "next/link";
import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";

export default async function DashboardOnboardingResults() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Onboarding context"
        subtitle="Your mentor reviewed your onboarding answers."
        actions={
          <Link href="/dashboard/plan">
            <StyledButton variant="ghost">Go to registry</StyledButton>
          </Link>
        }
      />
      <div className="rounded-[2rem] border border-[#E3C6D4] bg-[#FFFAF8] px-6 py-5 text-sm text-[#3E2F35]">
        <p className="text-base font-semibold text-[#3E2F35]">Mentor-led planning</p>
        <p className="mt-2 text-sm text-[#3E2F35]/75">
          This helps your mentor understand your lifestyle. Registry items appear only when you or your mentor adds them.
        </p>
      </div>
    </div>
  );
}
