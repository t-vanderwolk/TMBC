import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";


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
        supportingText="The Taylor-Made Baby Academy is a mentor-guided learning path that helps you understand what decisions are ahead before you plan, buy, or prepare. Calm, practical, and paced — one journey at a time."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (gently)",
          href: "/how-it-works",
        }}
        />
      </div>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 mt-12 mb-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                THE ACADEMY APPROACH
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                This isn’t a course library or a checklist to finish.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The Academy exists to give you clarity before decisions — so planning feels grounded, not rushed.
              </p>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Each journey unlocks only when the previous one is complete, keeping the focus on what matters most right
                now.
              </p>
            </div>
            <div className="mt-10 flex flex-col items-center space-y-6 text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                TAYLOR-MADE ACADEMY
              </p>
              <h3 className="font-serif text-2xl text-[var(--tmbc-charcoal)] text-opacity-80">
                Your guided learning path — with a mentor beside you
              </h3>
              <p className="max-w-[90%] text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:max-w-[520px]">
                A calm, decision-first Academy designed to help you understand what matters, when it matters — before you
                plan, buy, or commit.
              </p>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
              Orientation first; module previews follow.
            </p>
          </section>
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 mt-24 mb-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Guided journeys
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)] text-opacity-80">
                The Academy is organized into three guided journeys
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Mentors keep you moving through Nursery, Gear, and Postpartum in order so each decision feels steady and
                grounded in real-life timing.
              </p>
            </div>
            <div className="mt-10 space-y-8">
              <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  This is typically a third-trimester learning phase.
                </p>
                <h3 className="font-serif text-xl text-[var(--tmbc-charcoal)] text-opacity-85">Nursery comes first — for a reason</h3>
                <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  Nursery decisions involve the highest price points, long shipping timelines, and foundational safety choices.
                  This journey focuses on layout, safe sleep, lighting, and home readiness so those big, early decisions land thoughtfully and without pressure.
                </p>
                <div className="mt-6 flex w-full justify-center">
                  <div className="w-full max-w-[80%] md:max-w-[360px]">
                    <MobilePreviewImage
                      src="/assets/images/nurserymodulepreview.png"
                      alt="Nursery module preview"
                      width={360}
                      height={720}
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  Decisions here are practical, not brand-driven.
                </p>
                <h3 className="font-serif text-xl text-[var(--tmbc-charcoal)] text-opacity-85">Gear follows once the foundation is set</h3>
                <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  Gear learning focuses on safety, compatibility, and real-world use—from car seats to travel systems. You’ll learn how products fit your routines before choosing what to buy, with mentor guidance built in.
                </p>
                <div className="mt-6 flex w-full justify-center">
                  <div className="w-full max-w-[80%] md:max-w-[360px]">
                    <MobilePreviewImage
                      src="/assets/images/gearmodulepreview.png"
                      alt="Gear module preview"
                      width={360}
                      height={720}
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6">
                <h3 className="font-serif text-xl text-[var(--tmbc-charcoal)] text-opacity-85">Postpartum learning comes last — intentionally</h3>
                <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                  Postpartum modules prepare you for recovery, feeding strategies, and personal care as birth approaches. This journey centers you—helping you plan support, routines, and essentials for the fourth trimester.
                </p>
                <div className="mt-6 flex w-full justify-center">
                  <div className="w-full max-w-[80%] md:max-w-[360px]">
                    <MobilePreviewImage
                      src="/assets/images/postpartummodulepreview.png"
                      alt="Postpartum module preview"
                      width={360}
                      height={720}
                    />
                  </div>
                </div>
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
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
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
