'use client';

type SlideNavigationProps = {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  disableBack?: boolean;
  disableNext?: boolean;
};

export default function SlideNavigation({
  current,
  total,
  onBack,
  onNext,
  disableBack,
  disableNext,
}: SlideNavigationProps) {
  return (
    <div className="hidden md:flex items-center justify-between rounded-2xl border border-[rgba(199,166,199,0.5)] bg-[#F6EDF7]/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#3E2F35] shadow-[0_20px_45px_rgba(199,166,199,0.25)]">
      <button
        type="button"
        onClick={onBack}
        disabled={disableBack}
        className="rounded-full border border-transparent bg-white/80 px-4 py-2 text-[0.65rem] tracking-[0.4em] transition hover:shadow-[0_0_25px_rgba(212,181,121,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
      <span className="text-[0.65rem] text-[#8B6581]">
        Slide {Math.min(current + 1, total)} of {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className="rounded-full border border-transparent bg-[var(--tm-mauve)]/10 px-4 py-2 text-[0.65rem] tracking-[0.4em] text-[#3E2F35] transition hover:shadow-[0_0_25px_rgba(212,181,121,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
