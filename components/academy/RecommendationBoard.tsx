'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

type RecommendationBoardProps = {
  moduleId: string;
};

const RecommendationBoard = ({ moduleId }: RecommendationBoardProps) => {
  const registryHref = moduleId ? `/dashboard/plan` : '/dashboard/plan';

  return (
    <section className="tm-editorial-card tm-paper-texture space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="h-5 w-5 text-[var(--tm-gold)]" />
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Mentor-led board</p>
          <h2 className="tm-serif-title text-3xl">Registry notes</h2>
        </div>
      </div>
      <div className="rounded-[28px] border border-[var(--tm-blush)] bg-white/85 p-5 text-sm text-[var(--tm-charcoal)]/75">
        <p className="text-base font-semibold text-[var(--tm-deep-mauve)]">
          Suggested by your mentor
        </p>
        <p className="mt-2">
          Your mentor reviewed your onboarding answers. This space stays quiet until you or your mentor adds items.
        </p>
      </div>
      <Link
        href={registryHref}
        className="inline-flex items-center rounded-full border border-[var(--tm-deep-mauve)] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]"
      >
        Go to registry
      </Link>
    </section>
  );
};

export default RecommendationBoard;
