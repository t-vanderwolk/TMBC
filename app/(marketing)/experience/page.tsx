import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import Button from "@/components/ui/Button";
import MarketingHero from "@/components/marketing/MarketingHero";
import SectionDivider from "@/components/marketing/SectionDivider";
import experienceHero from "@/assets/images/experienceherobunny.png";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import livingRoomSofa from "@/assets/images/living-room-sofa.jpeg";

export const metadata = {
  title: "Taylor-Made Baby Co. - Concierge birth & baby planning",
};

const pillarHighlights = [
  {
    id: "learn",
    title: "Learn",
    thesis: "This is where clarity begins.",
    paragraph:
      "The first pillar gives you the room to understand categories, tradeoffs, and safety considerations before anything feels urgent. You move through conversations at your own pace, asking questions and pulling in stories about how decisions have played out in real homes. When you’re ready, you step toward the registry with context instead of pressure.",
    bullets: [
      "Quiet guided lessons that describe what each gear category is designed to do and why it matters for your routines.",
      "Mentor prompts that help you notice tradeoffs—space, timing, baby safety—so you can say yes to what fits and no to what doesn’t.",
      "Short, focused reflections that surface your instincts before a single purchase is considered.",
      "A calm, conversational tone so learning never feels rushed or like a checklist.",
    ],
    why: "Education without pressure keeps your confidence steady, making decisions feel natural instead of frantic.",
    image: {
      src: learnPillar,
      alt: "Illustrated open book with soft colors representing careful learning",
    },
  },
  {
    id: "plan",
    title: "Plan",
    thesis: "The plan pillar is how thoughtful decisions take shape.",
    paragraph:
      "Here you and your mentor translate understanding into a registry that reflects your life—your home, habits, values, and support network. Rather than following trends, you weigh needs, space, and the people who will help you welcome the baby.",
    bullets: [
      "One-on-one conversations that spotlight what your lifestyle truly needs and what can be passed on.",
      "Registry sessions paced over weeks so you never feel like you are catching up.",
      "Gentle nudges toward practical combinations instead of a long list of “must-haves.”",
      "Regular check-ins that keep you aligned with your season, not a sales cycle.",
    ],
    why: "A grounded plan keeps overwhelm at bay and keeps your decisions anchored in what feels most right for your family.",
    image: {
      src: planPillar,
      alt: "Notebook and ribbon representing deliberate planning",
    },
  },
  {
    id: "connect",
    title: "Connect",
    thesis: "This is where you learn alongside humans who understand the same season.",
    paragraph:
      "Connection means a mentor who listens, a small circle that is moderated for calm, and a place where questions stay private. You are invited to share, listen, and gain reassurance without comparisons, performance, or extra noise.",
    bullets: [
      "Pairings with mentors who track how you are feeling and hold steady without rushing.",
      "Small, intentional gatherings where questions are encouraged and empathy is the tone.",
      "Quiet accountability that honors your timeline—no pressure to show up more than feels good.",
      "Stories from others who were right where you are, shared in a way that helps you see options, not obligations.",
    ],
    why: "Calm connection keeps you buoyed, helping you show up with curiosity instead of exhaustion.",
    image: {
      src: connectPillar,
      alt: "Soft conversation bubbles illustrating intentional connection",
    },
  },
  {
    id: "reflect",
    title: "Reflect",
    thesis: "Reflect turns attention inward so you can carry this season forward with intention.",
    paragraph:
      "It’s an invitation to journal, capture keepsakes, and pause—especially when life accelerates. Mentors keep you tethered to gratitude and meaning, reminding you that slowing down now protects the story you want to tell later.",
    bullets: [
      "Gentle prompts that surface how parenting is reshaping your identity and relationships.",
      "Digital keepsake spaces for notes, snapshots, and small details that you want to remember without pressure to be “perfect.”",
      "Scheduled check-ins that help you process milestones and the in-between moments that feel fleeting.",
      "Quiet encouragement to let go of perfection and honor what feels true today.",
    ],
    why: "Slowing down with intention reduces anxiety and keeps the meaning in focus instead of letting the season blur by.",
    image: {
      src: reflectPillar,
      alt: "Ribboned journal symbolizing reflection and keepsakes",
    },
  },
];

const lifeParagraphs = [
  "Every week blends quiet learning, mentor check-ins, and tiny validations so pacing feels personal instead of frantic.",
  "Our guides listen first, then offer context, inspiration, and practical next steps that respect your existing routines.",
];

