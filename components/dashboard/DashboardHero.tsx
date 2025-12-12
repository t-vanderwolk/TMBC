"use client";

import { motion } from "framer-motion";

type DashboardHeroProps = {
  name: string;
};

export default function DashboardHero({ name }: DashboardHeroProps) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const affirmations = [
    "You’re preparing with so much love — it shows.",
    "Small steps count. You’re right on time.",
    "A calm plan is the best plan.",
    "You’re doing beautifully — truly.",
  ];

  const phrase = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EED9E8]/70 via-[#FFF8F4] to-[#BFA9C1]/30 p-8 md:p-12 mb-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
    >
      <span className="absolute left-6 top-6 inline-flex items-center justify-center rounded-full bg-[#D7C49E]/60 px-3 py-1 text-[0.65rem] font-[var(--font-nunito)] font-semibold uppercase tracking-[0.4em] text-[#3E2F35] shadow-sm">
        Welcome Back, Mama
      </span>
      <div className="relative pt-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/70 font-[var(--font-nunito)] font-semibold">
          {greeting}, {name}
        </p>
        <div className="relative mt-4 inline-flex flex-col">
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl text-[#3E2F35] leading-tight">
            Your calm prep command center
          </h1>
          <span className="absolute -bottom-1 left-0 h-1 w-24 rounded-full bg-[#D7C49E]/70" />
        </div>
        <p className="mt-4 max-w-2xl font-[var(--font-nunito)] text-base md:text-lg text-[#3E2F35]/70">
          {phrase}
        </p>
      </div>
    </motion.section>
  );
}
