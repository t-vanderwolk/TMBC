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
      <article className="flex h-full flex-col gap-5 rounded-[32px] border border-[rgba(62,47,53,0.12)] bg-white/95 p-6 transition-colors duration-200 hover:border-[var(--tmbc-mauve)]/30">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[rgba(62,47,53,0.15)] bg-[var(--tmbc-blush)]/40">
            {icon}
          </span>
          {accent && <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">{accent}</p>}
        </div>
        <div className="space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl text-[var(--tmbc-charcoal)]">{title}</h3>
          <p className="text-base leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-75">{description}</p>
        </div>
      </article>
    </Reveal>
  );
};

export default FeatureBlock;
