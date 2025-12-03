import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] hover:scale-105 transition-all";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

const experiences = [
  {
    title: "Concierge Onboarding",
    description: "A calm call to map your story, rituals, and needs with a thoughtful curator.",
  },
  {
    title: "Mentor Salons",
    description: "Small evening salons with founders, artists, and clinicians who share honest wisdom.",
  },
  {
    title: "Registry Retreats",
    description: "Guided shop sessions that feel like tea with a stylist rather than a shopping list.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Experience</p>
          <h1 className="font-serif text-4xl text-[#3E2F35] md:text-5xl">Curated experiences, always calm</h1>
          <p className="mt-4 text-sm text-[#3E2F35]/80">
            We design rituals, salons, and concierge hand-holding so every moment feels intentional and restful.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/learn" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Learn More
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl space-y-8">
          <header className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Rituals & council</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">Experiences that slow the scroll</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {experiences.map((experience) => (
              <article
                key={experience.title}
                className="rounded-[2.25rem] border border-[#D9C48E]/30 bg-white p-6 shadow-[0_12px_35px_rgba(62,47,53,0.12)]"
              >
                <h3 className="font-serif text-xl text-[#3E2F35]">{experience.title}</h3>
                <p className="mt-3 text-sm text-[#3E2F35]/80">{experience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="border-t border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl">
          <div className="space-y-4 rounded-[2.5rem] border border-[#D9C48E]/40 bg-white p-8 shadow-[0_15px_40px_rgba(62,47,53,0.16)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Stay close</p>
            <h3 className="font-serif text-3xl text-[#3E2F35]">The TMBC experience is layered, soft, and purposeful</h3>
            <p className="text-sm text-[#3E2F35]/80">
              Mini-salons, bespoke mentor access, and concierge check-ins keep your journey curated and calm.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
                Join Membership
              </Link>
              <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
                Request Invite
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
