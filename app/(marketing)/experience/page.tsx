import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

const processSteps = [
  {
    title: "Request an invitation",
    description: "Tell us where you are in pregnancy or parenthood so mentors can meet you with context.",
  },
  {
    title: "Get matched with your mentor",
    description: "A human mentor learns your rhythm, priorities, and questions before sketching the next right move.",
  },
  {
    title: "Move through Learn · Plan · Connect · Reflect",
    description: "Each pillar waits until you signal readiness, keeping the experience calm and steady.",
  },
  {
    title: "Continue with ongoing access",
    description: "The care stays open so you can revisit signals, ask new questions, and lean into the circle when it feels right.",
  },
];

const pillars = [
  {
    title: "Learn",
    description: "We quiet the noise so the next decision feels clear, not frantic.",
  },
  {
    title: "Plan",
    description: "Mentors help you map the logistics without leaking stress into your calendar.",
  },
  {
    title: "Connect",
    description: "Community rooms stay moderated and gentle, with invitations instead of pressure.",
  },
  {
    title: "Reflect",
    description: "We capture what works so mentors can anchor the next chapter in what felt steady.",
  },
];

const pillarPreviews = [
  {
    title: "Learn",
    heading: "Learn what matters right now",
    description:
      "The Academy dashboard keeps your active modules, mentor notes, and workbook cues in one quiet view so you can decide when to move forward.",
    imageSrc: "/assets/images/academydashboardpreview.png",
    imageAlt: "Academy dashboard preview showing mentor notes and the next modules you’ll unlock",
    background: "bg-white/80",
  },
  {
    title: "Plan",
    heading: "Plan with steady context",
    description:
      "The planning workspace layers registry guidance, decision notes, and timelines so every choice arrives with the right support instead of pressure.",
    imageSrc: "/assets/images/planpreview.png",
    imageAlt: "Planning view preview with registry guidance and mentor reflections",
    background: "bg-[var(--tmbc-ivory)]/90",
  },
  {
    title: "Connect",
    heading: "Connect in circles that breathe",
    description:
      "Messaging stays moderated and intentional—mentors prompt check-ins, keep tone calm, and let you respond when it feels right.",
    imageSrc: "/assets/images/connectpreview.png",
    imageAlt: "Connect preview showing gentle messaging and circle prompts",
    background: "bg-white/80",
  },
  {
    title: "Reflect",
    heading: "Reflect on what settles you",
    description:
      "Reflection logs archive what has worked, what shifted, and how mentors respond so the next chapter starts with that calm context.",
    imageSrc: "/assets/images/reflectpreview.png",
    imageAlt: "Reflection preview showing workbook entries and mentor notes",
    background: "bg-[var(--tmbc-ivory)]/90",
  },
];

const reassurance = [
  "Trusted by parents who need a calm pulse, not another checklist.",
  "Mentors keep ratios small so every member feels seen.",
];

export default function ExperiencePage() {
  return (
    <>
      <MarketingHero
        imageSrc="/images/marketing/home-hero.png"
        imageAlt="Soft ribbon hero art for the Experience page."
        imageWidth={1536}
        imageHeight={1024}
        headline="How the Taylor-Made Baby Co. membership works"
        subheading="A calm, human-paced membership that maps mentors, community, and the experience into one steady rhythm."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        priority
      />

      <MarketingContent>
        <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Process snapshot
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              What happens after you raise your hand
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {step.title}
                </p>
                <p className="mt-3 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Learn · Plan · Connect · Reflect
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              One continuous experience shaped with care
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              The pillars stay connected so you can move between learning, planning, community, and reflection without losing context.
            </p>
          </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-5 shadow-[0_12px_30px_rgba(62,47,53,0.12)]">
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {pillar.title}
                    </p>
                    <p className="mt-2 leading-relaxed text-base text-[var(--tmbc-charcoal)] text-opacity-80">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-16 space-y-20">
            {pillarPreviews.map((preview) => (
              <section
                key={preview.title}
                className={`marketing-section marketing-card ${preview.background} px-8 py-20 md:py-28`}
              >
                <div className="space-y-3 text-center">
                  <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {preview.title}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                    {preview.heading}
                  </h2>
                  <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                    {preview.description}
                  </p>
                </div>
                <div className="mt-10 flex justify-center">
                  <div className="w-full max-w-[360px]">
                    <MobilePreviewImage
                      src={preview.imageSrc}
                      alt={preview.imageAlt}
                      width={360}
                      height={720}
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

        <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28">
          <div className="space-y-3 text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            {reassurance.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="space-y-4 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Ready when you are
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              There's no rush—request an invitation whenever the timing feels calm, and we’ll keep the membership quiet until you arrive.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </div>
        </section>
      </MarketingContent>
    </>
  );
}
