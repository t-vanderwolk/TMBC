"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const COPY_LINES = [
  "A soft reminder that calm is still momentum.",
  "You can come back to this as many times as you need.",
  "This moment is yours to linger with, quietly.",
  "No rush—only steady breath and gentle curiosity.",
];

type EasterEggCopyProps = {
  className?: string;
};

export default function EasterEggCopy({ className = "" }: EasterEggCopyProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % COPY_LINES.length);
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, [shouldReduceMotion]);

  return (
    <p
      className={`text-[0.65rem] italic leading-relaxed text-member-text-secondary/60 transition-opacity duration-300 ${className}`}
      aria-live="polite"
    >
      {COPY_LINES[index]}
    </p>
  );
}
