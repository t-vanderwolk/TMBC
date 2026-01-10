import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import InviteSection from "@/components/marketing/InviteSection";
import InviteCodeEntry from "@/components/marketing/InviteCodeEntry";

const noiseNotes = [
  "Every checklist shouts louder than the midnight spit-up clean-up, making your next decision feel urgent.",
  "Feeds full of curated nurseries leave your inbox untouched and your sleep schedule in a different timezone.",
  "Decision fatigue settles in when every screen demands a \"complete\" tap while you're still wondering what day it is.",
];

const quietResponse = [
  "Mentors ask before advising, so your rhythm decides what matters—not the loudest notification while baby slumbers on your lap.",
  "We keep the care calm, private, and steady, even when you're juggling a million \"why is this so hard?\" moments in parenthood.",
  "Intentional pacing lets each chapter land before the next one arrives, so nothing feels rushed while you're still changing a blowout.",
];

const whatThisIsntHighlights = [
  "This is not a countdown, a sales pitch, or a guilt trip disguised as urgency.",
  "You will not be pushed into every trending purchase because someone tagged it with \"parent hack.\"",
  "There's no pressure to sprint—this flow waits until you can actually breathe between feedings.",
];

const differenceHighlights = [
  "Human mentors keep the care personal, not algorithmic.",
  "Sequence over urgency—nothing moves until the previous chapter feels settled, even if baby just greeted you with a surprise blowout.",
  "Advocacy over selling keeps your questions in focus.",
  "Ongoing support means someone calm is checking in while you juggle spit-up and exhaustion.",
];

const systemStages = [
  {
    title: "Learn",
    heading: "Clarify what matters before you plan anything for baby",
    description:
      "We slow the flood of opinions so you learn what decisions are actually coming instead of Googling with the baby on your hip.",
    micro: "This stage keeps you ahead of the noise—no more midnight research rabbit holes.",
    preview: {
      src: "/assets/images/academydashboardpreview.png",
      alt: "Taylor-Made Academy dashboard preview",
    },
  },
  {
    title: "Plan",
    heading: "Co-create a calm plan after you understand the lay of the land",
    description:
      "Mentors help you pace the purchases and timelines so every choice is grounded in your household rhythm, not a trending checklist.",
    micro: "Plan quietly with someone who knows how to coach you past decision fatigue.",
    preview: {
      src: "/assets/images/planpreview.png",
      alt: "Planning workspace preview",
    },
  },
  {
    title: "Connect",
    heading: "Step into moderated rooms that meet you where you are",
    description:
      "Connect with other parents while mentors keep the energy low and the conversation useful instead of performative.",
    micro: "These sessions are distraction-free—no loud feeds, just thoughtful presence.",
    preview: {
      src: "/assets/images/connectpreview.png",
      alt: "Community connection preview",
    },
  },
  {
    title: "Reflect",
    heading: "Capture what you learned and keep it steady",
    description:
      "We collect reflections so mentors can see what worked, what felt weird, and what still needs attention before you move forward.",
    micro: "Reflection feels like a letter, not another notification badge.",
    preview: {
      src: "/assets/images/reflectpreview.png",
      alt: "Reflection & baby book preview",
    },
  },
];

const partnerLogos = [
  { file: "baby-quip-logo.svg", alt: "Baby Quip" },
  { file: "angelbliss-logo.avif", alt: "Angelbliss" },
  { file: "babyshusher-logo.png", alt: "Baby Shusher" },
  { file: "bellalunatoys.png", alt: "Bellaluna Toys" },
  { file: "ergobabylogo.png", alt: "Ergobaby" },
  { file: "happiestbaby-logo.png", alt: "Happiest Baby" },
  { file: "mustela-logo.png", alt: "Mustela" },
  { file: "tommee-tippee-logo.png", alt: "Tommee Tippee" },
];

const whatThisHighlights = [
  { title: "What this really is for parenthood", copy: quietResponse },
  { title: "What this is not for parenthood", copy: whatThisIsntHighlights },
];

