import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";
import PillarExplanation, { PILLAR_CONTENT } from "@/components/marketing/PillarExplanation";
import Section from "@/components/marketing/Section";

const journeys = [
  {
    phase: "Nursery",
    summary: "First wave so your foundational safety and layout choices land thoughtfully.",
  },
  {
    phase: "Gear",
    summary: "Next wave that keeps registry choices practical and rooted in routine.",
  },
  {
    phase: "Postpartum",
    summary: "Last wave that primes support, recovery, and the fourth-trimester routine.",
  },
];

export default function LearnPage() {
  return (
    <>
      <div className="learn-hero-target">
      <MarketingHero
          imageSrc="/images/marketing/learn.jpeg"
          imageAlt="Educational hero artwork for the Learn pillar."
          imageWidth={1536}
          imageHeight={1024}
          headline="Learn what matters — in the right order."
          subheading="The Academy guides you through what matters before you plan, buy, or prepare."
          primaryCta={{
            label: "Request an Invite",
            href: "/request-invite",
          }}
          motion
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <PillarExplanation {...PILLAR_CONTENT.learn} />
        </div>
      </Section>
      </div>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Where learning begins
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Context, not curriculum
              </h2>
            </div>
            <p className="mt-6 max-w-2xl mx-auto text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Mentors help you surface the right questions before you open the workbook, so every lesson stays grounded in
              your real life—not a checklist.
            </p>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Guided journeys
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Three steady paths
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Nursery, Gear, and Postpartum unfold in that order so your mentor keeps you moving with intentional pace.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {journeys.map((journey) => (
                <div key={journey.phase} className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">{journey.phase}</p>
                  <p className="mt-3 text-base leading-relaxed">{journey.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/90 px-8 py-20 md:py-28">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-10">
              <div className="space-y-5 text-center">
                <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  Interface preview
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--tmbc-charcoal)] text-opacity-80">
                  Where you land
                </h2>
                <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  The Academy workspace surfaces what’s next, how mentors respond, and why you’re pausing before you commit.
                </p>
              </div>
              <div className="flex justify-center">
                <ImageFrame className="w-full max-w-[380px] bg-white/90 shadow-none border border-[var(--tmbc-charcoal)]/10">
                  <MobilePreviewImage
                    src="/assets/images/academydashboardpreview.png"
                    alt="Academy dashboard preview showing mentor notes and upcoming modules"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Mentors keep the pace steady
              </h2>
              <p className="max-w-2xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                You don’t start the modules alone. Mentor guidance keeps every lesson tied to your season, not someone else’s checklist.
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                We celebrate the small “aha” moments like they’re confetti.
              </p>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Ready when you are
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Orientation before commitment
              </h2>
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
