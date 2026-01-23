import Image, { type StaticImageData } from "next/image";

type PillarVariant = "learn" | "plan" | "connect" | "reflect";

const variantStyles: Record<
  PillarVariant,
  { bg: string; rotate: string; imageHover?: string }
> = {
  learn: {
    bg: "bg-[rgba(255,248,244,0.85)]",
    rotate: "-rotate-[0.35deg]",
    imageHover: "group-hover:scale-[1.02]",
  },
  plan: {
    bg: "bg-[rgba(255,241,243,0.9)]",
    rotate: "rotate-[0.25deg]",
    imageHover: "group-hover:scale-[1.02]",
  },
  connect: {
    bg: "bg-[rgba(255,247,245,0.9)]",
    rotate: "rotate-[0.15deg]",
    imageHover: "group-hover:scale-[1.03]",
  },
  reflect: {
    bg: "bg-[rgba(252,249,247,0.9)]",
    rotate: "-rotate-[0.15deg]",
    imageHover: "group-hover:scale-[1.01]",
  },
};

type PillarImagePacemakerProps = {
  src: StaticImageData | string;
  alt: string;
  variant: PillarVariant;
};

export default function PillarImagePacemaker({ src, alt, variant }: PillarImagePacemakerProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`pillar-pacemaker relative overflow-hidden rounded-[26px] border border-black/5 shadow-[0_18px_50px_-30px_rgba(17,12,46,0.25)] transition-transform duration-500 ${styles.bg} ${styles.rotate} group-hover:-translate-y-[2px] group-hover:shadow-[0_26px_70px_-36px_rgba(17,12,46,0.35)] animate-pillarFloat motion-reduce:transform-none motion-reduce:shadow-none`}
    >
      <div className="relative m-4 aspect-[5/6] overflow-hidden rounded-2xl bg-white/70">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, 90vw"
          className={`object-contain transition-transform duration-700 ease-out motion-reduce:transform-none ${styles.imageHover}`}
        />
      </div>
    </div>
  );
}
