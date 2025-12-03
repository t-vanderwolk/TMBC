'use client';

type ModuleProgressRingProps = {
  percent: number;
};

export default function ModuleProgressRing({ percent }: ModuleProgressRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="tm-fade-in">
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke="#E9DFF4"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="48"
        cy="48"
        r={radius}
        stroke="var(--tm-mauve)"
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
