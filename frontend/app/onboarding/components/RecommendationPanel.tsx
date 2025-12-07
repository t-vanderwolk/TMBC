'use client';

import { Recommendations } from '@/lib/recommendations';

type RecommendationPanelProps = {
  recommendations: Recommendations;
  answeredCount: number;
  totalQuestions: number;
};

const renderList = (items: string[]) =>
  items.length ? (
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm font-nunito text-[#3E2F35]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#BFA9C1]" />
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-2 font-nunito text-sm text-[#3E2F35]/60">We'll surface suggestions as you answer more questions.</p>
  );

export default function RecommendationPanel({
  recommendations,
  answeredCount,
  totalQuestions,
}: RecommendationPanelProps) {
  const progressText = answeredCount > 0 ? `${answeredCount} / ${totalQuestions} answered` : 'Start the questionnaire to unlock recommendations';

  return (
    <div className="sticky top-6 w-full">
      <div className="rounded-[32px] border border-[#BFA9C1]/30 bg-[#FFF8F4] p-6 shadow-lg">
        <div className="flex items-center justify-between rounded-2xl bg-[#EED9E8] px-4 py-3 font-nunito text-sm text-[#3E2F35]">
          <span>Real-time Picks</span>
          <span className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/70">Live</span>
        </div>
        <p className="mt-3 font-script text-3xl text-[#BFA9C1]">Tailored to you</p>
        <p className="font-nunito text-sm text-[#3E2F35]/80">{progressText}</p>
        <div className="mt-5 space-y-5">
          <section>
            <p className="font-serif text-lg text-[#3E2F35]">Strollers</p>
            {renderList(recommendations.strollers)}
          </section>
          <section>
            <p className="font-serif text-lg text-[#3E2F35]">Car Seats</p>
            {renderList(recommendations.carSeats)}
          </section>
          <section>
            <p className="font-serif text-lg text-[#3E2F35]">Nursery</p>
            {renderList(recommendations.nursery)}
          </section>
          <section>
            <p className="font-serif text-lg text-[#3E2F35]">Travel Gear</p>
            {renderList(recommendations.travel)}
          </section>
          {recommendations.extras.length ? (
            <section>
              <p className="font-serif text-lg text-[#3E2F35]">Notes</p>
              {renderList(recommendations.extras)}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
