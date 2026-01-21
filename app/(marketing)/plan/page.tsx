import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";
import PillarExplanation, { PILLAR_CONTENT } from "@/components/marketing/PillarExplanation";
import Section from "@/components/marketing/Section";

const planningSignals = [
  {
    title: "Thinking through the details",
    detail:
      "You surface the questions first, then make gentle choices with someone who keeps the pace steady.",
  },
  {
    title: "De-stressing timelines",
    detail:
      "No countdowns—just signals about what feels right now and what can wait a few breaths.",
  },
  {
    title: "Registry gently guided",
    detail:
      "We treat registries as living plans, not purchases, and mentors help you update when you actually feel ready.",
  },
  {
    title: "Mentor notes",
    detail:
      "Short reflections keep you aware of why a choice matters, not just what someone wants you to pick.",
  },
  {
    title: "Paced conversations",
    detail:
      "We revisit decisions together, remove distractions, and let the next step reveal itself without pressure.",
  },
  {
    title: "Confidence over completion",
    detail:
      "Peace of mind matters more than crossing a box—mentors help you hold the whole picture while you respond to this moment.",
  },
];

const planFit = [
  "You want clarity without rush.",
  "You prefer conversation to shopping lists.",
  "You trust mentors to guard the pace.",
];

export default function PlanPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/images/marketing/plan.jpeg"
        imageAlt="Editorial hero artwork for the Plan pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="Planning is steady clarity, not shopping."
        subheading="We hold the map gently while you choose when to move."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "How It Works (no rush)",
          href: "/how-it-works",
        }}
        motion
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <PillarExplanation {...PILLAR_CONTENT.plan} />
        </div>
      </Section>

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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mx-auto">
                We reframe registries, timelines, and logistics as steady decision points you revisit with a mentor who honors your season.
              </p>
            </div>
            <div className="mt-10 space-y-4 md:hidden">
              {planningSignals.map((signal) => (
                <details
                  key={signal.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {signal.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{signal.detail}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
              {planningSignals.map((signal) => (
                <div key={signal.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {signal.title}
                  </p>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{signal.detail}</p>
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
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/planpreview.png"
                    alt="Registry planning view preview showing living list of items and timing guidance"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
              <div className="flex justify-center">
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/membertomentor.png"
                    alt="Mentor notes preview showing decision support and context"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Bring what you already have, revisit it slowly, and let mentors remind you that every update is optional. This isn’t a shopping sprint but a living plan you adjust when it feels right.
              </p>
            </div>
            <ul className="mkt-bullet-list">
              {planFit.map((line) => (
                <li key={line} className="mkt-bullet-item">
                  {line}
                </li>
              ))}
            </ul>
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
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
