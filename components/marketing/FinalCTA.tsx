import Image from "next/image";
import Link from "next/link";
import InviteCodeEntry from "@/components/marketing/InviteCodeEntry";
import ImageFrame from "@/components/marketing/ImageFrame";

type FinalCTAProps = {
  title: string;
  subtitle: string;
  bullets: string[];
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
};

export default function FinalCTA({ title, subtitle, bullets, ctaLabel, imageSrc, imageAlt }: FinalCTAProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/80 px-8 py-10 shadow-sm">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Ready when baby lets you breathe</p>
          <h2 className="text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900 max-w-2xl">{title}</h2>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-600 max-w-2xl">{subtitle}</p>
          <ul className="mt-6 space-y-3 text-base sm:text-lg text-neutral-600 max-w-xl">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/request-invite"
              className="h-12 rounded-full bg-[var(--tmbc-charcoal)] px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              {ctaLabel}
            </Link>
          </div>
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
            <InviteCodeEntry rowClassName="flex flex-col gap-3 sm:flex-row sm:items-center" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-[520px]">
            <ImageFrame className="h-full">
              <div className="h-[360px] w-full">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={960}
                  height={640}
                  className="h-full w-full object-contain"
                />
              </div>
            </ImageFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
