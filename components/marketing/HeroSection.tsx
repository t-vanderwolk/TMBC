import type { ReactNode } from "react";

import heroPrimary from "../../assets/images/hero-marketing-signature.png";
import heroFoundingCircle from "../../assets/images/hero-founding-circle.png";
import heroStandard from "../../assets/images/section-background-soft-ribbon.png";
import heroLearn from "../../assets/images/section-background-learning-flow.png";

type HeroBackground = "primary" | "foundingCircle" | "standard" | "learn";

type HeroSectionProps = {
  backgroundImage: HeroBackground;
  lead: ReactNode;
  ctas?: ReactNode;
  imageAlt?: string;
};

const heroBackgroundMap: Record<HeroBackground, { src: string }> = {
  primary: heroPrimary,
  foundingCircle: heroFoundingCircle,
  standard: heroStandard,
  learn: heroLearn,
};

const HeroSection = ({ backgroundImage, lead, ctas }: HeroSectionProps) => {
  const heroAsset = heroBackgroundMap[backgroundImage];
  return (
    <section className="relative w-screen overflow-hidden left-1/2 right-1/2 -translate-x-1/2">
      <div className="grid w-full">
        <img
          src={heroAsset.src}
          alt=""
          aria-hidden="true"
          className="col-start-1 row-start-1 block w-full h-full max-w-full object-contain"
        />
        <div className="col-start-1 row-start-1 flex w-full items-center justify-center">
          <div
            className="w-full max-w-[42rem] px-6 py-16 text-center text-[var(--tmbc-charcoal)] sm:px-0 sm:py-20 md:py-28"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
          >
            {lead}
            {ctas && <div className="hero-cta mt-8 flex flex-wrap justify-center sm:mt-10">{ctas}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
