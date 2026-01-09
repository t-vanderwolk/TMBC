import Link from "next/link";
import type { Route } from "next";

const PRIMARY_BUTTON_CLASSES = "marketing-btn marketing-btn-primary uppercase tracking-[0.35em]";
const SECONDARY_BUTTON_CLASSES = "marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]";

export default function HeroInviteForm() {
  return (
    <div className="marketing-card flex w-full max-w-md flex-col gap-5 text-[var(--tmbc-charcoal)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-60">
        Concierge intake
      </p>
      <h3 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">Your invite begins here</h3>
      <p className="text-base text-[var(--tmbc-charcoal)]/80">
        Share a few details and our intake curator will reply with bespoke next steps.
      </p>
      <div className="flex flex-col gap-3">
        <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
          Request Invite
        </Link>
        <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
          View Membership
        </Link>
      </div>
    </div>
  );
}
