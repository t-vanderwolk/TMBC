import type { ReactNode } from "react";

import heroPrimary from "../../assets/images/hero-marketing-signature.png";
import heroFoundingCircle from "../../assets/images/hero-founding-circle.png";
import heroStandard from "../../assets/images/section-background-soft-ribbon.png";
import heroLearn from "../../assets/images/section-background-learning-flow.png";

type HeroBackground = "primary" | "foundingCircle" | "standard" | "learn";

type HeroSectionProps = {
  backgroundImage: HeroBackground;
  title: ReactNode;
  supporting: ReactNode;
  imageAlt?: string;
};

const heroBackgroundMap: Record<HeroBackground, { src: string }> = {
  primary: heroPrimary,
  foundingCircle: heroFoundingCircle,
  standard: heroStandard,
  learn: heroLearn,
};

const HeroSection = ({ backgroundImage, title, supporting }: HeroSectionProps) => {
  const heroAsset = heroBackgroundMap[backgroundImage];
  return (
    <section className="relative w-screen overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="absolute inset-0 z-0">
        <img
          src={heroAsset.src}
          alt=""
          aria-hidden="true"
          className="block w-full h-auto object-contain saturate-90 contrast-90 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/35 to-white/55" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-6 text-center text-[var(--tmbc-charcoal)] sm:px-8">
        <h1 className="mb-4 font-serif text-[clamp(1.7rem,5vw,3rem)] leading-[1.25] text-[var(--tmbc-charcoal)]">
          {title}
        </h1>
        <p className="text-[clamp(1rem,3.5vw,1.15rem)] leading-[1.55] text-[var(--tmbc-charcoal)] text-opacity-70">
          {supporting}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
