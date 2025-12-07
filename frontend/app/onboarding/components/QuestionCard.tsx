'use client';

type QuestionOption = {
  label: string;
  value: string;
  helper?: string;
};

export type Question = {
  id: string;
  group: string;
  heading: string;
  subheading: string;
  type?: 'single' | 'checkbox';
  options: QuestionOption[];
};

export type QuestionCardProps = {
  question: Question;
  progress: number;
  currentStep: number;
  totalSteps: number;
  selectedValue?: string;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  onToggle?: (value: string) => void;
};

export default function QuestionCard({
  question,
  progress,
  currentStep,
  totalSteps,
  selectedValue,
  selectedValues = [],
  onSelect,
  onToggle,
}: QuestionCardProps) {
  const isCheckbox = question.type === 'checkbox';

  const renderOptionLabel = (option: QuestionOption) => (
    <>
      <span className="font-nunito text-base font-semibold text-[#3E2F35]">{option.label}</span>
      {option.helper ? (
        <p className="mt-1 text-sm font-nunito text-[#3E2F35]/70">{option.helper}</p>
      ) : null}
    </>
  );

  return (
    <article className="w-full rounded-[32px] border border-[#D7C49E]/30 bg-[#FFF8F4] p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
        <span>{question.group}</span>
        <span>
          Question {currentStep} / {totalSteps}
        </span>
      </div>
      <div className="mb-4 h-1.5 rounded-full bg-[#EED9E8]">
        <div
          className="h-1.5 rounded-full bg-[#BFA9C1] transition-[width]"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <h2 className="font-script text-4xl text-[#BFA9C1] leading-tight">
        {question.heading}
      </h2>
      <p className="mt-2 font-serif text-xl text-[#3E2F35]">{question.subheading}</p>
      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isActive = isCheckbox
            ? selectedValues.includes(option.value)
            : selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isCheckbox) {
                  onToggle?.(option.value);
                  return;
                }
                onSelect(option.value);
              }}
              className={`group flex w-full flex-col items-start justify-center rounded-xl border px-4 py-3 font-nunito text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA9C1] ${
                isActive
                  ? 'border-[#BFA9C1] bg-[#BFA9C1] text-white shadow-[0_20px_60px_rgba(197,169,193,0.35)]'
                  : 'border-transparent bg-[#EED9E8] text-[#3E2F35] hover:bg-[#BFA9C1]/80'
              }`}
              aria-pressed={isActive}
            >
              {renderOptionLabel(option)}
            </button>
          );
        })}
      </div>
    </article>
  );
}
