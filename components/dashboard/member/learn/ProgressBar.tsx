"use client";

type ProgressBarProps = {
  value: number;
  className?: string;
  fillClassName?: string;
};

function ProgressBar({
  value,
  className = "mt-3 h-1.5",
  fillClassName = "h-full rounded-full bg-gradient-to-r from-[#C49BBF] to-[#9F7BA0]",
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`overflow-hidden rounded-full bg-[#F3E9E4] ${className}`}>
      <div
        className={fillClassName}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export default ProgressBar;
export type { ProgressBarProps };
