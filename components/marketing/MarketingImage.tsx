import type { StaticImageData } from "next/image";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

type MarketingImageVariant =
  | "hero-ui"
  | "hero-editorial"
  | "editorial"
  | "divider"
  | "thumbnail"
  | "diagram";

type MarketingImageProps = {
  src?: StaticImageData | string;
  alt?: string;
  label?: string;
  description?: string;
  page?: string;
  section?: string;
  assetPath?: string;
  assetPriority?: "low" | "med" | "high";
  variant: MarketingImageVariant;
  aspectRatio: string;
  maxWidth: number;
  priority?: boolean;
  lazy?: boolean;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
};

// This component enforces TMBC’s visual restraint rules. Do not add images outside this system.
const MarketingImage = ({
  src,
  alt,
  label,
  description,
  page,
  section,
  assetPath,
  assetPriority,
  variant,
  aspectRatio,
  maxWidth,
  priority = false,
  className = "",
  containerClassName = "",
}: MarketingImageProps) => {
  const wrapperStyle = {
    maxWidth: `${maxWidth}px`,
  };
  const resolvedLabel =
    label ?? alt ?? description ?? `${variant} marketing image placeholder`;
  const resolvedAssetPath =
    assetPath ??
    (typeof src === "string" ? src : src ? "TBD" : "TBD");
  const resolvedPriority = assetPriority ?? (priority ? "high" : undefined);

  return (
    <div className={`relative w-full overflow-hidden ${containerClassName}`}>
      <div className="flex w-full justify-center">
        <div
          className={`relative w-full ${className}`}
          style={wrapperStyle}
        >
          <VisualPlaceholder
            label={resolvedLabel}
            page={page}
            section={section}
            assetPath={resolvedAssetPath}
            priority={resolvedPriority}
            aspect={aspectRatio}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketingImage;
