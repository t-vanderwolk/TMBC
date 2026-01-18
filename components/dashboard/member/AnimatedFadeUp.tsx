"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type AnimatedFadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | number[];
};

export default function AnimatedFadeUp({ children, className, delay = 0, duration, ease }: AnimatedFadeUpProps) {
  const shouldReduceMotion = useReducedMotion();

  const initialState = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const transition = shouldReduceMotion
    ? { delay: 0, duration: 0 }
    : {
        delay,
        duration: duration ?? 0.45,
        ease: ease ?? "easeOut",
      };

  return (
    <motion.div className={className} initial={initialState} animate={{ opacity: 1, y: 0 }} transition={transition}>
      {children}
    </motion.div>
  );
}
