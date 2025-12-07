'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import RecommendationPanel from '@/app/onboarding/components/RecommendationPanel';
import QuestionCard, { type Question } from '@/app/onboarding/components/QuestionCard';
import { useOnboardingStore } from '@/app/onboarding/state/useOnboardingStore';
import { saveOnboarding } from '@/lib/api/onboarding';
import { seedRegistryFromOnboarding } from '@/lib/api/registry';
import type { OnboardingAnswers } from '@/types/onboarding';

const questionFlow: Question[] = [
  {
    id: 'dueDate',
    group: 'Growing Family',
    heading: 'When is baby arriving?',
    subheading: 'Let us know your timeline so gear can arrive early.',
    options: [
      { label: 'Within 3 months', value: '0-3 months' },
      { label: 'Between 3 and 6 months', value: '3-6 months' },
      { label: 'More than 6 months out', value: '6+ months' },
    ],
  },
  {
    id: 'expecting',
    group: 'Growing Family',
    heading: 'How many little ones are on the way?',
    subheading: 'Singles, twins, and beyond all deserve deliberate gear.',
    options: [
      { label: 'Single baby', value: 'single' },
      { label: 'Twins', value: 'twins' },
      { label: 'More than two', value: 'multiples' },
    ],
  },
  {
    id: 'primaryHandler',
    group: 'Growing Family',
    heading: 'Who will be most often pushing the stroller?',
    subheading: 'Caregiver comfort is essential for every outing.',
    options: [
      { label: 'Parent (average height)', value: 'parent' },
      { label: 'Petite handler', value: 'petite' },
      { label: 'Grandparent', value: 'grandparent' },
      { label: 'Nanny or care partner', value: 'nanny' },
      { label: 'Self-identified for other needs', value: 'custom' },
    ],
  },
  {
    id: 'heightConsideration',
    group: 'Growing Family',
    heading: 'Any physical considerations we should honor?',
    subheading: 'Height, strength, and mobility shape your ideal picks.',
    options: [
      { label: 'Average reach and strength', value: 'average' },
      { label: 'Petite or petite-leaning', value: 'petite' },
      { label: 'Taller frame or longer reach', value: 'tall' },
      { label: 'Need easy lift / less strain', value: 'mobility' },
    ],
  },
  {
    id: 'floors',
    group: 'Home Layout',
    heading: 'How many floors does your home have?',
    subheading: 'Determine ambidextrous storage and transport needs.',
    options: [
      { label: 'Single-story', value: 'single_story' },
      { label: 'Two stories', value: 'two_story' },
      { label: 'Multi-level (three+)', value: 'multi_story' },
    ],
  },
  {
    id: 'stairs',
    group: 'Home Layout',
    heading: 'Do stairs factor into your daily rhythm?',
    subheading: 'We can help you choose lightweight bassinets and lifts.',
    options: [
      { label: 'Yes, regularly', value: 'yes' },
      { label: 'No, mostly single level', value: 'no' },
    ],
  },
  {
    id: 'entryway',
    group: 'Home Layout',
    heading: 'Tell us about your entryway.',
    subheading: 'Door widths and mudrooms influence stroller fits.',
    options: [
      { label: 'Wide foyer or mudroom', value: 'wide' },
      { label: 'Narrow hallway', value: 'narrow' },
      { label: 'Garage weight-bearing entry', value: 'garage' },
      { label: 'Elevator or lift access', value: 'elevator' },
    ],
  },
  {
    id: 'nurserySize',
    group: 'Home Layout',
    heading: 'How cozy is your nursery footprint?',
    subheading: 'Smaller spaces call for slim storage and modular gear.',
    options: [
      { label: 'Cozy + boutique-sized', value: 'cozy' },
      { label: 'Standard bedroom', value: 'standard' },
      { label: 'Loft or extra-large', value: 'loft' },
    ],
  },
  {
    id: 'flooring',
    group: 'Home Layout',
    heading: 'What kind of flooring runs through your home?',
    subheading: 'Carpet, hardwood, and tile call for different wheels.',
    options: [
      { label: 'Hardwood or tile', value: 'hardwood' },
      { label: 'Carpet or rugs', value: 'carpet' },
      { label: 'Mixed surfaces', value: 'mixed' },
      { label: 'Outdoor-ready patio', value: 'outdoor' },
    ],
  },
  {
    id: 'vehicleType',
    group: 'Transportation & Terrain',
    heading: 'Which vehicle will often carry your gear?',
    subheading: 'Trunk depth influences which stroller frames will fit.',
    options: [
      { label: 'Small sedan', value: 'small_sedan' },
      { label: 'SUV or crossover', value: 'suv' },
      { label: 'Minivan', value: 'minivan' },
      { label: 'Truck or AWD utility', value: 'truck' },
    ],
  },
  {
    id: 'parking',
    group: 'Transportation & Terrain',
    heading: 'Where do you typically park after arriving home?',
    subheading: 'Gateways matter when hauling strollers to doorsteps.',
    options: [
      { label: 'Garage', value: 'garage' },
      { label: 'Curbside or street', value: 'street' },
      { label: 'Valet or covered lot', value: 'valet' },
      { label: 'Carport or shared pad', value: 'carport' },
    ],
  },
  {
    id: 'terrain',
    group: 'Transportation & Terrain',
    heading: 'What terrain will your stroller tackle?',
    subheading: 'Select every surface you regularly roll across.',
    type: 'checkbox',
    options: [
      { label: 'Smooth pavement', value: 'smooth' },
      { label: 'Gravel or hard-packed dirt', value: 'gravel' },
      { label: 'Uneven dirt or park trails', value: 'uneven' },
      { label: 'Beach sand or soft grass', value: 'sand' },
      { label: 'Rough backcountry paths', value: 'rough' },
    ],
  },
  {
    id: 'travelFrequency',
    group: 'Transportation & Terrain',
    heading: 'How often does your family travel?',
    subheading: 'Include road trips, flights, and weekend getaways.',
    options: [
      { label: '1 trip or less per year', value: '0' },
      { label: '2-4 adventures per year', value: '2' },
      { label: '5+ travel moments per year', value: '5' },
    ],
  },
  {
    id: 'routine',
    group: 'Lifestyle',
    heading: 'What does your daily rhythm look like?',
    subheading: 'Urban errands, nature hikes, homebody days—we adapt.',
    options: [
      { label: 'City errands and cafés', value: 'city_runner' },
      { label: 'Outdoor adventures', value: 'outdoor' },
      { label: 'Homebody vibes', value: 'homebody' },
      { label: 'Balanced hybrid', value: 'hybrid' },
    ],
  },
  {
    id: 'pets',
    group: 'Lifestyle',
    heading: 'Do pets share your routine?',
    subheading: 'Fur and claws shape cleaning, storage, and stroller selection.',
    options: [
      { label: 'No pets', value: 'none' },
      { label: 'Dog(s)', value: 'dog' },
      { label: 'Cat(s)', value: 'cat' },
      { label: 'Other small pets', value: 'small_pet' },
    ],
  },
  {
    id: 'helpers',
    group: 'Lifestyle',
    heading: 'Will friends or family pitch in?',
    subheading: 'Extra hands signal the need for quick release systems.',
    options: [
      { label: 'No helpers', value: 'none' },
      { label: 'Grandparents', value: 'grandparents' },
      { label: 'Nanny', value: 'nanny' },
      { label: 'Occasional sitter', value: 'sitter' },
    ],
  },
  {
    id: 'gearStyle',
    group: 'Lifestyle',
    heading: 'Would you describe your gear preference as...',
    subheading: 'Minimal essentials or fully curated setups?',
    options: [
      { label: 'Minimal + curated', value: 'minimal' },
      { label: 'Balanced + ready-for-anything', value: 'balanced' },
      { label: 'Fully kitted and styled', value: 'maximalist' },
    ],
  },
];

