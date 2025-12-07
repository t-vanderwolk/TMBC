'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { useOnboardingSummary } from '@/hooks/useOnboardingSummary';

const STEP_STYLES: Record<'active' | 'completed' | 'upcoming', string> = {
  active: 'bg-[#BFA9C1] text-[#FFF8F4] shadow-sm',
  completed: 'bg-[#D7C49E]/70 text-[#3E2F35]',
  upcoming: 'border border-[#BFA9C1]/40 bg-white text-[#3E2F35]/70',
};

type StepState = 'active' | 'completed' | 'upcoming';

const buildStepState = (state: StepState, label: string, description: string) => ({
  state,
  label,
  description,
});

const pillVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + custom * 0.1, duration: 0.35, ease: 'easeOut' },
  }),
};

export default function OnboardingRibbon() {
  const router = useRouter();
  const { status, suggestedCount, confirmedCount, seedRegistry, loading } = useOnboardingSummary();

  const stepOneState: StepState = status === 'not_started' ? 'active' : 'completed';
  const stepTwoState: StepState = status === 'not_started' ? 'upcoming' : suggestedCount === 0 ? 'active' : 'completed';
  const stepThreeState: StepState = confirmedCount > 0 ? 'active' : 'upcoming';

  const handleQuiz = useCallback(() => router.push('/onboarding'), [router]);
  const handleSeedAndNavigate = useCallback(async () => {
    await seedRegistry();
    router.push('/dashboard/plan');
  }, [router, seedRegistry]);
  const handleReview = useCallback(() => router.push('/dashboard/plan'), [router]);
  const handleMentor = useCallback(() => router.push('/dashboard/mentor'), [router]);

  const cta = useMemo(() => {
    if (status === 'not_started') {
      return { label: 'Complete lifestyle quiz', action: handleQuiz };
    }
    if (suggestedCount === 0) {
      return { label: 'Generate your registry', action: handleSeedAndNavigate };
    }
    if (suggestedCount > 0 && confirmedCount === 0) {
      return { label: 'Review your registry', action: handleReview };
    }
    return { label: 'Book a mentor session', action: handleMentor };
  }, [confirmedCount, handleMentor, handleQuiz, handleReview, handleSeedAndNavigate, suggestedCount, status]);

  const subtitle = useMemo(() => {
    if (status === 'not_started') {
      return 'Step 1 · Unlock your lifestyle quiz to receive tailored gear calls.';
    }
    if (suggestedCount === 0) {
      return 'Step 2 · Generate your Taylor-Made registry in real time.';
    }
    if (confirmedCount === 0) {
      return 'Registry ready · Review your curated suggestions before confirming.';
    }
    return 'Step 3 · Mentors await to help you steward your journey.';
  }, [status, suggestedCount, confirmedCount]);

  const steps = useMemo(
    () => [
      buildStepState(stepOneState, 'Quiz', 'Complete the lifestyle quiz'),
      buildStepState(stepTwoState, 'Registry', 'Generate registry recommendations'),
      buildStepState(stepThreeState, 'Mentor', 'Book a mentor session'),
    ],
    [stepOneState, stepThreeState, stepTwoState],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6 rounded-3xl border border-[#BFA9C1]/30 bg-[#FFF8F4] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-[var(--font-playfair)] text-xl md:text-2xl text-[#3E2F35] mb-1">
            Onboarding momentum
          </p>
          <p className="font-[var(--font-nunito)] text-sm md:text-base text-[#3E2F35]/70">
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={cta.action}
          disabled={loading}
          className={`rounded-xl bg-[#EED9E8] px-5 py-2 font-[var(--font-nunito)] text-sm font-semibold text-[#3E2F35] shadow-sm transition-all duration-200 ease-out hover:bg-[#BFA9C1] hover:text-[#FFF8F4] ${
            loading ? 'cursor-wait opacity-70' : 'transform hover:scale-[1.02]'
          }`}
        >
          {loading ? 'Working…' : cta.label}
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col gap-2">
            <motion.span
              className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-[var(--font-nunito)] font-semibold uppercase tracking-[0.3em] ${STEP_STYLES[step.state]}`}
              custom={index}
              variants={pillVariants}
              initial="hidden"
              animate="visible"
            >
              {index + 1}. {step.label}
            </motion.span>
            <p className="font-[var(--font-nunito)] text-[0.75rem] text-[#3E2F35]/70">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
