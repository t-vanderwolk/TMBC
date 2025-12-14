"use client";

import type { ReactNode } from "react";

import Reveal from "@/components/marketing/Reveal";

type FeatureBlockProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: string;
};

const FeatureBlock = ({ icon, title, description, accent }: FeatureBlockProps) => {
  return (
    <Reveal variant="fade-up" className="h-full">
      <article className="flex h-full flex-col gap-5 rounded-[32px] border border-[var(--tmbc-blush)] bg-white/80 p-6 shadow-[0_25px_65px_rgba(199,166,199,0.25)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_100px_rgba(199,166,199,0.35)]">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[var(--tmbc-gold)] bg-[var(--tmbc-blush)]/90 shadow-[0_20px_45px_rgba(214,183,154,0.35)]">
            {icon}
          </span>
          {accent && <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">{accent}</p>}
        </div>
        <div className="space-y-3">
          <h3 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">{title}</h3>
          <p className="text-sm leading-relaxed text-[var(--tmbc-charcoal)]/75">{description}</p>
        </div>
      </article>
    </Reveal>
  );
};

export default FeatureBlock;
