"use client";

type JourneyHeaderProps = {
  title: string;
  emotion: string;
  className?: string;
};

export default function JourneyHeader({ title, emotion, className = "" }: JourneyHeaderProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">{title}</p>
      <p className="text-sm text-[#3E2F35]/70">{emotion}</p>
    </div>
  );
}
