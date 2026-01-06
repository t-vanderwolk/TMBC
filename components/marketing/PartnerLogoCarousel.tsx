"use client";

import Image, { type StaticImageData } from "next/image";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

type WebpackRequire = {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => {
    keys: () => string[];
    <T>(id: string): T;
  };
};

declare const require: WebpackRequire;

const logoContext = require.context(
  "../../assets/logos",
  false,
  /\.(png|jpe?g|svg)$/
);

const logos = logoContext.keys().map((key) => {
  const mod = logoContext<StaticImageData | { default: StaticImageData }>(key);
  return "default" in mod ? mod.default : mod;
});

type PartnerLogoCarouselProps = {
  eyebrowText?: string;
};

const PartnerLogoCarousel = ({
  eyebrowText = "Proudly partnered with",
}: PartnerLogoCarouselProps) => {
  const loopedLogos = [...logos, ...logos];

  return (
    <section className="w-full bg-[var(--tmbc-ivory)]/80 py-10 sm:py-14 lg:py-[4.5rem]">
      <MarketingContainer className="flex flex-col items-center gap-6">
        {eyebrowText ? (
          <p className="text-center text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
            {eyebrowText}
          </p>
        ) : null}
        <div className="w-full overflow-x-auto sm:overflow-hidden [-webkit-overflow-scrolling:touch]">
          <div className="partner-logo-marquee flex w-max items-center gap-10 sm:gap-12 lg:gap-16 motion-reduce:animate-none">
            {loopedLogos.map((logo, index) => (
              <Image
                key={`${logo.src}-${index}`}
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-8 w-auto opacity-70 transition-opacity duration-300 sm:h-10 lg:h-12 lg:hover:opacity-100"
                sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 64px"
              />
            ))}
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
};

export default PartnerLogoCarousel;
