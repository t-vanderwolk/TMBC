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
const displayedLogos = logos.slice(0, 6);

type PartnerLogoCarouselProps = {
  eyebrowText?: string;
};

const PartnerLogoCarousel = ({
  eyebrowText = "Proudly partnered with",
}: PartnerLogoCarouselProps) => {
  return (
    <section className="w-full bg-[var(--tmbc-ivory)]/80 py-20 md:py-32">
      <MarketingContainer className="flex flex-col items-center gap-6">
        {eyebrowText ? (
          <p className="text-center text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
            {eyebrowText}
          </p>
        ) : null}
        <div className="grid w-full grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-4">
          {displayedLogos.map((logo) => (
            <Image
              key={logo.src}
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-8 w-auto opacity-60 sm:h-10 lg:h-12"
              sizes="(min-width: 1024px) 96px, (min-width: 640px) 80px, 64px"
            />
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
};

export default PartnerLogoCarousel;