export default function HomePage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. marketing hero"
        imageWidth={1536}
        imageHeight={1024}
        headline="Calmer prep for babyhood ahead"
        supportingText="Mentors slow the rhythm so you can prep for parenthood without googling at 2 a.m. while the baby spits up on your shirt."
        primaryCta={{
          label: "Start preparing",
          href: "/request-invite",
          className:
            "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "Learn how we guide you",
          href: "/how-it-works",
          className: "text-[0.65rem] uppercase tracking-[0.35em] underline text-[var(--tmbc-charcoal)]/80",
        }}
        priority
      />
      {/* Impact verification */}
      <div
        data-impact-verification
        style={{
          fontSize: "12px",
          color: "rgba(62, 47, 53, 0.6)",
          lineHeight: 1.2,
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        Impact-Site-Verification: 8939278e-825b-4d43-bf0d-d22ce986e2ae
      </div>
      <div className="px-6 text-center">
        <p className="mt-4 max-w-3xl mx-auto text-[0.8rem] text-[var(--tmbc-charcoal)] text-opacity-60">
          A concierge-led baby planning membership with mentors, intentional community rooms, and ongoing access for your rhythm.
        </p>
      </div>
      <InviteCodeEntry />
      <MarketingContent>
        <section className="marketing-section marketing-card bg-white/90 px-6 py-16 md:px-12 md:py-24 mt-16">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              What this is · What this isn’t
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              We slow the rhythm so you can notice what matters, not scramble for every next step.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Members get mentorship, calm community rooms, and the space to learn, plan, connect, and reflect without noise.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {whatThisHighlights.map((block) => (
              <div
                key={block.title}
                className="marketing-card bg-[var(--tmbc-ivory)]/70 p-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {block.title}
                </p>
                <ul className="mt-4 space-y-3 list-disc pl-4">
                  {block.copy.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <RibbonDivider className="my-12 md:my-16" />

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-6 py-16 md:px-12 md:py-24 mt-24">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              The system in place
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Learn · Plan · Connect · Reflect
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Each pillar waits for you to feel ready before the next begins, honoring your rhythm, not chasing tasks.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Image
              src="/assets/images/pillaricons.png"
              alt="Taylor-Made Baby Co. learning and planning pillars"
              width={720}
              height={360}
              className="mx-auto my-16 max-w-[85%]"
              style={{ height: "auto" }}
            />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {systemStages.map((stage) => (
              <div
                key={stage.title}
                className="marketing-card rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-6 text-sm text-[var(--tmbc-charcoal)]"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {stage.title}
                </p>
                <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">{stage.micro}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/experience"
              className="text-sm uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-80 underline"
            >
              See how the experience unfolds →
            </Link>
          </div>
        </section>

        <section className="marketing-section marketing-card bg-white/80 px-8 py-24 mt-24">
          <div className="max-w-3xl mx-auto space-y-5 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Why it feels loud
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              The noise is louder than the baby cues.
            </h2>
            <ul className="space-y-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              {noiseNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex justify-center my-24 md:my-32">
          <img
            src="/assets/images/experience.png"
            alt="Taylor-Made Baby Co. experience values: expert-built, mentor-led, personally matched"
            className="w-full max-w-[1000px]"
          />
        </section>

        <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 pt-20 pb-16 md:pt-24 md:pb-20 mt-24 mb-12">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Ready when baby lets you breathe
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
              Care that keeps pace with your parenting rhythm.
            </h2>
            <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              Request an invite when the baby schedule lets you breathe; we’ll keep leaning in while you juggle feedings.
            </p>
            <section className="flex justify-center my-24 md:my-32">
              <img
                src="/assets/images/inviteflow.png"
                alt="Invite-only onboarding process from request to mentorship and guided experience"
                className="w-full max-w-[960px]"
              />
            </section>
            <div className="space-y-2">
              <Link
                href="/request-invite"
                className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
              >
                Plan calmly
              </Link>
              <Link
                href="/request-invite?returning=true"
                className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-70 underline"
              >
                Already have an invite? Enter it here.
              </Link>
            </div>
            <div className="mt-8 max-w-md mx-auto">
              <Suspense fallback={<div className="h-24" />}>
                <InviteSection />
              </Suspense>
            </div>
          </div>
        </section>
      </MarketingContent>
    </>
  );
}
