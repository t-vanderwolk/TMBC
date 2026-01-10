import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

const rhythmHighlights = [
  {
    title: "Learn, plan, connect, reflect",
    description:
      "We treat these moments as a returning rhythm so you can revisit any pillar whenever clarity calls.",
  },
  {
    title: "Guided presence",
    description:
      "Mentors keep the pace gentle while reminding you that each return feels fresh, not repetitive.",
  },
  {
    title: "Steady breathing room",
    description:
      "No linear funnel — just a flow you step into and step away from as you need rest, input, or reflection.",
  },
];

const whatHappens = [
  "You share your current questions, and a mentor listens without judgement.",
  "Conversations highlight the next small decision rather than touting an entire roadmap.",
  "Every check-in centers on learning, planning, connection, or reflection, whichever feels most alive.",
];

const inviteNotes = [
  "Invite-only keeps mentor ratios healthy and the conversations personal.",
  "We welcome members slowly so the guidance remains steady and attuned to your questions.",
  "This is not about gatekeeping; it is about making sure the care stays intentional.",
];

export default function HowItWorksPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Baby prep, minus the spiral."
        supportingText="We introduce you to a calm, mentor-led rhythm instead of teaching you a process. You can return to the same pillars when you need clarity, with support that never rushes."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "Explore the Experience",
          href: "/experience",
        }}
        priority
      />


      <MarketingContent>
        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              The rhythm
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              A returnable flow, not a one-way path.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Learning, planning, connecting, and reflecting live together. You can follow one, pause, and revisit the next whenever you want.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rhythmHighlights.map((highlight) => (
              <div key={highlight.title} className="marketing-card bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  {highlight.title}
                </p>
                <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center py-24 md:py-32">
          <img
            src="/assets/images/ExperienceDiagram.png"
            alt="How the Taylor-Made Baby Co. experience works: Learn, Plan, Connect, Reflect"
            className="w-full max-w-[520px]"
            style={{ maxWidth: "min(520px, 90vw)" }}
          />
        </div>

        <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              What happens when you join
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              The experience stays guided and gentle.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Mentors orient you based on your questions so you can move forward with clarity.
            </p>
          </div>
          <div className="mt-10 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            <ul className="space-y-3">
              {whatHappens.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Invite-only, explained calmly
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Careful intake keeps the experience personal.
            </h2>
          </div>
          <div className="mt-10 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            {inviteNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <img
              src="/assets/images/inviteicons.png"
              alt="Icons representing the Taylor-Made Baby Co. invite process"
              className="max-w-[520px] w-full opacity-90"
            />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
            >
              Request calm access
            </Link>
          </div>
        </section>
      </MarketingContent>
    </>
  );
}
