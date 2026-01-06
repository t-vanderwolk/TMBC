import type { ReactNode } from "react";

import HeroSection from "@/components/marketing/HeroSection";

type SectionBackground = "standard" | "learn";

type SectionHeaderProps = {
  backgroundImage: SectionBackground;
  lead: ReactNode;
  ctas?: ReactNode;
  imageAlt?: string;
};

const SectionHeader = ({ backgroundImage, lead, ctas, imageAlt }: SectionHeaderProps) => {
  return (
    <HeroSection
      backgroundImage={backgroundImage}
      lead={lead}
      ctas={ctas}
      imageAlt={imageAlt}
    />
  );
};

export default SectionHeader;