const lifeBullets = [
  "Mentors keep the conversation private, paced, and free from pressure.",
  "Resources arrive as calm stories, not endless shopping lists.",
  "We meet you where you are, and we only move forward when you feel ready.",
];

const pillarTones: Record<string, string> = {
  learn: "bg-[var(--step-bg-ivory)]/80",
  plan: "bg-[var(--step-bg-blush)]/60",
  connect: "bg-[var(--step-bg-mauve)]/50",
  reflect: "bg-[var(--step-bg-ivory)]/70",
};

const pillarSpacing = "py-10 sm:py-12";

export default function ExperiencePage() {
  return (
    <main className="bg-[#fef9f6] text-[#1F1C1A]">
      <MarketingHero
        eyebrow="THE EXPERIENCE"
        headline="A calm, mentor-led path that feels designed for the family you already are."
        lead="Intentional guidance, quiet clarity, and thoughtful pacing make every step feel steady, personal, and confident."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "See how it works",
          href: "/how-it-works",
        }}
        imageSrc={experienceHero}
        imageAlt="Taylor-Made Baby Co. hero art"
        priority
      />

      <div
        className="h-52 w-full"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(254,249,246,0) 0%, rgba(254,249,246,0.8) 65%, rgba(254,249,246,1) 100%)",
        }}
      />

      <SectionDivider className="mx-auto max-w-6xl" />

      <section className="marketing-section space-y-12">
        {pillarHighlights.map((pillar, index) => {
          const textFirst = index % 2 === 0;
          return (
            <Fragment key={pillar.id}>
              <section
                className={`border-t border-[var(--tmbc-charcoal)]/10 first:border-t-0 ${pillarTones[pillar.id] ?? "bg-transparent"}`}
              >
                <div className={`mx-auto max-w-7xl px-6 ${pillarSpacing}`}>
                  <div className="grid gap-10 items-center lg:grid-cols-2">
                    <div className={`space-y-4 ${textFirst ? "lg:order-1" : "lg:order-2"}`}>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-mauveGray)]">
                        {pillar.title}
                      </p>
                      <h3 className="font-playfair text-[32px] leading-[1.2] text-neutral-900">
                        {pillar.title}
                      </h3>
                      <p className="text-[15px] leading-[1.65] text-neutral-600">{pillar.thesis}</p>
                      <p className="text-[15px] leading-[1.65] text-neutral-600">
                        {pillar.paragraph}
                      </p>
                      <ul className="space-y-3 text-[14px] leading-[1.7] text-neutral-600">
                        {pillar.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-[15px] leading-[1.6] text-neutral-600">{pillar.why}</p>
                    </div>
                    <div className={`flex justify-center ${textFirst ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-transparent bg-neutral-50 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
                        <div className="relative w-full" style={{ paddingTop: "75%" }}>
                          <Image
                            src={pillar.image.src}
                            alt={pillar.image.alt}
                            fill
                            sizes="(min-width: 1024px) 400px, 90vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {index < pillarHighlights.length - 1 && (
                <SectionDivider className="mx-auto max-w-6xl" />
              )}
            </Fragment>
          );
        })}
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-5 order-2 lg:order-1">
              <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-500">
                What life inside TMBC feels like
              </p>
              <h2 className="font-playfair text-[32px] sm:text-[36px] leading-[1.2] text-neutral-900">
                Calm companionship for every chapter you are writing.
              </h2>
              <div className="space-y-3 text-[15px] leading-[1.65] text-neutral-600">
                {lifeParagraphs.map((paragraph) => (
                  <p key={paragraph} className="m-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ul className="space-y-2 text-[14px] leading-[1.6] text-neutral-600">
                {lifeBullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative h-[420px] w-full overflow-hidden rounded-[32px] bg-neutral-50 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <Image
                  src={livingRoomSofa}
                  alt="Calm living room with soft light and textures"
                  fill
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider className="mx-auto max-w-6xl" />

      <section className="marketing-section marketing-section-wash marketing-section-lush">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-5">
          <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">Invite-only</p>
          <h2 className="font-playfair text-[32px] sm:text-[38px] leading-[1.2] text-neutral-900">
            When you are ready, the door stays open—quiet, calm, and attentive.
          </h2>
          <p className="text-[16px] leading-[1.65] text-neutral-600">
            We stay intentionally small so every mentor conversation is thoughtful, responsive, and paced exactly to you.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button href="/request-invite" variant="secondary">
              Request an Invite
            </Button>
            <p className="text-[12px] leading-[1.4] text-neutral-600">
              We thoughtfully review each request and respond within two business days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
