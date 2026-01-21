"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";

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
      <MarketingHero
        imageSrc="/images/marketing/home-hero.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Questions are part of the journey."
        subheading="Calm mentor-led answers to orient you before requesting an invite."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        priority
        motion
      />
      <MarketingContent>
        <div className="marketing-content space-y-16 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card mx-auto max-w-3xl rounded-[36px] bg-[var(--tmbc-ivory)]/90 px-8 py-20 text-center shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">FAQ</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
              Questions we anticipate.
            </h1>
            <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-80">
              Calm answers that respect your timing and curiosity.
            </p>
          </section>

          <section className="space-y-12">
            {faqGroups.map((group) => (
              <article
                key={group.title}
                className="marketing-card mx-auto max-w-3xl space-y-6 rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 px-8 py-10 shadow-[0_25px_80px_rgba(199,166,199,0.2)]"
              >
                <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                  {group.title}
                </p>
                <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">{group.summary}</h2>
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
          </section>


          <section className="marketing-section marketing-card mx-auto max-w-3xl rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 py-16 text-center shadow-[0_25px_70px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Registry placeholder
            </p>
            <h2 className="mt-3 font-serif text-2xl text-[var(--tmbc-charcoal)]">
              TMBC uses MyRegistry for registry creation and fulfillment.
            </h2>
            <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Integration will be available in a future update.
            </p>
          </section>

          <section className="marketing-section marketing-card mx-auto max-w-3xl rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 py-16 text-center shadow-[0_25px_70px_rgba(199,166,199,0.25)]">
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Still wondering if TMBC is right for you? You’re always welcome to learn more or reach out with a question.
            </p>
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
