"use client";

import Image, { type StaticImageData } from "next/image";
import { Fragment, useState } from "react";
import conciergeIntakeIcon from "@/assets/logos/conciergeintakelogo.png";
import matchIcon from "@/assets/logos/matchicon.png";
import requestInviteIcon from "@/assets/logos/requestinviteicon.png";
import startExperienceIcon from "@/assets/logos/startexperienceicon.png";

type InviteStep = {
  icon: StaticImageData;
  alt: string;
  label: string;
  expansion: string[];
};

const inviteSteps: InviteStep[] = [
  {
    icon: requestInviteIcon,
    alt: "Request an invite",
    label: "Request Your Invite Window",
    expansion: [
      "Invite windows help us ensure every family receives thoughtful, unrushed support.",
      "Requests are reviewed by a real person — not an algorithm.",
    ],
  },
  {
    icon: conciergeIntakeIcon,
    alt: "Concierge intake",
    label: "Tell Us About You",
    expansion: [
      "A short intake gives your mentor context around your lifestyle, support system, and priorities.",
      "This helps us guide you with nuance — not assumptions.",
    ],
  },
  {
    icon: matchIcon,
    alt: "Mentor match",
    label: "Meet Your Mentor",
    expansion: [
      "We match you with someone who understands this season of life and knows how to guide calmly.",
      "Fit matters more than credentials alone.",
    ],
  },
  {
    icon: startExperienceIcon,
    alt: "Start experience",
    label: "Begin Your Taylor-Made Journey",
    expansion: [
      "Planning unfolds collaboratively — one thoughtful decision at a time.",
      "You’ll never be rushed or pushed ahead before you’re ready.",
    ],
  },
];

const iconWidthClass = (label: string) => {
  switch (label) {
    case "Request Your Invite Window":
      return "max-w-[58px] md:max-w-[66px]";
    case "Meet Your Mentor":
      return "max-w-[64px] md:max-w-[74px]";
    case "Begin Your Taylor-Made Journey":
      return "max-w-[56px] md:max-w-[66px]";
    default:
      return "max-w-[58px] md:max-w-[68px]";
  }
};

export default function InviteFlowSection() {
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setOpenSteps((current) => ({
      ...current,
      [stepKey]: !current[stepKey],
    }));
  };

  return (
    <section className="invite-flow-section relative py-16">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="mb-12 text-center text-3xl md:text-4xl font-serif">
          How the Taylor-Made experience begins
        </h2>
        <div className="invite-flow-inner rounded-[36px] bg-gradient-to-br from-[var(--tmbc-ivory)] via-[var(--tmbc-blush-soft)] to-[var(--tmbc-blush-soft)] px-6 py-10">
          <div className="flex flex-col gap-6 text-center md:flex-row md:items-start md:gap-0 md:text-center">
            {inviteSteps.map((step, index) => {
              const stepKey = `step-${index + 1}`;
              const contentId = `${stepKey}-content`;
              const isExpanded = Boolean(openSteps[stepKey]);

              return (
                <Fragment key={step.label}>
                  <div
                    className="experience-step step-card flex flex-col items-center gap-3 px-3 md:flex-1"
                    data-open={isExpanded}
                  >
                    <button
                      type="button"
                      className="step-trigger flex flex-col items-center justify-center gap-3 text-center w-full max-w-[240px]"
                      aria-expanded={isExpanded}
                      aria-controls={contentId}
                      onClick={() => toggleStep(stepKey)}
                    >
                      <div className="step-header">
                        <span className="text-[10px] tracking-[0.35em] uppercase text-[var(--tmbc-charcoal)]/60">
                          Step {index + 1}
                        </span>
                        <div className="flex items-end justify-center h-[76px] md:h-[88px] lg:scale-[0.92] lg:[transform-origin:center_bottom]">
                          <Image
                            src={step.icon}
                            alt={step.alt}
                            width={64}
                            height={64}
                            priority
                            unoptimized
                            style={{ width: "auto", height: "auto" }}
                            className={`mx-auto h-auto object-contain opacity-90 pointer-events-none ${iconWidthClass(
                              step.label
                            )}`}
                          />
                        </div>
                        <h4 className="step-title font-serif italic text-[0.95rem] leading-[1.4] tracking-[0.04em] text-[var(--tmbc-charcoal)]/90">
                          {step.label}
                        </h4>
                        <span className="step-state-label">{isExpanded ? "Collapse" : "Tap to expand"}</span>
                        <span className="step-chevron chevron" aria-hidden="true">
                          ▾
                        </span>
                      </div>
                    </button>
                    <div
                      id={contentId}
                      className={`step-content text-[0.85rem] text-[var(--tmbc-charcoal)]/85 ${
                        isExpanded ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                      aria-hidden={!isExpanded}
                    >
                      {step.expansion.map((paragraph, paragraphIndex) => (
                        <p key={`${stepKey}-para-${paragraphIndex}`}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  {index < inviteSteps.length - 1 && (
                    <div className="hidden md:flex step-arrow-column md:px-4">
                      <span
                        className="invite-step-arrow text-[28px] leading-none text-[var(--tmbc-charcoal)]/30"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
