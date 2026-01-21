import Image from "next/image";
import ImageFrame from "@/components/marketing/ImageFrame";

type Step = {
  number: string;
  title: string;
  description: string;
  preview: {
    src: string;
    alt: string;
  };
};

type StepsProps = {
  steps: Step[];
};

export default function Steps({ steps }: StepsProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {steps.map((step) => (
        <article key={step.title} className="mkt-card space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.32em] text-[var(--tmbc-charcoal)]/45">
              Step {step.number}
            </span>
            <p className="mt-3 text-2xl font-semibold text-[var(--tmbc-charcoal)]">{step.title}</p>
          </div>
          <p className="text-sm leading-relaxed text-[var(--tmbc-charcoal)]/70">{step.description}</p>
          <ImageFrame className="w-full">
            <div className="aspect-[16/10] w-full">
              <Image
                src={step.preview.src}
                alt={step.preview.alt}
                width={640}
                height={400}
                className="h-full w-full object-contain"
              />
            </div>
          </ImageFrame>
        </article>
      ))}
    </div>
  );
}
