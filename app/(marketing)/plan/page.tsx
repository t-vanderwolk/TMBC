import Link from "next/link";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

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
      <RibbonDivider />

      <MarketingContent>
        <section className="py-24 md:py-32 flex justify-center">
          <div className="w-full max-w-[90%] md:max-w-[520px] flex justify-center">
            <img
              src="/assets/images/planpreview.png"
              alt="Taylor-Made Baby Co. planning workspace preview with guided decisions."
              className="ui-preview-image w-full h-auto object-contain rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
            />
          </div>
        </section>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What planning means here
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Planning is a calm conversation, not a checklist race.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                We reframe registries, timelines, and logistics as steady decision points you revisit with a mentor who
                honors your season.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {planningMeaning.map((meaning) => (
                <div key={meaning.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {meaning.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{meaning.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                How decisions are supported
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Mentors keep the decisions grounded and gentle.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {decisionSupport.map((signal) => (
                <div key={signal.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{signal.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Registry as a living plan
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Registries evolve with you.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Bring what you already have, revisit it slowly, and let mentors remind you that every update is optional.
                This is not a shopping sprint but a living plan you adjust when it feels right.
              </p>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Who this helps most
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                For people who want planning to feel steady.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {planFit.map((fit) => (
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
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Planning keeps pace with learning and reflection.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Decisions stay calm because mentors keep watch, and the plan shifts as you learn and reflect. When you feel ready, request an invite and continue the rhythm.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Request Your Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
