type PillarContent = {
  title: string;
  subheading: string;
  paragraphs: string[];
};

export const PILLAR_CONTENT: Record<"learn" | "plan" | "connect" | "reflect", PillarContent> = {
  learn: {
    title: "Learn",
    subheading: "Understanding comes before buying.",
    paragraphs: [
      "This is where everything starts. Expecting parents are calmly walked through the major categories of baby gear — strollers, car seats, carriers, nursery items, feeding, and more — in a clear, structured way.",
      "The goal isn’t shopping. It’s understanding what each category is designed to do, how it fits into daily life, and which ones may or may not apply to your space, routines, and priorities.",
      "Once parents understand the landscape, decisions feel easier — and far more personal.",
    ],
  },
  plan: {
    title: "Plan",
    subheading: "Thoughtful decisions, made together.",
    paragraphs: [
      "After parents clarify what matters to them, they work one-on-one with a mentor to build a thoughtful plan and decide which specific items belong on their registry.",
      "This happens inside an interactive workspace that auto-saves, so nothing feels rushed or lost.",
      "Planning is collaborative, paced, and grounded in real-world use — not trends, pressure, or endless scrolling.",
    ],
  },
  connect: {
    title: "Connect",
    subheading: "Learn alongside people in the same season.",
    paragraphs: [
      "Parents following the same learning path can connect inside the TMBC community — quiet, moderated chat rooms designed for focused conversation.",
      "Instead of overwhelming feeds or open forums, this space is intentionally smaller and calmer.",
      "Parents ask questions, compare notes, and learn alongside others who are at the same stage, using the same framework.",
    ],
  },
  reflect: {
    title: "Reflect",
    subheading: "A private record of this season.",
    paragraphs: [
      "Reflect is a personal time vault — a modern baby book designed to hold both milestones and in-between moments.",
      "Parents can save ultrasound photos, names they’re considering, notes about this stage, screenshots of loved ones’ reactions, voice notes, and daily reflections.",
      "When they’re ready, they can seal the vault and preserve it as a finished chapter of this season.",
    ],
  },
};

type PillarExplanationProps = PillarContent & {
  className?: string;
};

export default function PillarExplanation({ title, subheading, paragraphs, className = "" }: PillarExplanationProps) {
  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <p className="mkt-eyebrow">{title}</p>
      <h2 className="mkt-h2">{subheading}</h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
