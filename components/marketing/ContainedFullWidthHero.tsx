import Image from "next/image";
import type { ReactNode } from "react";

interface ContainedFullWidthHeroProps {
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
  children: ReactNode;
}

export default function ContainedFullWidthHero({
  imageSrc,
  imageAlt,
  priority = false,
  children,
}: ContainedFullWidthHeroProps) {
  return (
    <section
      className="
        relative
        w-screen
        left-1/2 right-1/2
        -ml-[50vw] -mr-[50vw]
        bg-[#FBF7F4]
        min-h-[85vh] md:min-h-[72vh]
        mb-24 md:mb-28
        overflow-hidden
      "
    >
      <div className="relative w-full aspect-[3/2] min-h-[85vh] md:min-h-[72vh]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain"
          sizes="100vw"
          priority={priority}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6 py-20 sm:py-24 md:py-32">
          <div className="w-full max-w-[520px] md:max-w-[560px] text-center">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
