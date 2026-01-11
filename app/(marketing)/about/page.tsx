import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import dividerRibbon from "../../../assets/images/divider-ribbon-horizontal.png";

const problemStatement =
  "The questions ahead feel louder than answers, isolation grows when every option feels speculative, and many parenting stories ask you to perform—TMBC simply holds the rest.";

const philosophyPoints = [
  {
    title: "Calm over urgency",
    description: "We slow the rhythm so you can settle into decisions without racing ahead.",
  },
  {
    title: "Guidance over information",
    description: "Mentors keep context front and center so every answer feels thoughtful.",
  },
  {
    title: "Pacing over pressure",
    description:
      "You move through the experience at your own pace, returning to pillars whenever clarity emerges.",
  },
];

const responseChoices = [
  {
    title: "Mentor-led rooms",
    description: "Dialogue stays grounded in your rhythms—not trending topics.",
  },
  {
    title: "Invite-only intake",
    description: "Protects the care so mentors respond to real questions, not volume.",
  },
  {
    title: "Steady decisions",
    description: "We design around calm choices, not outcomes or checklists.",
  },
];

const fitStatements = [
  {
    title: "You want calm conviction",
    description: "You’d rather reflect with a mentor than chase the latest launch.",
  },
  {
    title: "You value thoughtful pacing",
    description: "Gentle nudges and room to pause matter more than countdowns.",
  },
  {
    title: "You honor your own rhythm",
    description: "A choice today doesn’t lock you in tomorrow—TMBC adapts with you.",
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
        supportingText="We quiet the noise, keep mentors present, and let you move through this season calmly."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-soft marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        priority
        motion
      />

      <MarketingContent>
        <div className="marketing-content space-y-16 md:space-y-20 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                The problem we noticed
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You feel pressure, noise, and isolation — and you should not.
              </h2>
            </div>
            <p className="mt-6 max-w-3xl mx-auto text-sm leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80">
              {problemStatement}
            </p>
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
            <div className="mt-12 space-y-3 md:hidden">
              {philosophyPoints.map((point) => (
                <details
                  key={point.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/70 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {point.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{point.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
              {philosophyPoints.map((point) => (
                <div key={point.title} className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                    {point.title}
                  </p>
                  <p className="mt-3">{point.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                How we act on it
              </p>
              <div className="space-y-2">
                {responseChoices.map((choice) => (
                  <p key={choice.title}>{choice.description}</p>
                ))}
              </div>
            </div>
          </section>

          <div className="py-28 my-6 flex justify-center">
            <ImageFrame className="w-full max-w-[520px]">
              <img
                src={dividerRibbon.src}
                alt="Calm bow ribbon divider"
                className="w-full h-auto rounded-[28px]"
                loading="lazy"
              />
            </ImageFrame>
          </div>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this is for (and not for)
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                You choose whether to stay.
              </h2>
            </div>
            <p className="mt-4 max-w-3xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              TMBC is intentionally boundary-based—here’s where it belongs.
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  For this
                </p>
                <ul className="mt-3 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  {fitStatements.slice(0, 2).map((fit) => (
                    <li key={fit.title}>
                      <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                        {fit.title}
                      </span>
                      <p className="mt-1">{fit.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Not for this
                </p>
                <ul className="mt-3 space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  {fitStatements.slice(2).map((fit) => (
                    <li key={fit.title}>
                      <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                        {fit.title}
                      </span>
                      <p className="mt-1">{fit.description}</p>
                    </li>
                  ))}
                </ul>
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
