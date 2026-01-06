import Image from "next/image";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import learnPreview from "../../assets/images/learn1.png";
import planPreview from "../../assets/images/plan1.png";
import connectPreview from "../../assets/images/connect1.png";
import reflectPreview from "../../assets/images/reflect1.png";

const journeySteps = [
  {
    label: "LEARN",
    supporting:
      "Clear, mentor-led guidance that keeps education steady, useful, and in the right sequence.",
    src: learnPreview,
    alt: "Preview of the TMBC learning guides and classes.",
  },
  {
    label: "PLAN",
    supporting: "A shared workspace for calm decisions, steady pacing, and mentor context.",
    src: planPreview,
    alt: "Preview of the TMBC registry builder and planning workspace.",
  },
  {
    label: "CONNECT",
    supporting: "Mentor-led connection that stays steady, kind, and centered on shared understanding.",
    src: connectPreview,
    alt: "Preview of the TMBC community rooms and mentor connection space.",
  },
  {
    label: "REFLECT",
    supporting: "A private, gentle space to capture memories, reassurance, and the story you want to keep.",
    src: reflectPreview,
    alt: "Preview of the TMBC baby book and reflection journal.",
  },
];

const AppJourneySection = () => {
  return (
    <section className="w-full">
      <MarketingContainer>
        <div className="mx-auto flex w-full max-w-5xl flex-col">
          {journeySteps.map((step) => (
            <div key={step.label} className="mt-16 text-center sm:mt-24">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] text-opacity-60">
                {step.label}
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 sm:text-base">
                {step.supporting}
              </p>
              <div className="mx-auto mt-8 w-full max-w-md lg:max-w-lg">
                <Image
                  src={step.src}
                  alt={step.alt}
                  className="h-auto w-full object-contain"
                  sizes="(min-width: 1024px) 512px, (min-width: 640px) 448px, 100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
};

export default AppJourneySection;
