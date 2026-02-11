"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useState } from "react";

type StepDetail = {
  id: string;
  eyebrow: string;
  title: string;
  image: StaticImageData;
  alt: string;
  copy: string[];
};

const steps: StepDetail[] = [
  {
    id: "step-1",
    eyebrow: "STEP 01",
    title: "Request Your Invite Window",
    image: require("@/assets/images/evelope.png"),
    alt: "invitation envelope illustration",
    copy: [
      "Share a few basic details so we can understand where you are in your journey and hold space for you intentionally — not automatically.",
      "Invite windows are limited so mentors can move at a human pace and give every family the care they deserve.",
    ],
  },
  {
    id: "step-2",
    eyebrow: "STEP 02",
    title: "Tell Us About You",
    image: require("@/assets/images/survey.png"),
    alt: "intake questionnaire illustration",
    copy: [
      "A short intake helps us understand your lifestyle, support system, and what kind of guidance would feel most helpful right now.",
      "A mentor reviews your responses personally — no auto-sorting, no assumptions.",
    ],
  },
  {
    id: "step-3",
    eyebrow: "STEP 03",
    title: "Meet Your Mentor",
    image: require("@/assets/images/match.png"),
    alt: "mentor matching illustration",
    copy: [
      "We match you with a mentor who’s been there and understands your season of life.",
      "This isn’t about expertise alone — it’s about fit, trust, and thoughtful guidance.",
    ],
  },
  {
    id: "step-4",
    eyebrow: "STEP 04",
    title: "Begin Your Taylor-Made Journey",
    image: require("@/assets/images/welcome.png"),
    alt: "guided journey illustration",
    copy: [
      "From there, planning unfolds calmly and collaboratively — one decision at a time.",
      "You’ll never be rushed, upsold, or pushed forward before you’re ready.",
    ],
  },
];

export default function ExperienceStepsAccordion() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded((current) => (current === id ? null : id));

  return (
    <div className="space-y-10">
      {steps.map((step, index) => {
        const isOpen = expanded === step.id;
        const textFirst = index % 2 === 0;
        return (
          <article key={step.id} className="experience-step card-base">
            <div className="grid gap-10 items-center lg:grid-cols-2">
              <div className={`space-y-6 ${textFirst ? "" : "lg:order-last text-right"}`}>
                <button
                  type="button"
                  className="step-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`${step.id}-content`}
                  onClick={() => toggle(step.id)}
                >
                  <span className="step-label">{step.eyebrow}</span>
                  <h4 className="step-title">{step.title}</h4>
                  <span className="step-chevron" aria-hidden="true">
                    ▾
                  </span>
                </button>
                <div
                  id={`${step.id}-content`}
                  className={`step-content ${isOpen ? "step-open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  {step.copy.map((sentence, idx) => (
                    <p key={`${step.id}-${idx}`}>{sentence}</p>
                  ))}
                </div>
              </div>
              <div className={`flex justify-center ${textFirst ? "" : "lg:order-first"}`}>
                <div className="relative aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-[rgba(62,47,53,0.08)] bg-white">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 92vw"
                    priority={false}
                    className="h-full w-full rounded-[32px] object-contain"
                  />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
