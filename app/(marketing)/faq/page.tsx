"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";

const faqGroups = [
  {
    title: "Getting started",
    summary: "How the experience begins with calm guidance.",
    items: [
      {
        question: "What is Taylor-Made Baby Co.?",
        answer:
          "Taylor-Made Baby Co. is an invite-only, mentor-led platform that helps you prepare for pregnancy and early parenthood with clarity and calm. We focus on learning what matters, planning intentionally, connecting with support, and reflecting along the way.",
      },
      {
        question: "Is this an app or a service?",
        answer:
          "It’s both — thoughtfully combined. TMBC is a digital experience supported by real human mentors. You’ll learn through guided modules, plan with support, connect with others, and reflect privately — all in one place.",
      },
      {
        question: "Who is TMBC for?",
        answer:
          "TMBC is for parents who want guidance without overwhelm. If you value calm structure, human insight, and intentional pacing, you’ll likely feel at home here.",
      },
    ],
  },
  {
    title: "Invite-only & membership",
    summary: "Intentional capacity and thoughtful review keep quality high.",
    items: [
      {
        question: "Why is TMBC invite-only?",
        answer:
          "Because the experience is mentor-led and intentionally small. Invite-only allows us to protect quality, pacing, and human support — for both members and mentors.",
      },
      {
        question: "How do I request an invite?",
        answer:
          "You can request an invite directly from the site. Every request is reviewed with care. If accepted, you’ll receive next steps by email.",
      },
      {
        question: "Is there a waitlist?",
        answer:
          "Yes. Some requests are placed on a waitlist depending on mentor availability and cohort timing. Being on the waitlist simply means we’re growing thoughtfully.",
      },
    ],
  },
  {
    title: "Mentors & support",
    summary: "Real people guide the journey with empathy.",
    items: [
      {
        question: "Who are the mentors?",
        answer:
          "Mentors are experienced parents, professionals, and guides who have completed the Taylor-Made Baby Academy and support others with empathy, knowledge, and lived experience.",
      },
      {
        question: "Will I be assigned a mentor?",
        answer:
          "Yes. Members are thoughtfully matched to a mentor based on context, needs, and availability. This is not automated — it’s intentional.",
      },
      {
        question: "Can members become mentors?",
        answer:
          "Yes. TMBC follows a Member → Mentor model. Some members choose to continue their journey by guiding others once they’re ready.",
      },
    ],
  },
  {
    title: "Learning, planning & registry",
    summary: "Calm clarity replaces frantic lists.",
    items: [
      {
        question: "What does “Learn” mean inside TMBC?",
        answer:
          "Learning happens through calm, guided Academy modules — designed to meet you where you are, not overwhelm you with everything at once.",
      },
      {
        question: "Does TMBC replace baby registries?",
        answer:
          "No. TMBC supports registries — it doesn’t replace them. We help you plan intentionally, understand what matters, and build registries with context and guidance.",
      },
      {
        question: "Are you affiliated with specific brands?",
        answer:
          "We work with select partners, but guidance is mentor-led and context-first. Recommendations are never one-size-fits-all.",
      },
    ],
  },
  {
    title: "Privacy & pace",
    summary: "Everything moves at your rhythm.",
    items: [
      {
        question: "Is my information private?",
        answer:
          "Yes. Your experience, reflections, and planning details are private by default. Sharing is always optional and intentional.",
      },
      {
        question: "Is there pressure to keep up or finish everything?",
        answer:
          "No. TMBC is designed to move at your pace. There are no deadlines — only gentle next steps.",
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
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="Questions are part of the journey."
        supportingText="These answers were written with calm, mentor-led context so you can orient yourself before requesting an invite."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        priority
      />
      <MarketingContent>
        <div className="marketing-content space-y-16 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card mx-auto max-w-3xl rounded-[36px] bg-[var(--tmbc-ivory)]/90 px-8 py-20 text-center shadow-[0_25px_90px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">FAQ</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
              We anticipated your questions.
            </h1>
            <p className="marketing-subtitle mt-4 mb-6 text-base text-[var(--tmbc-charcoal)] text-opacity-80">
              Here are the common curiosities we hear — answered simply, calmly, and honestly.
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
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Still wondering if TMBC is right for you? You’re always welcome to learn more or reach out with a question.
            </p>
            <Link
              href="/request-invite"
              className="mt-6 inline-flex rounded-[28px] border border-[var(--tmbc-charcoal)] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]"
            >
              Request an Invite
            </Link>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
