"use client";

import Image from "next/image";
import { useState } from "react";

import { SectionBand, cardBase } from "@/components/marketing/MarketingCadence";
import { MarketingHeading } from "@/components/marketing/Typography";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";

const pillarHighlights = [
  {
    title: "Learn",
    microHook: "without brand bias",
    summary: "What baby gear actually does — and why it matters.",
    description:
      "Understand what you’re being told to buy — and why.\n\nLearn what baby gear actually does, when it’s typically used, and what truly matters for your life.\nNo pressure. No brand bias. Just calm, clear explanations so you can make confident choices.",
    image: learnPillar,
    alt: "Illustrated open book with soft colors representing careful learning",
  },
  {
    title: "Plan",
    microHook: "skip what you don’t need",
    summary: "Figure out what you need. Skip what you don’t.",
    description:
      "Build your registry with intention — not panic.\n\nPlan as you learn, alongside a trusted mentor who’s been exactly where you are.\nDecide what you need now, what can wait, what to skip entirely — and what actually fits your home, lifestyle, and values.",
    image: planPillar,
    alt: "Notebook and ribbon representing deliberate planning",
  },
  {
    title: "Connect",
    microHook: "real parents, real mentors",
    summary: "You’re not meant to do this alone.",
    description:
      "You’re not the only one asking these questions.\n\nConnect with other parents in the same season and mentors who guide the conversation.\nShare questions, trade perspective, and get clarity — without the chaos of crowdsourced advice.",
    image: connectPillar,
    alt: "Soft conversation bubbles illustrating intentional connection",
  },
  {
    title: "Reflect",
    microHook: "your future baby book",
    summary: "A record of this season, saved for later.",
    description:
      "Turn this season into a keepsake you’ll treasure later.\n\nReflect as you prepare and create a virtual baby book along the way.\nCapture what you learned, the choices you made, and how you felt — so one day, you can look back on this season with clarity and care.",
    image: reflectPillar,
    alt: "Ribboned journal symbolizing reflection and keepsakes",
  },
];

const pillarBackgrounds: Record<string, string> = {
  Learn: "#faf7f5",
  Plan: "#f6e9e6",
  Connect: "var(--tmbc-blush-soft)",
  Reflect: "#f6eef2",
};

const pillarShadow = "shadow-[0_8px_24px_rgba(0,0,0,0.05)]";

export default function PillarHighlightsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpanded = (title: string) => setExpanded((current) => (current === title ? null : title));

  return (
    <SectionBand bg="white" className="py-16 md:py-24 lg:py-28 bg-[#f6f3eb]">
      <div className="mx-auto w-full max-w-6xl px-6 space-y-10">
        <h2 className="text-center font-serif text-4xl mb-0 max-w-4xl mx-auto text-[var(--tmbc-charcoal)]">
          Pillars That<br />
          Shape the<br />
          Experience
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {pillarHighlights.map((pillar) => {
            const isExpanded = expanded === pillar.title;
            return (
              <article
                key={pillar.title}
                className={cardBase(
                  `${pillarShadow} flex flex-col overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]`
                )}
                style={{ backgroundColor: pillarBackgrounds[pillar.title] ?? "#ffffff" }}
              >
                <button
                  type="button"
                  onClick={() => toggleExpanded(pillar.title)}
                  aria-expanded={isExpanded}
                  className="flex w-full flex-col items-stretch text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tmbc-blush)] focus-visible:outline-offset-2 focus-visible:outline-opacity-60"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={pillar.image}
                      alt={pillar.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 90vw"
                      className="object-cover scale-110"
                      priority={pillar.title === "Learn"}
                    />
                  </div>
                  <div className="space-y-3 px-6 py-6 text-[var(--tmbc-charcoal)]">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                        {pillar.title}
                      </p>
                      {pillar.microHook && <span className="micro-hook">({pillar.microHook})</span>}
                    </div>
                    <MarketingHeading level="h3">{pillar.summary}</MarketingHeading>
                    <div
                      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                        isExpanded ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-3 text-sm leading-[1.6] text-[var(--tmbc-charcoal)] text-opacity-80 max-w-[280px]">
                        {pillar.description.split("\n\n").map((paragraph, index) => (
                          <p key={`${pillar.title}-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] tracking-[0.25em] text-[var(--tmbc-charcoal)]/50">
                      {isExpanded ? "Collapse ▴" : "Tap to expand ▾"}
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </SectionBand>
  );
}
