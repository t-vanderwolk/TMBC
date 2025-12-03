import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] hover:scale-105 transition-all";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

const benefits = [
  {
    title: "Concierge mentors",
    description: "Weekly check-ins, handwritten notes, and expert co-planning for your rhythm.",
  },
  {
    title: "Living registry",
    description: "Tools to build a registry that evolves with your family and includes mindful rituals.",
  },
  {
    title: "Salon invites",
    description: "Small gatherings with creative partners, gentle mentorship, and curated experiences.",
  },
];

export default function MembershipPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Membership</p>
          <h1 className="font-serif text-4xl text-[#3E2F35] md:text-5xl">A calm, curated circle</h1>
          <p className="mt-4 text-sm text-[#3E2F35]/80">
            Membership is a toolkit for parents who want boutique resources, concierge planning, and the softest kind of community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/how-it-works" as Route} className={SECONDARY_BUTTON_CLASSES}>
              How It Works
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl space-y-8">
          <header className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Member benefits</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">Comfort, clarity, and crafted rituals</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[2.25rem] border border-[#D9C48E]/30 bg-white p-6 shadow-[0_12px_35px_rgba(62,47,53,0.12)]"
              >
                <h3 className="font-serif text-xl text-[#3E2F35]">{benefit.title}</h3>
                <p className="mt-3 text-sm text-[#3E2F35]/80">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="border-t border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl">
          <div className="space-y-4 rounded-[2.5rem] border border-[#D9C48E]/40 bg-white p-8 shadow-[0_15px_40px_rgba(62,47,53,0.16)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Your circle invites you</p>
            <h3 className="font-serif text-3xl text-[#3E2F35]">Membership feels calm, not chaotic</h3>
            <p className="text-sm text-[#3E2F35]/80">
              We keep calendars gentle, answers thoughtful, and rituals meaningful—every step paced for presence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
                Request Invite
              </Link>
              <Link href={"/community" as Route} className={SECONDARY_BUTTON_CLASSES}>
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
