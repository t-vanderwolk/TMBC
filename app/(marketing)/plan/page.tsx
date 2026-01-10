import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

const planningMeaning = [
  {
    title: "Thinking through the details with a mentor",
    description:
      "You surface the questions first, then make gentle choices with someone who knows how to keep the pace steady.",
  },
  {
    title: "De-stressing timelines",
    description:
      "No launch dates, no countdown timers — just signals about what feels right now and what can be parked until later.",
  },
  {
    title: "Registry gently guided",
    description:
      "We treat registries as living plans, not purchases, so additions happen when you feel ready rather than when you feel rushed.",
  },
];

const decisionSupport = [
  {
    title: "Mentor notes",
    description:
      "Short, contextual reflections keep you aware of why a choice matters, not just what you should pick.",
  },
  {
    title: "Paced conversations",
    description:
      "We revisit decisions together, truncate distractions, and let the next step reveal itself without pressure.",
  },
  {
    title: "Confidence over completion",
    description:
      "The goal is peace of mind, not crossing off tasks — mentors help you hold the whole picture while you respond to this moment.",
  },
];

const planFit = [
  {
    title: "You want clarity without rush",
    description:
      "You appreciate gentle prompts and follow-ups, not new dates every day.",
  },
  {
    title: "You prefer conversation to shopping lists",
    description:
      "Registry updates happen in context, so you only adjust what still feels essential.",
  },
  {
    title: "You trust mentors to guard the pace",
    description:
      "Planning stays calm because people are keeping tabs on the rhythm, not piling on more tasks.",
  },
];

const planningSignals = [...planningMeaning, ...decisionSupport];

export default function PlanPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Plan pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="Planning is steady clarity, not shopping."
        supportingText="A mentor helps you see the next right step without glossing over the questions you still have. We hold the map gently while you choose when to move."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (no rush)",
          href: "/how-it-works",
        }}
      />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What planning means here
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Planning is a calm conversation, not a checklist race.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                We reframe registries, timelines, and logistics as steady decision points you revisit with a mentor who honors your season.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {planningSignals.map((signal) => (
                <div key={signal.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Planning workspace
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The system keeps the decisions visible without pressure.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The registry planning view and mentor notes keep the workspace gentle, contextual, and ready when you are.
              </p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="flex justify-center">
                <div className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/planpreview.png"
                    alt="Registry planning view preview showing living list of items and timing guidance"
                    width={360}
                    height={720}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/membertomentor.png"
                    alt="Mentor notes preview showing decision support and context"
                    width={360}
                    height={720}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-4 items-center text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Registry as a living plan
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Registries evolve with you.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Bring what you already have, revisit it slowly, and let mentors remind you that every update is optional. This is not a shopping sprint but a living plan you adjust when it feels right.
              </p>
            </div>
            <div className="mt-8 grid gap-4 text-left text-sm text-[var(--tmbc-charcoal)] text-opacity-80 md:grid-cols-3">
              {planFit.map((fit) => (
                <p key={fit.title}>• {fit.description}</p>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Planning keeps pace with learning and reflection.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Decisions stay calm because mentors keep watch, and the plan shifts as you learn and reflect. When you feel ready, request an invite and continue the rhythm.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Continue the rhythm
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
