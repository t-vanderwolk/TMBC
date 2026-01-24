import Image from "next/image";
import dividerRibbon from "@/assets/images/divider-ribbon-horizontal.png";
import learningFlow from "@/assets/images/section-background-learning-flow.png";

interface SectionDividerProps {
  variant?: "ribbon" | "flow";
  priority?: boolean;
}

export default function SectionDivider({ variant = "ribbon", priority = false }: SectionDividerProps) {
  const image = variant === "flow" ? learningFlow : dividerRibbon;
  const alt =
    variant === "flow"
      ? "Soft blush background indicating the learning flow"
      : "Blush ribbon divider";

  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={image}
        alt={alt}
        width={2400}
        height={400}
        className="w-full h-auto object-contain opacity-90"
        priority={priority}
      />
    </div>
  );
}
