import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

const academyFocus = [
  "We introduce modules slowly so you know what questions are ahead before you plan, buy, or commit.",
  "Each journey unlocks only when the previous one settles, keeping the focus on what matters now instead of chasing the next shiny thing.",
];

const journeys = [
  {
    phase: "Nursery",
    summary: "First wave so your foundational safety and layout choices land thoughtfully.",
    detail:
      "Nursery covers layout, safe sleep, lighting, and home readiness—decisions that move slowly because they involve long timelines and high price points.",
  },
  {
    phase: "Gear",
    summary: "Next wave that keeps registry choices practical and rooted in routine.",
    detail:
      "Gear learning focuses on safety, compatibility, and real-world use, with mentors helping you consider how each product fits your day-to-day before you buy.",
  },
  {
    phase: "Postpartum",
    summary: "Last wave that primes support, recovery, and the fourth-trimester routine.",
    detail:
      "Postpartum modules center you—planning for recovery, feeding strategies, and the essentials that keep the fourth trimester steady.",
  },
];

const workbookPromises = [
  "Your mentor keeps the next move calm instead of urgent.",
  "Workbook reflections stay private and shared only with people you invite.",
  "Questions and uncertainties are expected, not symptoms that you’re behind.",
];

export default function LearnPage() {
  return (
    <>
      <div className="learn-hero-target">
        <MarketingHero
          imageSrc="/assets/images/section-background-learning-flow.png"
          imageAlt="Educational hero artwork for the Learn pillar."
          imageWidth={1536}
          imageHeight={1024}
        headline="Learn what matters — in the right order."
        supportingText="The Academy guides you through what matters before you plan, buy, or prepare."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (gently)",
          href: "/how-it-works",
        }}
        motion
      />
      </div>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-12 mb-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                THE ACADEMY APPROACH
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                This isn’t a course library or a checklist to finish.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                {academyFocus.join(" ")}
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                TAYLOR-MADE ACADEMY
              </p>
            </div>
            <p className="mt-3 max-w-[90%] text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:max-w-[520px] mx-auto">
              A calm, decision-first Academy designed to show you what matters when it matters—before you plan, buy, or commit.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Orientation first; module previews follow.
            </p>
          </section>
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-20 mb-8 border-y border-[var(--tmbc-charcoal)]/5">
            <div className="flex flex-col items-center space-y-4 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Guided journeys
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The Academy is organized into three guided journeys
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Mentors keep you moving through Nursery, Gear, and Postpartum so each decision feels steady and grounded.
              </p>
            </div>
            <div className="mt-10 space-y-4 md:hidden">
              {journeys.map((journey) => (
                <details
                  key={journey.phase}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {journey.phase}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{journey.detail}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
              {journeys.map((journey) => (
                <div key={journey.phase} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {journey.phase}
                  </p>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{journey.detail}</p>
                </div>
              ))}
            </div>
          </section>


          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="space-y-5 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Interface previews
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The workspace keeps you grounded
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The Academy dashboard and module progression views show you where you are, what unlocks next, and how mentors respond before you move forward.
              </p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div className="flex justify-center">
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/academydashboardpreview.png"
                    alt="Academy dashboard preview showing mentor notes and upcoming modules"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
              <div className="flex justify-center">
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/gearmodulepreview.png"
                    alt="Module progression preview showing a guided journey and the next steps"
                    width={360}
                    height={720}
                    priority
                  />
                </ImageFrame>
              </div>
            </div>
          </section>


          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="flex flex-col space-y-6 items-center text-center">
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Learning in the Academy is never meant to happen alone.
              </h2>
              <div className="w-full max-w-[80%] md:max-w-[520px]">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    WORKBOOK PREVIEW
                  </p>
                </div>
              </div>
              <ul className="ml-4 list-disc space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                <li>Your mentor helps you decide what to focus on next</li>
                <li>Workbook reflections are shared directly with your mentor</li>
                <li>Questions and uncertainties are expected — not signs you’re behind</li>
              </ul>
              <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The goal isn’t completion. It’s clarity.
              </p>
              <div className="mt-10 flex justify-center">
                <ImageFrame className="w-full max-w-[360px]">
                  <MobilePreviewImage
                    src="/assets/images/academyworkbookpreview.png"
                    alt="Workbook preview showing reflection prompts and mentor notes"
                    width={360}
                    height={720}
                  />
                </ImageFrame>
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Learning always comes before planning.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Once you understand your options, your mentor helps translate that clarity into a plan that fits your
                life — not someone else’s checklist.
              </p>
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Begin quietly
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
