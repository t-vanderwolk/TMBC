import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

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
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        priority
      />

      <MarketingContent>
        <div className="marketing-content space-y-20 md:space-y-24 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The problem we noticed
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You feel pressure, noise, and isolation — and you should not.
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
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
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {philosophyPoints.map((point) => (
                <div key={point.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {point.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{point.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="py-24 flex justify-center">
            <div className="w-full max-w-[520px]">
              <MobilePreviewImage
                src="/assets/images/babybookpic.jpeg"
                alt="Soft keepsake baby book resting beside dried flowers"
                width={520}
                height={780}
              />
            </div>
          </div>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                How we chose to respond
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Mentor-led, invite-only, slow by design.
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
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
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {fitStatements.map((fit) => (
                <div key={fit.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {fit.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{fit.description}</p>
                </div>
              ))}
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                We keep showing up with thoughtful presence, steady pacing, and an open invitation to return whenever you
                need it.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Request Your Invite
              </Link>
            </div>
          </section>
          {/* Placeholder: Atmospheric image reinforcing closing vision */}
          <div className="py-24 flex justify-center">
            <div className="w-full max-w-[520px] h-[320px] rounded-2xl bg-gradient-to-br from-white to-[var(--tmbc-ivory)]" />
          </div>
        </div>
      </MarketingContent>
    </>
  );
}
