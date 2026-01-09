type VisualPlaceholderProps = {
  label: string;
  assetPath?: string;
  page?: string;
  section?: string;
  className?: string;
  width?: number;
  height?: number;
  aspect?: "16/9" | "4/3" | "3/4" | "1/1" | "9/16" | string;
  priority?: "low" | "med" | "high";
};

const aspectClassMap: Record<string, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
};

const VisualPlaceholder = ({
  label,
  assetPath,
  page,
  section,
  className = "",
  width,
  height,
  aspect,
  priority,
}: VisualPlaceholderProps) => {
  const contextLabel = [page, section].filter(Boolean).join(" • ");
  const sizeLabel = width && height
    ? `${width}x${height}px`
    : aspect
      ? `Aspect: ${aspect}`
      : "Size: responsive";
  const aspectClassName = aspect ? aspectClassMap[aspect] ?? "" : "";
  const wrapperStyle = width && height
    ? { width: `${width}px`, height: `${height}px`, maxWidth: "100%" }
    : aspect && !aspectClassName
      ? { aspectRatio: aspect }
      : undefined;

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative mx-auto block w-full max-w-full overflow-hidden rounded-[20px] border border-[rgba(62,47,53,0.15)] bg-[var(--tmbc-ivory)]/85 text-[var(--tmbc-charcoal)] ${aspectClassName} ${className}`}
      style={{
        ...wrapperStyle,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center text-xs text-[var(--tmbc-charcoal)] text-opacity-70">
        <p className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{label}</p>
        {contextLabel && <p className="uppercase tracking-[0.3em]">{contextLabel}</p>}
        {assetPath && <p className="text-[0.7rem]">{assetPath}</p>}
        <p className="text-[0.7rem]">{sizeLabel}</p>
        {priority && <p className="text-[0.7rem] uppercase tracking-[0.3em]">{priority} priority</p>}
      </div>
    </div>
  );
};

export default VisualPlaceholder;
