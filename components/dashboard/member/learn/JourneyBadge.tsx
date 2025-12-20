"use client";

type JourneyBadgeProps = {
  journey?: string;
};

const JOURNEY_STYLES: Record<string, { bg: string; text: string }> = {
  nursery: { bg: "bg-[#F9ECF1]", text: "text-[#B66892]" },
  gear: { bg: "bg-[#F0F4EB]", text: "text-[#6C7C5B]" },
  postpartum: { bg: "bg-[#F6F1ED]", text: "text-[#A17774]" },
};

const normalizeJourney = (journey?: string) => {
  if (!journey) return { label: "Studio journey", ...JOURNEY_STYLES.nursery };
  const key = journey.toLowerCase();
  const style = JOURNEY_STYLES[key] ?? JOURNEY_STYLES.nursery;
  const label = journey.charAt(0).toUpperCase() + journey.slice(1);
  return { label, ...style };
};

function JourneyBadge({ journey }: JourneyBadgeProps) {
  const { bg, text, label } = normalizeJourney(journey);
  return (
    <span className={`rounded-full border border-transparent px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] ${bg} ${text}`}>
      {label}
    </span>
  );
}

export default JourneyBadge;
export type { JourneyBadgeProps };
