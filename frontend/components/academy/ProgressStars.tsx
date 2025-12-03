'use client';

import { Star } from 'lucide-react';

type ProgressStarsProps = {
  completed?: boolean;
  inProgress?: boolean;
  label?: string;
  hideLabel?: boolean;
  size?: number;
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const ProgressStars = ({ completed, inProgress, label, hideLabel, size = 20 }: ProgressStarsProps) => {
  const fillWidth = clamp(completed ? 100 : inProgress ? 55 : 0);

  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em]" title={label}>
      <div className="relative h-[24px] w-[24px]">
        <Star className="absolute inset-0 text-[var(--tm-mauve)]" size={size} />
        <div
          className="absolute inset-0 overflow-hidden transition-all duration-300 ease-out"
          style={{ width: `${fillWidth}%` }}
        >
          <Star className="absolute inset-0 text-[var(--tm-gold)]" size={size} />
        </div>
        {completed && (
          <span className="absolute inset-0 tm-gold-sparkle bg-[radial-gradient(circle_at_center,_rgba(212,181,121,0.5),_rgba(212,181,121,0))]" />
        )}
      </div>
      {!hideLabel && label && (
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-charcoal)]/70">{label}</span>
      )}
    </div>
  );
};

export default ProgressStars;
