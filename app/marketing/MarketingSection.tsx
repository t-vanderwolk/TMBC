"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type MarketingSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const sectionVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const MarketingSection = ({ title, subtitle, children }: MarketingSectionProps) => {
  return (
    <motion.section
      className="rounded-3xl border-l-4 border-[var(--tmbc-mauve)] bg-white/90 p-6 shadow-[0_30px_65px_rgba(199,166,199,0.2)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={sectionVariant}
      transition={{ duration: 0.7 }}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">{title}</p>
        {subtitle && <h2 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">{subtitle}</h2>}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </motion.section>
  );
};

export default MarketingSection;
