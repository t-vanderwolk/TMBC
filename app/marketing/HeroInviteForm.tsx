import Link from "next/link";
import type { Route } from "next";

const PRIMARY_BUTTON_CLASSES = "marketing-btn marketing-btn-primary uppercase tracking-[0.35em]";
const SECONDARY_BUTTON_CLASSES = "marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]";

export default function HeroInviteForm() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5 rounded-[2.5rem] border border-[#D9C48E]/30 bg-white p-8 shadow-[0_25px_60px_rgba(62,47,53,0.18)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
        Concierge intake
      </p>
      <h3 className="font-serif text-2xl sm:text-3xl text-[#3E2F35]">Your invite begins here</h3>
      <p className="text-base text-[#3E2F35]/80">
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
