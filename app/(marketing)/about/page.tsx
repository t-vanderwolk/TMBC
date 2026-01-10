import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import dividerRibbon from "../../../assets/images/divider-ribbon-horizontal.png";

const problemStatements = [
  "The questions ahead feel louder than the answers because every list demands urgency.",
  "Isolation grows when every option looks like speculation, and the noise makes you doubt what you already know.",
  "Many parenting stories feel performance-based — we wanted a space that simply holds the rest."
];

const philosophyPoints = [
  {
    title: "Calm over urgency",
    description:
      "We slow the rhythm so you can settle into decisions without racing toward the next item.",
  },
  {
    title: "Guidance over information",
    description:
      "Mentors keep context front and center, so each answer feels thoughtful instead of reactive.",
  },
  {
    title: "Pacing over pressure",
    description:
      "You move through the experience at your own pace, returning to pillars whenever fresh clarity emerges.",
  },
];

const responseChoices = [
  "Mentor-led rooms keep the dialogue grounded in your life instead of trending topics.",
  "Invite-only intake protects the care so mentors respond to real questions, not volume.",
  "We design the experience around steady decisions, not outcomes or checklists."
];

const fitStatements = [
  {
    title: "You want calm conviction",
    description:
      "You would rather reflect with a mentor than chase the latest launch or curated playlist.",
  },
  {
    title: "You value thoughtful pacing",
    description:
      "You appreciate gentle nudges and room to pause rather than countdowns and notifications.",
  },
  {
    title: "You honor your own rhythm",
    description:
      "Making a choice today does not commit you to anything tomorrow — TMBC adapts with you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Why Taylor-Made Baby Co. exists."
        supportingText="Because preparation should feel like guidance, not pressure. We exist to quiet the noise, keep mentors present, and let you move through this season with calm conviction."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-soft marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        priority
      />

      <MarketingContent>
        <div className="marketing-content space-y-16 md:space-y-20 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The problem we noticed
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You feel pressure, noise, and isolation — and you should not.
              </h2>
            </div>
            <div className="mt-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed space-y-3">
              {problemStatements.map((statement) => (
                <p key={statement}>{statement}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The philosophy
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Calm, guided, paced.
              </h2>
            </div>
            <div className="mt-12 space-y-5 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
              {philosophyPoints.map((point) => (
                <div key={point.title} className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {point.title}
                  </p>
                  <p>{point.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="py-28 my-6 flex justify-center">
            <div className="w-full max-w-[520px]">
              <img
                src={dividerRibbon.src}
                alt="Calm bow ribbon divider"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                How we chose to respond
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Mentor-led, invite-only, slow by design.
              </h2>
            </div>
            <div className="mt-6 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
              {responseChoices.map((choice) => (
                <p key={choice}>{choice}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this is for (and not for)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You choose whether to stay.
              </h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  For this
                </p>
                {fitStatements.slice(0, 2).map((fit) => (
                  <div key={fit.title} className="space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {fit.title}
                    </p>
                    <p>{fit.description}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Not for this
                </p>
                {fitStatements.slice(2).map((fit) => (
                  <div key={fit.title} className="space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {fit.title}
                    </p>
                    <p>{fit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Our commitment
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Quiet conviction, long-term care.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                We keep showing up with thoughtful presence, steady pacing, and an open invitation to return whenever you
                need it.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Request quiet access
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
