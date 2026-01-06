import HeroSection from "@/components/marketing/HeroSection";

type SectionBackground = "standard" | "learn";

type SectionHeaderProps = {
  backgroundImage: SectionBackground;
  title: string;
  supporting: string;
  imageAlt?: string;
};

const SectionHeader = ({ backgroundImage, title, supporting, imageAlt }: SectionHeaderProps) => {
  return (
    <HeroSection
      backgroundImage={backgroundImage}
      title={title}
      supporting={supporting}
      imageAlt={imageAlt}
    />
  );
};

export default SectionHeader;