export default function OnboardingPage() {
  const totalQuestions = questionFlow.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const { answers, recommendations, setAnswer, toggleTerrainOption } = useOnboardingStore();
  const router = useRouter();
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState('');

  const answeredCount = useMemo(() => {
    return questionFlow.reduce((count, question) => {
      const value = answers[question.id as keyof OnboardingAnswers];
      if (Array.isArray(value)) {
        return value.length ? count + 1 : count;
      }
      return value && value !== '' ? count + 1 : count;
    }, 0);
  }, [answers]);

  const currentQuestion = questionFlow[activeIndex];
  const currentValue = answers[currentQuestion.id as keyof OnboardingAnswers];
  const selectedValue = typeof currentValue === 'string' ? currentValue : undefined;
  const selectedValues = Array.isArray(currentValue) ? currentValue : [];

  const handleOptionSelect = (value: string) => {
    setAnswer(currentQuestion.id as keyof OnboardingAnswers, value);
  };

  const progress = ((activeIndex + 1) / totalQuestions) * 100;
  const isFirstQuestion = activeIndex === 0;
  const isLastQuestion = activeIndex === totalQuestions - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setActiveIndex((index) => Math.min(index + 1, totalQuestions - 1));
    }
  };

  const handleBack = () => {
    if (!isFirstQuestion) {
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
  };

  const handleFinish = async () => {
    setFinishError('');
    setFinishing(true);
    try {
      await saveOnboarding(answers as OnboardingAnswers);
      await seedRegistryFromOnboarding();
      router.push('/dashboard/plan');
    } catch (error: any) {
      setFinishError(
        error?.response?.data?.error ?? 'Unable to build your registry right now. Please try again.',
      );
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="font-nunito text-sm text-[#3E2F35]/70">Life + home details</p>
          <h2 className="font-serif text-2xl text-[#3E2F35]">Curate your wardrobe for baby gear.</h2>
        </div>
        <QuestionCard
          question={currentQuestion}
          progress={progress}
          currentStep={activeIndex + 1}
          totalSteps={totalQuestions}
          selectedValue={selectedValue}
          selectedValues={selectedValues}
          onSelect={handleOptionSelect}
          onToggle={toggleTerrainOption}
        />
        <div className="flex flex-col gap-3 text-sm font-nunito lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirstQuestion}
            className={`w-full rounded-xl border px-4 py-3 font-semibold text-[#3E2F35] transition hover:border-[#BFA9C1] lg:w-auto lg:px-6 lg:py-3 ${
              isFirstQuestion ? 'cursor-not-allowed border-[#D7C49E]/40 bg-[#FFF8F4]' : 'border-[#BFA9C1]/50 bg-[#EED9E8] hover:bg-[#BFA9C1]/80'
            }`}
          >
            Previous
          </button>
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[#3E2F35]/80">
              {answeredCount} / {totalQuestions} answered
            </span>
            {isLastQuestion ? (
              <button
                type="button"
                onClick={handleFinish}
                disabled={finishing}
                className={`w-full rounded-xl bg-[#EED9E8] px-6 py-3 font-semibold text-[#3E2F35] transition lg:w-auto ${
                  finishing ? 'cursor-wait opacity-70' : 'hover:bg-[#BFA9C1]/90'
                }`}
              >
                {finishing ? 'Building your registry…' : 'Finish & build my registry'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full rounded-xl bg-[#EED9E8] px-6 py-3 font-semibold text-[#3E2F35] transition hover:bg-[#BFA9C1]/90 lg:w-auto"
              >
                Next question
              </button>
            )}
          </div>
        </div>
        {finishError ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#D0465F]">
            {finishError}
          </p>
        ) : null}
      </section>
      <RecommendationPanel
        recommendations={recommendations}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
