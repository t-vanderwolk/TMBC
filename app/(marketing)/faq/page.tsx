"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import { SectionBand, textCage, cardBase } from "@/components/marketing/MarketingCadence";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages


const faqGroups = [
  {
    title: "Getting started",
    summary: "Calm onboarding before you jump in.",
    items: [
      {
        question: "What is Taylor-Made Baby Co.?",
        answer: "An invite-only, mentor-led platform for preparing with clarity and calm.",
      },
      {
        question: "Is this an app or a service?",
        answer: "It’s both: digital guides supported by real mentors, so learning, planning, and reflecting happen in one quiet place.",
      },
      {
        question: "Who is TMBC for?",
        answer: "Parents who want calm structure, human insight, and intentional pacing.",
      },
    ],
  },
  {
    title: "Invite-only & membership",
    summary: "Capacity stays intentional.",
    items: [
      {
        question: "Why is TMBC invite-only?",
        answer: "We keep the circle small so mentors can protect quality, pacing, and thoughtful responses.",
      },
      {
        question: "How do I request an invite?",
        answer: "Submit a request on the site—every note is reviewed with care and the next steps arrive by email.",
      },
      {
        question: "Is there a waitlist?",
        answer: "Yes—some requests pause while we balance mentor availability, which keeps growth steady.",
      },
    ],
  },
  {
    title: "Mentors & support",
    summary: "People guide the path.",
    items: [
      {
        question: "Who are the mentors?",
        answer: "Experienced parents and professionals who’ve finished the Academy and support others with empathy.",
      },
      {
        question: "Will I be assigned a mentor?",
        answer: "Yes—matching is intentional, not automated, based on context and needs.",
      },
      {
        question: "Can members become mentors?",
        answer: "Yes. The Member → Mentor path lets thoughtful members guide others when they’re ready.",
      },
    ],
  },
  {
    title: "Learning, planning & registry",
    summary: "Clarity replaces frantic lists.",
    items: [
      {
        question: "What does “Learn” mean inside TMBC?",
        answer: "Calm, guided Academy modules meet you where you are without overwhelming everything at once.",
      },
      {
        question: "Does TMBC replace baby registries?",
        answer: "No—we help you plan intentionally, understand what matters, and build registries with context.",
      },
      {
        question: "Are you affiliated with specific brands?",
        answer: "Mentor-led advice stays context-first; recommendations never feel one-size-fits-all.",
      },
    ],
  },
  {
    title: "Privacy & pace",
    summary: "Everything moves at your rhythm.",
    items: [
      {
        question: "Is my information private?",
        answer: "Yes. Your entries and planning remain private unless you choose to share.",
      },
      {
        question: "Is there pressure to finish everything?",
        answer: "No. TMBC moves at your pace—no deadlines, only gentle next steps.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (question: string) => {
    setOpenItem((prev) => (prev === question ? null : question));
  };

  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      <MarketingHero
        eyebrow="FAQ"
        headline="Questions are part of the journey."
        lead="Calm mentor-led answers to orient you before requesting an invite."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        heroImage={HERO_IMAGE_REGISTRY.learningFlowHero}
      />
      <SectionBand bg="white">
        <div className="mx-auto max-w-3xl">
          <div className={cardBase("space-y-4 text-center")}>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">FAQ</p>
            <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-80">
              Calm answers that respect your timing and curiosity.
            </p>
            <p className="mt-4 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
              We read every message. Replies may take a moment—care feels better than speed.
            </p>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="ivory">
        <div className="space-y-12 mx-auto max-w-6xl px-6">
          {faqGroups.map((group) => (
          <article key={group.title} className={cardBase("space-y-6")}>
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              {group.title}
            </p>
              <MarketingHeading level="h2">{group.summary}</MarketingHeading>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[20px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/70 p-4"
                  >
                    <button
                      type="button"
                      className="w-full text-left text-sm font-semibold tracking-[0.02em] text-[var(--tmbc-charcoal)]"
                      onClick={() => handleToggle(item.question)}
                    >
                      {item.question}
                    </button>
                    {openItem === item.question && (
                      <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{item.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionBand>
      <SectionBand bg="blush">
      <div className="mx-auto max-w-3xl">
        <div className={cardBase("space-y-4 text-center text-[var(--tmbc-charcoal)]")}>
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Registry placeholder
          </p>
            <MarketingHeading level="h2" className="mt-3 text-[var(--tmbc-charcoal)]">
              TMBC uses MyRegistry for registry creation and fulfillment.
            </MarketingHeading>
            <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Integration will be available in a future update.
            </p>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="white">
      <div className="mx-auto max-w-3xl">
        <div className={cardBase("text-center")}>
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Still wondering if TMBC is right for you? You’re always welcome to learn more or reach out with a question.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </div>
        </div>
      </SectionBand>

    </>
  );
}
