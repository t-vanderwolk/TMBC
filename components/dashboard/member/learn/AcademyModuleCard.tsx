'use client';

import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';

import JourneyBadge from './JourneyBadge';
import ModuleMetaRow from './ModuleMetaRow';
import ProgressBar from './ProgressBar';

type AcademyModuleCardProps = {
  href: string;
  title: string;
  description?: string;
  journey?: string;
  estimatedMinutes?: number | null;
  stage?: string;
  progress?: number | null;
  completed?: boolean;
  statusLabel?: string;
  className?: string;
};

function AcademyModuleCard({
  href,
  title,
  description,
  journey,
  estimatedMinutes,
  stage,
  progress,
  completed,
  statusLabel,
  className = '',
}: AcademyModuleCardProps) {
  const currentProgress =
    typeof progress === 'number' ? Math.min(100, Math.max(0, progress)) : 0;
  const isComplete = completed || currentProgress >= 100;
  const hasProgress = !isComplete && currentProgress > 0;
  const ctaLabel = isComplete
    ? 'Completed'
    : hasProgress
    ? 'Continue'
    : 'Start module';
  return (
    <Link href={href} className={`block ${className}`}>
      <article
        className={`flex h-full flex-col gap-4 rounded-[30px] border bg-[#FEFAF6] p-5 shadow-[0_25px_50px_rgba(145,116,125,0.15)] transition hover:-translate-y-0.5 hover:border-[#D6B8C8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A4556A] ${
          isComplete ? 'border-[#D8D0D0] bg-[#F4F0EE] opacity-90' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <JourneyBadge journey={journey} />
          {isComplete ? (
            <span className="flex items-center gap-1 rounded-full border border-[#D6B8C8] px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">
              <Check className="h-3 w-3 text-[#A4556A]" />
              Completed
            </span>
          ) : (
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
              {statusLabel ?? (hasProgress ? 'In progress' : 'Ready when you’re ready')}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-serif leading-snug text-[#3E2F35]">{title}</h3>
          {description && (
            <p className="text-sm text-[#3E2F35]/70">{description}</p>
          )}
        </div>
        <ModuleMetaRow stage={stage} estimatedMinutes={estimatedMinutes} />
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.4em] transition ${
              isComplete
                ? 'border-[#D6B8C8] text-[#A4556A]'
                : 'border-[#A4556A] text-[#A4556A]'
            }`}
          >
            {ctaLabel}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[#A4556A]" />
        </div>
        {hasProgress && <ProgressBar value={currentProgress} />}
      </article>
    </Link>
  );
}

export default AcademyModuleCard;
export type { AcademyModuleCardProps };
