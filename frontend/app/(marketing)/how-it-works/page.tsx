import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] hover:scale-105 transition-all";
const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] hover:scale-105 transition-all";

const steps = [
  {
    title: "Concierge Intake",
    description: "Tell us about your family, your rhythm, and the mysteries we can make familiar.",
  },
  {
    title: "Tailored Planning",
    description: "Living roadmaps keep every checklist feeling gentle and completely yours.",
  },
  {
    title: "Community & Mentors",
    description: "Mini salons and mentor hours bring the calm, creative answers you need.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">The TMBC Flow</p>
          <h1 className="font-serif text-4xl text-[#3E2F35] md:text-5xl">Learn. Plan. Connect.</h1>
          <p className="mt-4 text-sm text-[#3E2F35]/80">
            We choreograph concierge care, calm resources, and compassionate mentors so you can navigate each
            trimester with clarity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Membership
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-8">
          <header className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Step-by-step journey</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">A calm, concierge-led blueprint</h2>
          </header>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-[2.25rem] border border-[#D9C48E]/30 bg-white p-6 shadow-[0_12px_35px_rgba(62,47,53,0.12)]"
              >
                <h3 className="font-serif text-xl text-[#3E2F35]">{step.title}</h3>
                <p className="mt-3 text-sm text-[#3E2F35]/80">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto grid max-w-screen-xl gap-8 rounded-[2.5rem] border border-[#D9C48E]/40 bg-white p-8 md:grid-cols-[0.6fr,0.4fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">Concierge planning</p>
            <h3 className="font-serif text-3xl text-[#3E2F35]">Every detail feels purposeful</h3>
            <p className="text-sm text-[#3E2F35]/80">
              We balance calm, creative prompts with ritual-ready checklist moments so your story unfolds at a gentle pace.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center gap-3">
            <Link href={"/experience" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Explore Experience
            </Link>
            <Link href={"/membership" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Join Membership
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
