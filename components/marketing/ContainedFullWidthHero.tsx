import Image from "next/image";
import type { ReactNode } from "react";

import { heroCopy, type HeroKey } from "./heroCopy";

export interface ContainedFullWidthHeroProps {
  imageSrc: string;
  imageAlt?: string;
  headline: string;
  supporting: string;
  mobileKey?: HeroKey;
  priority?: boolean;
  eyebrow?: ReactNode;
  headlineClassName?: string;
  supportingClassName?: string;
  children?: ReactNode;
}

export function ContainedFullWidthHero({
  imageSrc,
  imageAlt = "",
  headline,
  supporting,
  mobileKey,
  priority = false,
  eyebrow,
  headlineClassName = "hero-headline",
  supportingClassName = "hero-supporting",
  children,
}: ContainedFullWidthHeroProps) {
  const mobileCopy = mobileKey ? heroCopy[mobileKey]?.mobile : null;

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-28 md:mb-36">
      <div className="relative w-full min-h-[80vh] md:min-h-[72vh] aspect-[3/2]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          className="object-contain"
        />

        <div className="absolute inset-0 flex">
          <div className="marketing-body mx-auto w-full max-w-[560px] px-6 text-center flex min-h-full flex-col justify-center">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.6em] text-[var(--tmbc-charcoal)]">
                {eyebrow}
              </p>
            )}
            <h1 className={headlineClassName}>
              <span className="block md:hidden">
                {mobileCopy?.headline ?? headline}
              </span>
              <span className="hidden md:block">
                {headline}
              </span>
            </h1>
            <p className={supportingClassName}>
              <span className="block md:hidden">
                {mobileCopy?.supporting ?? supporting}
              </span>
              <span className="hidden md:block">
                {supporting}
              </span>
            </p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContainedFullWidthHero;
