import Link from "next/link";
import type { Route } from "next";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-all hover:scale-105";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

export default function HeroInviteForm() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5 rounded-[2.5rem] border border-[#D9C48E]/30 bg-white p-8 shadow-[0_25px_60px_rgba(62,47,53,0.18)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
        Concierge intake
      </p>
      <h3 className="font-serif text-3xl text-[#3E2F35]">Your invite begins here</h3>
      <p className="text-sm text-[#3E2F35]/80">
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
