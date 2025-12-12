import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] hover:scale-105 transition-all";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

export default function ThankYouPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="min-h-[60vh]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Thank you</p>
          <h1 className="font-serif text-4xl text-[#3E2F35] md:text-5xl">Your invite request is with us</h1>
          <p className="text-sm text-[#3E2F35]/80">
            We’ll reply within two business days with your concierge onboarding note. In the meantime, explore the community or revisit the experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
