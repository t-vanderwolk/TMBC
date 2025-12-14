import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES = "marketing-btn marketing-btn-primary uppercase tracking-[0.35em]";
const SECONDARY_BUTTON_CLASSES = "marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]";

export default function ThankYouPage() {
  return (
    <div className="bg-[#FFFAF8] text-[var(--tmbc-charcoal)]">
      <PageSection className="min-h-[60vh]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Thank you</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E2F35]">Your invite request is with us</h1>
          <p className="text-base text-[#3E2F35]/80">
            We’ll reply within two business days with your concierge onboarding note. In the meantime, explore the community or revisit the experience.
          </p>
          <div className="flex flex-col gap-3 justify-center sm:flex-row sm:gap-4">
            <Link href={"/community" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Explore Community
            </Link>
            <Link href={"/experience" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Experience TMBC
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
