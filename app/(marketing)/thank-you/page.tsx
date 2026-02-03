import Link from "next/link";
import type { Route } from "next";
import { PageSection } from "@/components/marketing/PageSection";
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

const PRIMARY_BUTTON_CLASSES = "marketing-btn marketing-btn-primary uppercase tracking-[0.35em]";
const SECONDARY_BUTTON_CLASSES = "marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]";

export default function ThankYouPage() {
  return (
    <div className="bg-[#FFFAF8] text-[var(--tmbc-charcoal)]">
      <PageSection className="min-h-[60vh]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Thank you</p>
          <MarketingHeading level="h1" className="text-[#3E2F35]">
            Your invite request is with us
          </MarketingHeading>
          <p className="text-base text-[#3E2F35]/80">
            We'll reply within two business days. We keep TMBC invite-only so mentors can offer real, attentive support. In the meantime, explore membership details or read the journal.
          </p>
          <div className="flex flex-col gap-3 justify-center sm:flex-row sm:gap-4">
            <Link href={"/blog" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Read the Journal
            </Link>
            <Link href={"/membership" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Membership Details
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
