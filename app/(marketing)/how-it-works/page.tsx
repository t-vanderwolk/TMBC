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
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Baby prep, minus the spiral."
        supportingText="We guide you into a calm rhythm you can revisit for clarity."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "Explore the Experience",
          href: "/experience",
        }}
        priority
        motion
      />


      <MarketingContent>
        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              The rhythm
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              A returnable flow, not a one-way path.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Learning, planning, connecting, and reflecting live together. You can follow one, pause, and revisit the next whenever you want.
            </p>
            <p className="mx-auto max-w-2xl text-sm text-[var(--tmbc-charcoal)]/70">
              The rhythm is always gentle—just return when you need clarity and the flow will be there.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rhythmHighlights.map((highlight) => (
              <div key={highlight.title} className="marketing-card bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                  {highlight.title}
                </p>
                <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-center py-24 md:py-32">
          <ImageFrame className="max-w-[520px]">
            <img
              src="/assets/images/ExperienceDiagram.png"
              alt="How the Taylor-Made Baby Co. experience works: Learn, Plan, Connect, Reflect"
              className="w-full rounded-[28px]"
              loading="lazy"
            />
          </ImageFrame>
        </div>

        <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 border-y border-[var(--tmbc-charcoal)]/10">
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              What happens when you join
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              The experience stays guided and gentle.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Mentors orient you based on your questions so you can move forward with clarity.
            </p>
          </div>
          <div className="mt-10 space-y-3 md:hidden">
            {whatHappens.map((what) => (
              <details
                key={what.title}
                className="group rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/60 p-5"
              >
                <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                  {what.title}
                </summary>
                <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{what.copy}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
            {whatHappens.map((what) => (
              <div
                key={what.title}
                className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {what.title}
                </p>
                <p className="mt-3">{what.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
          <div className="flex flex-col gap-4 items-center text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Invite-only, explained calmly
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Careful intake keeps the experience personal.
            </h2>
          </div>
          <div className="mt-10 space-y-3 md:hidden">
            {inviteNotes.map((note) => (
              <details
                key={note.title}
                className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
              >
                <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                  {note.title}
                </summary>
                <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{note.copy}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 hidden gap-6 md:grid md:grid-cols-3">
            {inviteNotes.map((note) => (
              <div
                key={note.title}
                className="marketing-card bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                  {note.title}
                </p>
                <p className="mt-3">{note.copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--tmbc-charcoal)]/70">
            What happens next: we review your request, confirm the fit, and match you to steady support.
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)]/60">
            No rush. No pressure.
          </p>
          <div className="mt-10 flex justify-center">
            <ImageFrame className="max-w-[520px]">
              <img
                src="/assets/images/inviteicons.png"
                alt="Icons representing the Taylor-Made Baby Co. invite process"
                className="w-full rounded-[26px] opacity-90"
                loading="lazy"
              />
            </ImageFrame>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
            >
              Request calm access
            </Link>
          </div>
        </section>
      </MarketingContent>
    </>
  );
}
