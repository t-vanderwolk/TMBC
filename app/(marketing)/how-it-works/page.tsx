import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";

const rhythmHighlights = [
  {
    title: "Learn, plan, connect, reflect",
    description:
      "We treat these moments as a returning rhythm so you can revisit any pillar whenever clarity calls.",
  },
  {
    title: "Guided presence",
    description:
      "Mentors keep the pace gentle while reminding you that each return feels fresh, not repetitive.",
  },
  {
    title: "Steady breathing room",
    description:
      "No linear funnel — just a flow you step into and step away from as you need rest, input, or reflection.",
  },
];

const whatHappens = [
  {
    title: "We listen first",
    copy: "You share your current questions, and a mentor listens without judgement.",
  },
  {
    title: "We highlight what matters next",
    copy: "Conversations focus on the next small decision instead of touting an entire roadmap.",
  },
  {
    title: "We center your rhythm",
    copy: "Every check-in leans into learning, planning, connecting, or reflecting—whichever feels most alive.",
  },
];

const inviteNotes = [
  {
    title: "Healthy ratios",
    copy: "Invite-only keeps mentor ratios healthy and conversations personal.",
  },
  {
    title: "Steady guidance",
    copy: "We welcome members slowly so the care stays steady and attuned to your questions.",
  },
  {
    title: "Intentional care",
    copy: "This isn’t gatekeeping; it’s a way to keep the care intentional and calm.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/images/marketing/howitworks-hero.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Baby prep, minus the spiral."
        subheading="We guide you into a calm rhythm you can revisit for clarity."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "Explore the Experience",
          href: "/experience",
        }}
        priority
        motion
      />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="space-y-6 text-center">
            <p className="mkt-eyebrow">The rhythm</p>
            <h2 className="mkt-h2">A returnable flow, not a one-way path.</h2>
            <p className="mkt-body">
              Learning, planning, connecting, and reflecting live together. You can follow one, pause, and revisit the next whenever you want.
            </p>
            <p className="mkt-body">
              The rhythm is always gentle—just return when you need clarity and the flow will be there.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {rhythmHighlights.map((highlight) => (
                <div key={highlight.title} className="mkt-card px-6 py-8 text-left">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {highlight.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--tmbc-charcoal)]/80">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex justify-center">
          <ImageFrame className="w-full max-w-[920px]">
            <div className="aspect-[16/9] w-full">
              <img
                src="/images/marketing/ecosystem-preview.png"
                alt="How the Taylor-Made Baby Co. experience works: Learn, Plan, Connect, Reflect"
                className="h-full w-full object-contain"
              />
            </div>
          </ImageFrame>
          </section>

          <section className="space-y-6">
            <div className="space-y-4 text-center">
              <p className="mkt-eyebrow">What happens when you join</p>
              <h2 className="mkt-h2">The experience stays guided and gentle.</h2>
              <p className="mkt-body">
                Mentors orient you based on your questions so you can move forward with clarity.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {whatHappens.map((what) => (
                <div key={what.title} className="mkt-card px-8 py-8">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {what.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--tmbc-charcoal)]/80">{what.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-4 text-center">
              <p className="mkt-eyebrow">Invite-only, explained calmly</p>
              <h2 className="mkt-h2">Careful intake keeps the experience personal.</h2>
            </div>
            <div className="flex justify-center">
              <ImageFrame className="w-full max-w-[520px]">
                <div className="aspect-[4/3] w-full">
                  <img
                    src="/images/marketing/envelope.png"
                    alt="Icons representing the Taylor-Made Baby Co. invite process"
                    className="h-full w-full object-contain"
                  />
                </div>
              </ImageFrame>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {inviteNotes.map((note) => (
                <div key={note.title} className="mkt-card px-8 py-8 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                    {note.title}
                  </p>
                  <p className="mt-3 leading-relaxed">{note.copy}</p>
                </div>
              ))}
            </div>
            <p className="mkt-body">
              What happens next: we review your request, confirm the fit, and match you to steady support.
            </p>
            <p className="mkt-body text-[var(--tmbc-charcoal)]/60">No rush. No pressure.</p>
            <div className="mt-6 flex justify-center">
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
