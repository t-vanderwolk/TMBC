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

// TMBC Canon:
// Marketing reflects mentor-led planning.
// We do not promise automation the app does not deliver.
const MarketingSection = ({ title, subtitle, children }: MarketingSectionProps) => {
  return (
    <motion.section
      className="marketing-section rounded-[34px] border-l-4 border-[var(--tmbc-mauve)]/40 bg-white/90 px-6 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={sectionVariant}
      transition={{ duration: 0.7 }}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">{title}</p>
        {subtitle && (
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">{subtitle}</h2>
        )}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </motion.section>
  );
};

export default MarketingSection;
